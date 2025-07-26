const Joi = require('joi');

// Permission oluşturma validation şeması
const createPermissionSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .pattern(/^[a-z0-9_-]+$/)
        .messages({
            'string.min': 'İzin adı en az 2 karakter olmalıdır',
            'string.max': 'İzin adı 100 karakterden uzun olamaz',
            'string.pattern.base': 'İzin adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir',
            'any.required': 'İzin adı zorunludur'
        }),

    displayName: Joi.string()
        .min(2)
        .max(200)
        .required()
        .messages({
            'string.min': 'Görünen ad en az 2 karakter olmalıdır',
            'string.max': 'Görünen ad 200 karakterden uzun olamaz',
            'any.required': 'Görünen ad zorunludur'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
        }),

    category: Joi.string()
        .valid('user', 'event', 'category', 'system', 'other')
        .default('other')
        .messages({
            'any.only': 'Geçersiz kategori'
        }),

    resource: Joi.string()
        .min(2)
        .max(50)
        .required()
        .pattern(/^[a-z0-9_-]+$/)
        .messages({
            'string.min': 'Kaynak adı en az 2 karakter olmalıdır',
            'string.max': 'Kaynak adı 50 karakterden uzun olamaz',
            'string.pattern.base': 'Kaynak adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir',
            'any.required': 'Kaynak adı zorunludur'
        }),

    action: Joi.string()
        .valid('read', 'create', 'update', 'delete', 'list', 'approve', 'reject', 'admin', 'settings', 'logs')
        .default('read')
        .messages({
            'any.only': 'Geçersiz eylem'
        }),

    isActive: Joi.boolean()
        .default(true)
        .optional(),

    isSystem: Joi.boolean()
        .default(false)
        .optional(),

    priority: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .messages({
            'number.base': 'Öncelik sayı olmalıdır',
            'number.integer': 'Öncelik tam sayı olmalıdır',
            'number.min': 'Öncelik 0\'dan küçük olamaz'
        })
});

// Permission güncelleme validation şeması
const updatePermissionSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-z0-9_-]+$/)
        .optional()
        .messages({
            'string.min': 'İzin adı en az 2 karakter olmalıdır',
            'string.max': 'İzin adı 100 karakterden uzun olamaz',
            'string.pattern.base': 'İzin adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir'
        }),

    displayName: Joi.string()
        .min(2)
        .max(200)
        .optional()
        .messages({
            'string.min': 'Görünen ad en az 2 karakter olmalıdır',
            'string.max': 'Görünen ad 200 karakterden uzun olamaz'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
        }),

    category: Joi.string()
        .valid('user', 'event', 'category', 'system', 'other')
        .optional()
        .messages({
            'any.only': 'Geçersiz kategori'
        }),

    resource: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-z0-9_-]+$/)
        .optional()
        .messages({
            'string.min': 'Kaynak adı en az 2 karakter olmalıdır',
            'string.max': 'Kaynak adı 50 karakterden uzun olamaz',
            'string.pattern.base': 'Kaynak adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir'
        }),

    action: Joi.string()
        .valid('read', 'create', 'update', 'delete', 'list', 'approve', 'reject', 'admin', 'settings', 'logs')
        .optional()
        .messages({
            'any.only': 'Geçersiz eylem'
        }),

    isActive: Joi.boolean()
        .optional(),

    isSystem: Joi.boolean()
        .optional(),

    priority: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'Öncelik sayı olmalıdır',
            'number.integer': 'Öncelik tam sayı olmalıdır',
            'number.min': 'Öncelik 0\'dan küçük olamaz'
        })
});

module.exports = {
    createPermissionSchema,
    updatePermissionSchema
}; 