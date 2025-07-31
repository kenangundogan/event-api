const Joi = require('joi');

// Create validation schema
const createContinentSchema = Joi.object({
    code: Joi.string()
        .min(2)
        .max(3)
        .required()
        .messages({
            'string.min': 'Kıta kodu en az 2 karakter olmalıdır',
            'string.max': 'Kıta kodu 3 karakterden uzun olamaz',
            'any.required': 'Kıta kodu zorunludur'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Kıta adı en az 2 karakter olmalıdır',
            'string.max': 'Kıta adı 100 karakterden uzun olamaz',
            'any.required': 'Kıta adı zorunludur'
        }),

    nativeName: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Yerel ad 100 karakterden uzun olamaz'
        }),

    locale: Joi.string()
        .max(10)
        .optional()
        .messages({
            'string.max': 'Dil kodu 10 karakterden uzun olamaz'
        }),

    latitude: Joi.number()
        .min(-90)
        .max(90)
        .optional()
        .messages({
            'number.base': 'Enlem sayı olmalıdır',
            'number.min': 'Enlem -90 ile 90 arasında olmalıdır',
            'number.max': 'Enlem -90 ile 90 arasında olmalıdır'
        }),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .optional()
        .messages({
            'number.base': 'Boylam sayı olmalıdır',
            'number.min': 'Boylam -180 ile 180 arasında olmalıdır',
            'number.max': 'Boylam -180 ile 180 arasında olmalıdır'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'archived', 'deleted')
        .default('active')
        .optional()
        .messages({
            'any.only': 'Geçersiz durum değeri'
        })
});

// Update validation schema
const updateContinentSchema = Joi.object({
    code: Joi.string()
        .min(2)
        .max(3)
        .optional()
        .messages({
            'string.min': 'Kıta kodu en az 2 karakter olmalıdır',
            'string.max': 'Kıta kodu 3 karakterden uzun olamaz'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Kıta adı en az 2 karakter olmalıdır',
            'string.max': 'Kıta adı 100 karakterden uzun olamaz'
        }),

    nativeName: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Yerel ad 100 karakterden uzun olamaz'
        }),

    locale: Joi.string()
        .max(10)
        .optional()
        .messages({
            'string.max': 'Dil kodu 10 karakterden uzun olamaz'
        }),

    latitude: Joi.number()
        .min(-90)
        .max(90)
        .optional()
        .messages({
            'number.base': 'Enlem sayı olmalıdır',
            'number.min': 'Enlem -90 ile 90 arasında olmalıdır',
            'number.max': 'Enlem -90 ile 90 arasında olmalıdır'
        }),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .optional()
        .messages({
            'number.base': 'Boylam sayı olmalıdır',
            'number.min': 'Boylam -180 ile 180 arasında olmalıdır',
            'number.max': 'Boylam -180 ile 180 arasında olmalıdır'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'archived', 'deleted')
        .optional()
        .messages({
            'any.only': 'Geçersiz durum değeri'
        })
});

module.exports = {
    createContinentSchema,
    updateContinentSchema
}; 