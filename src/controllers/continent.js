const Continent = require('../models/Continent');
const { createContinentSchema, updateContinentSchema } = require('../validations/continent');

class ContinentController {
    async getAll(req, res) {
        try {
            const { status } = req.query;

            let query = {};
            if (status) {
                query.status = status;
            }

            const continents = await Continent.find(query)
                .sort({ name: 1 });

            res.status(200).json({
                success: true,
                data: continents
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıtalar getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const continent = await Continent.findById(id);

            if (!continent) {
                return res.status(404).json({
                    success: false,
                    message: 'Kıta bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: continent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıta getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getByCode(req, res) {
        try {
            const { code } = req.params;

            const continent = await Continent.findOne({ code: code.toUpperCase() });

            if (!continent) {
                return res.status(404).json({
                    success: false,
                    message: 'Kıta bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: continent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıta getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createContinentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Aynı kod veya isim var mı kontrol et
            const existingContinent = await Continent.findOne({
                $or: [
                    { code: value.code },
                    { name: value.name }
                ]
            });

            if (existingContinent) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu kıta kodu veya adı zaten mevcut'
                });
            }

            const continent = new Continent(value);
            await continent.save();

            res.status(201).json({
                success: true,
                message: 'Kıta başarıyla oluşturuldu',
                data: continent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıta oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateContinentSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Eğer code veya name değişiyorsa, çakışma kontrolü yap
            if (value.code || value.name) {
                const existingContinent = await Continent.findOne({
                    $or: [
                        { code: value.code },
                        { name: value.name }
                    ],
                    _id: { $ne: id }
                });

                if (existingContinent) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu kıta kodu veya adı zaten mevcut'
                    });
                }
            }

            const continent = await Continent.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            );

            if (!continent) {
                return res.status(404).json({
                    success: false,
                    message: 'Kıta bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Kıta başarıyla güncellendi',
                data: continent
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıta güncellenirken hata oluştu',
                error: error.message
            });
        }
    }
    
    async delete(req, res) {
        try {
            const { id } = req.params;

            const continent = await Continent.findByIdAndDelete(id);

            if (!continent) {
                return res.status(404).json({
                    success: false,
                    message: 'Kıta bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Kıta başarıyla silindi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kıta silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new ContinentController(); 