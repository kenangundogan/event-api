const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İzin adı zorunludur'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [100, 'İzin adı 100 karakterden uzun olamaz']
    },
    displayName: {
        type: String,
        required: [true, 'Görünen ad zorunludur'],
        trim: true,
        maxlength: [200, 'Görünen ad 200 karakterden uzun olamaz']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
    },
    category: {
        type: String,
        required: [true, 'Kategori zorunludur'],
        enum: ['user', 'event', 'category', 'system', 'other'],
        default: 'other'
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
    isSystem: {
        type: Boolean,
        default: false
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

// Index'ler (unique: true zaten index oluşturduğu için name index'ini kaldırdık)
permissionSchema.index({ category: 1, resource: 1, action: 1 });
permissionSchema.index({ isActive: 1 });

// Virtual field for full permission name
permissionSchema.virtual('fullName').get(function () {
    return `${this.resource}:${this.action}`;
});

// Virtual field for category display
permissionSchema.virtual('categoryDisplay').get(function () {
    const categories = {
        user: 'Kullanıcı Yönetimi',
        event: 'Etkinlik Yönetimi',
        category: 'Kategori Yönetimi',
        system: 'Sistem Yönetimi',
        other: 'Diğer'
    };
    return categories[this.category] || this.category;
});

// Static method - kategoriye göre izinleri getir
permissionSchema.statics.getByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ priority: -1, name: 1 });
};

// Static method - aktif izinleri getir
permissionSchema.statics.getActive = function () {
    return this.find({ isActive: true }).sort({ category: 1, priority: -1, name: 1 });
};

// Static method - sistem izinlerini getir
permissionSchema.statics.getSystemPermissions = function () {
    return this.find({ isSystem: true, isActive: true });
};

// Instance method - izin kontrolü
permissionSchema.methods.matches = function (resource, action) {
    return this.resource === resource && this.action === action;
};

module.exports = mongoose.model('Permission', permissionSchema); 