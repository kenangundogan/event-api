const User = require('../models/User');
const {
    createUserSchema,
    updateUserSchema,
    updateProfileSchema,
    changePasswordSchema,
    loginSchema,
    userQuerySchema
} = require('../validations/userValidation');
const { queryBuilder } = require('../utils/queryBuilder');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserController {
    // Tüm kullanıcıları getir (profesyonel query builder ile)
    async getAllUsers(req, res) {
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

    // Tek kullanıcı getir
    async getUserById(req, res) {
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

    // Yeni kullanıcı oluştur
    async createUser(req, res) {
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

    // Kullanıcı güncelle
    async updateUser(req, res) {
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

    // Kullanıcı sil (soft delete)
    async deleteUser(req, res) {
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

    // Kullanıcı girişi
    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { email, password } = value;

            // Kullanıcıyı bul (password dahil)
            const user = await User.findOne({ email }).select('+password').populate('role');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz email veya şifre'
                });
            }

            // Şifre kontrolü
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz email veya şifre'
                });
            }

            // Kullanıcı aktif mi kontrol et
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Hesabınız aktif değil'
                });
            }

            // JWT token oluştur
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email,
                    role: user.role?.name || 'user'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Giriş başarılı',
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role?.name || 'user',
                        isActive: user.isActive,
                        isEmailVerified: user.isEmailVerified
                    },
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Giriş yapılırken hata oluştu',
                error: error.message
            });
        }
    }

    // Şifre değiştirme (admin)
    async changePassword(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = changePasswordSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { newPassword, confirmPassword } = value;

            // Şifre eşleşme kontrolü
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Şifreler eşleşmiyor'
                });
            }

            // Kullanıcıyı bul
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            // Yeni şifreyi hash'le
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Şifreyi güncelle
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Şifre başarıyla değiştirildi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şifre değiştirilirken hata oluştu',
                error: error.message
            });
        }
    }

    // Kullanıcı profili getir
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const user = await User.findById(userId)
                .select('-password')
                .populate('role');

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
                message: 'Profil getirilirken hata oluştu',
                error: error.message
            });
        }
    }

    // Kendi profilini güncelle
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { error, value } = updateProfileSchema.validate(req.body);

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
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: 'Bu email adresi zaten kullanılıyor'
                    });
                }
            }

            const user = await User.findByIdAndUpdate(
                userId,
                value,
                { new: true, runValidators: true }
            ).select('-password');

            res.status(200).json({
                success: true,
                message: 'Profil başarıyla güncellendi',
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
                message: 'Profil güncellenirken hata oluştu',
                error: error.message
            });
        }
    }

    // Kendi şifresini değiştir
    async changeOwnPassword(req, res) {
        try {
            const userId = req.user.userId;
            const { error, value } = changePasswordSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { currentPassword, newPassword, confirmPassword } = value;

            // Şifre eşleşme kontrolü
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Yeni şifreler eşleşmiyor'
                });
            }

            // Kullanıcıyı bul (password dahil)
            const user = await User.findById(userId).select('+password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            // Mevcut şifre kontrolü
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Mevcut şifre yanlış'
                });
            }

            // Yeni şifreyi hash'le
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Şifreyi güncelle
            await User.findByIdAndUpdate(userId, { password: hashedPassword });

            res.status(200).json({
                success: true,
                message: 'Şifreniz başarıyla değiştirildi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şifre değiştirilirken hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new UserController(); 