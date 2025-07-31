const mongoose = require('mongoose');

const continentSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Kıta kodu zorunludur'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [2, 'Kıta kodu en az 2 karakter olmalıdır'],
        maxlength: [3, 'Kıta kodu 3 karakterden uzun olamaz']
    },
    
    name: {
        type: String,
        required: [true, 'Kıta adı zorunludur'],
        unique: true,
        trim: true,
        minlength: [2, 'Kıta adı en az 2 karakter olmalıdır'],
        maxlength: [100, 'Kıta adı 100 karakterden uzun olamaz']
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

continentSchema.index({ status: 1 });

module.exports = mongoose.model('Continent', continentSchema); 