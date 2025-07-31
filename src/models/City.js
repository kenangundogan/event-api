const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'Ülke zorunludur']
    },
    
    name: {
        type: String,
        required: [true, 'Şehir adı zorunludur'],
        trim: true,
        minlength: [2, 'Şehir adı en az 2 karakter olmalıdır'],
        maxlength: [100, 'Şehir adı 100 karakterden uzun olamaz']
    },
    
    isCapital: {
        type: Boolean,
        default: false
    },
    
    region: {
        type: String,
        trim: true,
        maxlength: [100, 'Bölge adı 100 karakterden uzun olamaz']
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

citySchema.index({ countryId: 1, name: 1 }, { unique: true });
citySchema.index({ status: 1 });
citySchema.index({ isCapital: 1 });

module.exports = mongoose.model('City', citySchema); 