const Joi = require('joi');

// Create validation schema
const createCountrySchema = Joi.object({
    continentId: Joi.string()
        .required()
        .messages({
            'any.required': 'Kıta zorunludur'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Ülke adı en az 2 karakter olmalıdır',
            'string.max': 'Ülke adı 100 karakterden uzun olamaz',
            'any.required': 'Ülke adı zorunludur'
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

    isoAlpha2: Joi.string()
        .length(2)
        .required()
        .messages({
            'string.length': 'ISO Alpha-2 kodu 2 karakter olmalıdır',
            'any.required': 'ISO Alpha-2 kodu zorunludur'
        }),

    isoAlpha3: Joi.string()
        .length(3)
        .required()
        .messages({
            'string.length': 'ISO Alpha-3 kodu 3 karakter olmalıdır',
            'any.required': 'ISO Alpha-3 kodu zorunludur'
        }),

    isoNumeric: Joi.string()
        .min(1)
        .max(3)
        .required()
        .messages({
            'string.min': 'ISO sayısal kod en az 1 karakter olmalıdır',
            'string.max': 'ISO sayısal kod 3 karakterden uzun olamaz',
            'any.required': 'ISO sayısal kod zorunludur'
        }),

    phoneCode: Joi.string()
        .max(5)
        .optional()
        .messages({
            'string.max': 'Telefon kodu 5 karakterden uzun olamaz'
        }),

    currencyCode: Joi.string()
        .max(3)
        .optional()
        .messages({
            'string.max': 'Para birimi kodu 3 karakterden uzun olamaz'
        }),

    currencyName: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'Para birimi adı 50 karakterden uzun olamaz'
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
const updateCountrySchema = Joi.object({
    continentId: Joi.string()
        .optional()
        .messages({
            'any.required': 'Kıta zorunludur'
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Ülke adı en az 2 karakter olmalıdır',
            'string.max': 'Ülke adı 100 karakterden uzun olamaz'
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

    isoAlpha2: Joi.string()
        .length(2)
        .optional()
        .messages({
            'string.length': 'ISO Alpha-2 kodu 2 karakter olmalıdır'
        }),

    isoAlpha3: Joi.string()
        .length(3)
        .optional()
        .messages({
            'string.length': 'ISO Alpha-3 kodu 3 karakter olmalıdır'
        }),

    isoNumeric: Joi.string()
        .min(1)
        .max(3)
        .optional()
        .messages({
            'string.min': 'ISO sayısal kod en az 1 karakter olmalıdır',
            'string.max': 'ISO sayısal kod 3 karakterden uzun olamaz'
        }),

    phoneCode: Joi.string()
        .max(5)
        .optional()
        .messages({
            'string.max': 'Telefon kodu 5 karakterden uzun olamaz'
        }),

    currencyCode: Joi.string()
        .max(3)
        .optional()
        .messages({
            'string.max': 'Para birimi kodu 3 karakterden uzun olamaz'
        }),

    currencyName: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'Para birimi adı 50 karakterden uzun olamaz'
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
    createCountrySchema,
    updateCountrySchema
}; 