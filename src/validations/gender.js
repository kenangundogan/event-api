const Joi = require('joi');

// Create validation schema
const createGenderSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Ad en az 2 karakter olmalıdır',
            'string.max': 'Ad 50 karakterden uzun olamaz',
            'any.required': 'Ad alanı zorunludur'
        }),

    description: Joi.string()
        .required()
        .messages({
            'any.required': 'Açıklama alanı zorunludur'
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
const updateGenderSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Ad en az 2 karakter olmalıdır',
            'string.max': 'Ad 50 karakterden uzun olamaz'
        }),

    description: Joi.string()
        .optional()
        .messages({
            'any.required': 'Açıklama alanı zorunludur'
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

// Query parameters validation schema
const genderQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    select: Joi.string().optional(),
    with: Joi.string().optional(),
    filter: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    sort: Joi.string().optional()
});

module.exports = {
    createGenderSchema,
    updateGenderSchema,
    genderQuerySchema
}; 