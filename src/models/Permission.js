const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
    },
    resource: {
        type: String,
        required: [true, 'Kaynak zorunludur'],
        trim: true,
        lowercase: true
    },
    action: {
        type: String,
        required: [true, 'Eylem zorunludur'],
        enum: ['read', 'create', 'update', 'delete', 'list', 'approve', 'reject', 'admin', 'settings', 'logs'],
        default: 'read'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Permission', permissionSchema); 