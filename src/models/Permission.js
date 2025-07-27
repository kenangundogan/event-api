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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index'ler
permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ isActive: 1 });

// Virtual field for permission name (using fullName format)
permissionSchema.virtual('name').get(function () {
    return `${this.resource}:${this.action}`;
});

// Static method - kaynağa göre izinleri getir
permissionSchema.statics.getByResource = function (resource) {
    return this.find({ resource, isActive: true }).sort({ priority: -1, resource: 1, action: 1 });
};

// Static method - aktif izinleri getir
permissionSchema.statics.getActive = function () {
    return this.find({ isActive: true }).sort({ resource: 1, priority: -1, action: 1 });
};

// Instance method - izin kontrolü
permissionSchema.methods.matches = function (resource, action) {
    return this.resource === resource && this.action === action;
};

module.exports = mongoose.model('Permission', permissionSchema); 