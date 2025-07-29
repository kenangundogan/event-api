const { queryBuilder } = require('../utils/queryBuilder');

class BaseController {
    constructor(model, options = {}) {
        this.model = model;
        this.modelName = model.modelName ? model.modelName.toLowerCase() : 'item';
        this.validation = options.validation || {};
        this.defaultSelect = options.defaultSelect || '';
        this.defaultSort = options.defaultSort || { createdAt: -1 };
    }

    // Tüm kayıtları getir
    getAll = async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                select,
                with: relations,
                filter,
                sort
            } = req.query;

            // Query Builder başlat
            const query = queryBuilder(this.model)
                .setPath(`/api/${this.modelName}s`)
                .setQueryParams(req.query);

            // Filtreleme
            console.log('Query params:', req.query);
            Object.keys(req.query).forEach(key => {
                if (key.startsWith('filter[') && key.endsWith(']')) {
                    const field = key.slice(7, -1);
                    const value = req.query[key];
                    console.log('Filter:', field, value);
                    
                    // Virgülle ayrılmış değerleri array'e çevir
                    if (typeof value === 'string' && value.includes(',')) {
                        query.where(field, 'in', value.split(',').map(v => v.trim()));
                    } else {
                        query.where(field, 'eq', value);
                    }
                }
            });

            // Sıralama
            if (sort) {
                query.applySort(sort);
            } else if (this.defaultSort) {
                // Varsayılan sıralama
                Object.keys(this.defaultSort).forEach(field => {
                    query.sort[field] = this.defaultSort[field];
                });
            }

            // Alan seçimi
            if (select) {
                query.select(select);
            } else if (this.defaultSelect) {
                query.select(this.defaultSelect);
            }

            // İlişkiler
            if (relations) {
                query.with(relations);
            }

            // Sayfalama
            query.paginate(parseInt(page), parseInt(limit));

            // Sorguyu çalıştır
            const result = await query.get();

            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `${this.modelName} listesi getirilirken hata oluştu`,
                error: error.message
            });
        }
    }

    // Tek kayıt getir
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const { select, with: relations } = req.query;

            let query = this.model.findById(id);

            if (select) {
                query = query.select(select);
            } else if (this.defaultSelect) {
                query = query.select(this.defaultSelect);
            }

            if (relations) {
                query = query.populate(relations);
            }

            const item = await query;

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: `${this.modelName} bulunamadı`
                });
            }

            res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `${this.modelName} getirilirken hata oluştu`,
                error: error.message
            });
        }
    }

    // Yeni kayıt oluştur
    create = async (req, res) => {
        try {
            const createSchema = this.validation.create;
            if (createSchema) {
                const { error, value } = createSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Geçersiz veri',
                        errors: error.details.map(detail => detail.message)
                    });
                }
            }

            const item = new this.model(req.body);
            await item.save();

            res.status(201).json({
                success: true,
                message: `${this.modelName} başarıyla oluşturuldu`,
                data: item
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu kayıt zaten mevcut'
                });
            }

            res.status(500).json({
                success: false,
                message: `${this.modelName} oluşturulurken hata oluştu`,
                error: error.message
            });
        }
    }

    // Kayıt güncelle
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const updateSchema = this.validation.update;
            
            if (updateSchema) {
                const { error, value } = updateSchema.validate(req.body);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Geçersiz veri',
                        errors: error.details.map(detail => detail.message)
                    });
                }
            }

            const item = await this.model.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: `${this.modelName} bulunamadı`
                });
            }

            res.status(200).json({
                success: true,
                message: `${this.modelName} başarıyla güncellendi`,
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `${this.modelName} güncellenirken hata oluştu`,
                error: error.message
            });
        }
    }

    // Kayıt sil
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findByIdAndDelete(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: `${this.modelName} bulunamadı`
                });
            }

            res.status(200).json({
                success: true,
                message: `${this.modelName} başarıyla silindi`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `${this.modelName} silinirken hata oluştu`,
                error: error.message
            });
        }
    }
}

module.exports = BaseController; 