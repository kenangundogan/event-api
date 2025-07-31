const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    continentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Continent',
        required: [true, 'Kıta zorunludur']
    },
    
    name: {
        type: String,
        required: [true, 'Ülke adı zorunludur'],
        unique: true,
        trim: true,
        minlength: [2, 'Ülke adı en az 2 karakter olmalıdır'],
        maxlength: [100, 'Ülke adı 100 karakterden uzun olamaz']
    },
    
    nativeName: {
        type: String,
        trim: true,
        maxlength: [100, 'Yerel ad 100 karakterden uzun olamaz']
    },
    
    locale: {
        type: String,
        trim: true,
        maxlength: [10, 'Dil kodu 10 karakterden uzun olamaz']
    },
    
    isoAlpha2: {
        type: String,
        required: [true, 'ISO Alpha-2 kodu zorunludur'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [2, 'ISO Alpha-2 kodu 2 karakter olmalıdır'],
        maxlength: [2, 'ISO Alpha-2 kodu 2 karakter olmalıdır']
    },
    
    isoAlpha3: {
        type: String,
        required: [true, 'ISO Alpha-3 kodu zorunludur'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [3, 'ISO Alpha-3 kodu 3 karakter olmalıdır'],
        maxlength: [3, 'ISO Alpha-3 kodu 3 karakter olmalıdır']
    },
    
    isoNumeric: {
        type: String,
        required: [true, 'ISO sayısal kod zorunludur'],
        unique: true,
        trim: true,
        minlength: [1, 'ISO sayısal kod en az 1 karakter olmalıdır'],
        maxlength: [3, 'ISO sayısal kod 3 karakterden uzun olamaz']
    },
    
    phoneCode: {
        type: String,
        trim: true,
        maxlength: [5, 'Telefon kodu 5 karakterden uzun olamaz']
    },
    
    currencyCode: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: [3, 'Para birimi kodu 3 karakterden uzun olamaz']
    },
    
    currencyName: {
        type: String,
        trim: true,
        maxlength: [50, 'Para birimi adı 50 karakterden uzun olamaz']
    },
    
    latitude: {
        type: Number,
        min: [-90, 'Enlem -90 ile 90 arasında olmalıdır'],
        max: [90, 'Enlem -90 ile 90 arasında olmalıdır']
    },
    
    longitude: {
        type: Number,
        min: [-180, 'Boylam -180 ile 180 arasında olmalıdır'],
        max: [180, 'Boylam -180 ile 180 arasında olmalıdır']
    },
    
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived', 'deleted'],
        default: 'active'
    }
}, {
    timestamps: true
});

countrySchema.index({ status: 1 });
countrySchema.index({ continentId: 1 });

module.exports = mongoose.model('Country', countrySchema); 