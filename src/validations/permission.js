const Joi = require('joi');

// Create validation schema
const createPermissionSchema = Joi.object({
    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
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

// Update validation schema
const updatePermissionSchema = Joi.object({
    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
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