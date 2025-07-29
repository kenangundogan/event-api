const User = require('../models/User');
const {
    createUserSchema,
    updateUserSchema,
    userQuerySchema
} = require('../validations/userValidation');
const { queryBuilder } = require('../utils/queryBuilder');

class UserController {
    async getAll(req, res) {
        try {
            const { error, value } = userQuerySchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz sorgu parametreleri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { 
                page, 
                limit, 
                select,
                with: relations,
                filter,
                sort
            } = value;

            // Query Builder başlat
            const query = queryBuilder(User)
                .setPath('/api/users')
                .setSortAliases({
                    'first-name-length': { field: 'firstName', type: 'stringLength' },
                    'last-name-length': { field: 'lastName', type: 'stringLength' },
                    'email-length': { field: 'email', type: 'stringLength' },
                    'created-recent': { field: 'createdAt', type: 'date' }
                })
                .setQueryParams({
                    ...(req.query.with && { with: req.query.with }),
                    ...(req.query.limit && { limit: req.query.limit }),
                    ...(req.query.filter && { filter: req.query.filter }),
                    ...(req.query.sort && { sort: req.query.sort })
                });

            // Filtreleme
            if (filter) {
                query.applyFilters(filter, req.query);
            }

            // Sıralama
            if (sort) {
                query.applySort(sort);
            }

            // Alan seçimi
            if (select) {
                query.select(select);
            } else {
                // Varsayılan olarak password hariç tut
                query.select('-password');
            }

            // İlişkiler
            if (relations) {
                query.with(relations);
            }

            // Sayfalama
            query.paginate(page, limit);

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
                message: 'Kullanıcılar getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { select, with: relations } = req.query;

            const query = queryBuilder(User)
                .where('_id', id);

            // Alan seçimi
            if (select) {
                query.select(select);
            } else {
                query.select('-password');
            }

            // İlişkiler
            if (relations) {
                query.with(relations);
            }

            const user = await query.first();

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kullanıcı getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const { error, value } = createUserSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Email kontrolü
            const existingUser = await User.findOne({ email: value.email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu email adresi zaten kullanılıyor'
                });
            }

            // Varsayılan role'ü al
            const Role = require('../models/Role');
            const defaultRole = await Role.getDefaultRole();
            
            if (!defaultRole) {
                return res.status(500).json({
                    success: false,
                    message: 'Varsayılan rol bulunamadı'
                });
            }

            // Kullanıcıyı varsayılan role ile oluştur
            const userData = { ...value, role: defaultRole._id };
            const user = new User(userData);
            await user.save();

            res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla oluşturuldu',
                data: user
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu email adresi zaten kullanılıyor'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Kullanıcı oluşturulurken hata oluştu',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateUserSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Email değişikliği varsa kontrol et
            if (value.email) {
                const existingUser = await User.findOne({
                    email: value.email,
                    _id: { $ne: id }
                });
                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu email adresi zaten kullanılıyor'
                    });
                }
            }

            const user = await User.findByIdAndUpdate(
                id,
                value,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Kullanıcı başarıyla güncellendi',
                data: user
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Bu email adresi zaten kullanılıyor'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Kullanıcı güncellenirken hata oluştu',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Kullanıcı başarıyla silindi',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Kullanıcı silinirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new UserController(); 