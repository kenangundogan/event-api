const mongoose = require('mongoose');

const genderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Cinsiyet adı zorunludur'],
        unique: true,
        trim: true,
        minlength: [2, 'Cinsiyet adı en az 2 karakter olmalıdır'],
        maxlength: [30, 'Cinsiyet adı 30 karakterden uzun olamaz']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Açıklama 200 karakterden uzun olamaz']
    },

    isActive: {
        type: Boolean,
        default: true
    },

    priority: {
        type: Number,
        default: 0,
        min: [0, 'Öncelik 0\'dan küçük olamaz']
    }
}, {
    timestamps: true
});

genderSchema.index({ isActive: 1 });
genderSchema.index({ priority: -1 });

module.exports = mongoose.model('Gender', genderSchema); 