const Joi = require('joi');

// User oluşturma validation şeması
const createUserSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Ad en az 2 karakter olmalıdır',
            'string.max': 'Ad 50 karakterden uzun olamaz',
            'any.required': 'Ad alanı zorunludur'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Soyad en az 2 karakter olmalıdır',
            'string.max': 'Soyad 50 karakterden uzun olamaz',
            'any.required': 'Soyad alanı zorunludur'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Geçerli bir email adresi giriniz',
            'any.required': 'Email alanı zorunludur'
        }),

    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Şifre en az 6 karakter olmalıdır',
            'string.pattern.base': 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
            'any.required': 'Şifre alanı zorunludur'
        }),

    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .messages({
            'string.pattern.base': 'Geçerli bir telefon numarası giriniz'
        }),

    role: Joi.string()
        .optional()
        .messages({
            'any.only': 'Geçersiz rol seçimi'
        }),

    preferences: Joi.object({
        notifications: Joi.object({
            email: Joi.boolean().default(true),
            push: Joi.boolean().default(true),
            sms: Joi.boolean().default(false)
        }).optional(),
        language: Joi.string().valid('tr', 'en').default('tr')
    }).optional()
});

// User güncelleme validation şeması (Admin için)
const updateUserSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Ad en az 2 karakter olmalıdır',
            'string.max': 'Ad 50 karakterden uzun olamaz'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Soyad en az 2 karakter olmalıdır',
            'string.max': 'Soyad 50 karakterden uzun olamaz'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Geçerli bir email adresi giriniz'
        }),

    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .messages({
            'string.pattern.base': 'Geçerli bir telefon numarası giriniz'
        }),

    role: Joi.string()
        .valid('user', 'admin', 'moderator')
        .optional()
        .messages({
            'any.only': 'Geçersiz rol seçimi'
        }),

    isActive: Joi.boolean().optional(),

    preferences: Joi.object({
        notifications: Joi.object({
            email: Joi.boolean(),
            push: Joi.boolean(),
            sms: Joi.boolean()
        }).optional(),
        language: Joi.string().valid('tr', 'en')
    }).optional()
});

// Kullanıcı kendi profilini güncelleme validation şeması
const updateProfileSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Ad en az 2 karakter olmalıdır',
            'string.max': 'Ad 50 karakterden uzun olamaz'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Soyad en az 2 karakter olmalıdır',
            'string.max': 'Soyad 50 karakterden uzun olamaz'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Geçerli bir email adresi giriniz'
        }),

    phone: Joi.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .messages({
            'string.pattern.base': 'Geçerli bir telefon numarası giriniz'
        }),

    preferences: Joi.object({
        notifications: Joi.object({
            email: Joi.boolean(),
            push: Joi.boolean(),
            sms: Joi.boolean()
        }).optional(),
        language: Joi.string().valid('tr', 'en')
    }).optional()
});

// Şifre değiştirme validation şeması
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Mevcut şifre zorunludur'
        }),

    newPassword: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Yeni şifre en az 6 karakter olmalıdır',
            'string.pattern.base': 'Yeni şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
            'any.required': 'Yeni şifre zorunludur'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Şifreler eşleşmiyor',
            'any.required': 'Şifre onayı zorunludur'
        })
});

// Login validation şeması
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Geçerli bir email adresi giriniz',
            'any.required': 'Email alanı zorunludur'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Şifre alanı zorunludur'
        })
});

// Query parametreleri validation şeması
const userQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    select: Joi.string().optional(),
    with: Joi.string().optional(),
    filter: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    sort: Joi.string().optional()
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    updateProfileSchema,
    changePasswordSchema,
    loginSchema,
    userQuerySchema
}; 