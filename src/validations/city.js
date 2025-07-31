const Joi = require('joi');

// Create validation schema
const createCitySchema = Joi.object({
    countryId: Joi.string()
        .required()
        .messages({
            'any.required': 'Ülke zorunludur'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Şehir adı en az 2 karakter olmalıdır',
            'string.max': 'Şehir adı 100 karakterden uzun olamaz',
            'any.required': 'Şehir adı zorunludur'
        }),

    isCapital: Joi.boolean()
        .default(false)
        .optional()
        .messages({
            'boolean.base': 'Başkent değeri boolean olmalıdır'
        }),

    region: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Bölge adı 100 karakterden uzun olamaz'
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
const updateCitySchema = Joi.object({
    countryId: Joi.string()
        .optional()
        .messages({
            'any.required': 'Ülke zorunludur'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Şehir adı en az 2 karakter olmalıdır',
            'string.max': 'Şehir adı 100 karakterden uzun olamaz'
        }),

    isCapital: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Başkent değeri boolean olmalıdır'
        }),

    region: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Bölge adı 100 karakterden uzun olamaz'
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
    createCitySchema,
    updateCitySchema
}; 