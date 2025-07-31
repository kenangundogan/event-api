const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Rol adı zorunludur'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, 'Rol adı 50 karakterden uzun olamaz']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

roleSchema.index({ isActive: 1 });
roleSchema.index({ priority: -1 });

roleSchema.statics.getDefaultRole = function () {
    return this.findOne({ isDefault: true, isActive: true });
};

module.exports = mongoose.model('Role', roleSchema); 