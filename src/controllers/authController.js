const User = require('../models/User');
const {
    registerSchema,
    loginSchema,
    changeOwnPasswordSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validations/authValidation');
const { updateProfileSchema } = require('../validations/authValidation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    async register(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body);
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
            const userData = {
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email,
                password: value.password,
                phone: value.phone,
                preferences: value.preferences,
                role: defaultRole._id
            };

            const user = new User(userData);
            await user.save();

            res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla kaydedildi',
                data: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: defaultRole.name,
                    isActive: user.isActive,
                    isEmailVerified: user.isEmailVerified
                }
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
                message: 'Kayıt işlemi sırasında hata oluştu',
                error: error.message
            });
        }
    }

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

    async logout(req, res) {
        try {
            // JWT stateless olduğu için client tarafında token'ı silmek yeterli
            // Eğer blacklist mekanizması istiyorsanız burada implement edebilirsiniz
            res.status(200).json({
                success: true,
                message: 'Başarıyla çıkış yapıldı'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Çıkış yapılırken hata oluştu',
                error: error.message
            });
        }
    }

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

    async changeOwnPassword(req, res) {
        try {
            const userId = req.user.userId;
            const { error, value } = changeOwnPasswordSchema.validate(req.body);

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

    async forgotPassword(req, res) {
        try {
            const { error, value } = forgotPasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { email } = value;

            // Kullanıcıyı bul
            const user = await User.findOne({ email });
            if (!user) {
                // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı döndür
                return res.status(200).json({
                    success: true,
                    message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi'
                });
            }

            // Reset token oluştur (1 saat geçerli)
            const resetToken = jwt.sign(
                { userId: user._id, type: 'password-reset' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // TODO: Email gönderme işlemi burada yapılacak
            // Şimdilik token'ı response'da döndürüyoruz (test için)
            console.log('Reset token:', resetToken);

            res.status(200).json({
                success: true,
                message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şifre sıfırlama işlemi sırasında hata oluştu',
                error: error.message
            });
        }
    }

    async resetPassword(req, res) {
        try {
            const { error, value } = resetPasswordSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veri',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { token, newPassword, confirmPassword } = value;

            // Token'ı doğrula
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz veya süresi dolmuş token'
                });
            }

            // Token tipini kontrol et
            if (decoded.type !== 'password-reset') {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz token tipi'
                });
            }

            // Kullanıcıyı bul
            const user = await User.findById(decoded.userId);
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
                message: 'Şifreniz başarıyla sıfırlandı'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Şifre sıfırlama işlemi sırasında hata oluştu',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController(); 