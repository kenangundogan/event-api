const User = require('../models/User');
const {
    createUserSchema,
    updateUserSchema,
    updateProfileSchema,
    changePasswordSchema,
    loginSchema,
    userQuerySchema
} = require('../validations/userValidation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserController {
    // Tüm kullanıcıları getir (sayfalama ile)
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

            const { page, limit, search, role, isActive, sortBy, sortOrder } = value;
            const skip = (page - 1) * limit;

            // Filtreleme kriterleri
            const filter = {};
            if (search) {
                filter.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            if (role) filter.role = role;
            if (isActive !== undefined) filter.isActive = isActive;

            // Sıralama
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

            const users = await User.find(filter)
                .select('-password')
                .sort(sort)
                .skip(skip)
                .limit(limit);

            const total = await User.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
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

            const user = await User.findById(id).select('-password');

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
      const existingUser = await User.findByEmail(value.email);
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
                    message: 'Geçersiz giriş bilgileri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { email, password } = value;

            // Kullanıcıyı şifre ile birlikte getir
            const user = await User.findOne({ email }).select('+password');

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz email veya şifre'
                });
            }

            // Şifre kontrolü
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz email veya şifre'
                });
            }

            // Son giriş zamanını güncelle
            await user.updateLastLogin();

                  // Kullanıcının rol adını al
      const roleName = await user.getRoleName();

      // JWT token oluştur
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: roleName
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

            res.status(200).json({
                success: true,
                message: 'Giriş başarılı',
                data: {
                    user: user.toResponse(),
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

    // Şifre değiştirme
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

            const { currentPassword, newPassword } = value;

            // Kullanıcıyı şifre ile birlikte getir
            const user = await User.findById(id).select('+password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            // Mevcut şifre kontrolü
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Mevcut şifre yanlış'
                });
            }

            // Yeni şifreyi hash'le
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(newPassword, salt);
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

    // Kullanıcı profilini getir
    async getProfile(req, res) {
        try {
            const userId = req.user.userId; // JWT'den gelen kullanıcı ID'si

            const user = await User.findById(userId).select('-password');

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

    // Kullanıcı kendi profilini güncelle
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

            // Kullanıcının sadece kendi bilgilerini güncelleyebilmesi için kısıtlamalar
            const allowedFields = ['firstName', 'lastName', 'phone', 'preferences'];
            const filteredData = {};

            Object.keys(value).forEach(key => {
                if (allowedFields.includes(key)) {
                    filteredData[key] = value[key];
                }
            });

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
                filteredData.email = value.email;
            }

            const user = await User.findByIdAndUpdate(
                userId,
                filteredData,
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

    // Kullanıcı kendi şifresini değiştir
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

            const { currentPassword, newPassword } = value;

            // Kullanıcıyı şifre ile birlikte getir
            const user = await User.findById(userId).select('+password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            // Mevcut şifre kontrolü
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Mevcut şifre yanlış'
                });
            }

            // Yeni şifreyi doğrudan set et (middleware otomatik hash'leyecek)
            user.password = newPassword;
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
}

module.exports = new UserController(); 