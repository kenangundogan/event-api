const Joi = require('joi');

// Create validation schema
const createRoleSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .pattern(/^[a-z0-9_-]+$/)
        .messages({
            'string.min': 'Rol adı en az 2 karakter olmalıdır',
            'string.max': 'Rol adı 50 karakterden uzun olamaz',
            'string.pattern.base': 'Rol adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir',
            'any.required': 'Rol adı zorunludur'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
        }),

    permissions: Joi.array()
        .items(Joi.string().valid(
            'user:read',
            'user:create',
            'user:update',
            'user:delete',
            'user:list',
            'event:read',
            'event:create',
            'event:update',
            'event:delete',
            'event:list',
            'category:read',
            'category:create',
            'category:update',
            'category:delete',
            'category:list',
            'system:admin',
            'system:settings',
            'system:logs'
        ))
        .optional()
        .messages({
            'array.includes': 'Geçersiz izin'
        }),

    isActive: Joi.boolean()
        .default(true)
        .optional(),

    isDefault: Joi.boolean()
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

// Update validation schema
const updateRoleSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-z0-9_-]+$/)
        .optional()
        .messages({
            'string.min': 'Rol adı en az 2 karakter olmalıdır',
            'string.max': 'Rol adı 50 karakterden uzun olamaz',
            'string.pattern.base': 'Rol adı sadece küçük harf, rakam, tire ve alt çizgi içerebilir'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Açıklama 500 karakterden uzun olamaz'
        }),

    permissions: Joi.array()
        .items(Joi.string().valid(
            'user:read',
            'user:create',
            'user:update',
            'user:delete',
            'user:list',
            'event:read',
            'event:create',
            'event:update',
            'event:delete',
            'event:list',
            'category:read',
            'category:create',
            'category:update',
            'category:delete',
            'category:list',
            'system:admin',
            'system:settings',
            'system:logs'
        ))
        .optional()
        .messages({
            'array.includes': 'Geçersiz izin'
        }),

    isActive: Joi.boolean()
        .optional(),

    isDefault: Joi.boolean()
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
    createRoleSchema,
    updateRoleSchema
}; 