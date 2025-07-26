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
    displayName: {
        type: String,
        required: [true, 'Görünen ad zorunludur'],
        trim: true,
        maxlength: [100, 'Görünen ad 100 karakterden uzun olamaz']
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index'ler
// Index'ler (unique: true zaten index oluşturduğu için name index'ini kaldırdık)
roleSchema.index({ isActive: 1 });
roleSchema.index({ priority: -1 });

// Virtual field for permission count
roleSchema.virtual('permissionCount').get(function () {
    return this.permissions ? this.permissions.length : 0;
});

// Static method - varsayılan rolü getir
roleSchema.statics.getDefaultRole = function () {
    return this.findOne({ isDefault: true, isActive: true });
};

// Static method - aktif rolleri getir
roleSchema.statics.getActiveRoles = function () {
    return this.find({ isActive: true }).sort({ priority: -1 });
};

// Instance method - izin kontrolü
roleSchema.methods.hasPermission = async function (permissionName) {
    await this.populate('permissions');
    if (!this.permissions) return false;

    // String permission kontrolü (geriye uyumluluk için)
    if (typeof permissionName === 'string') {
        return this.permissions.some(p => p.fullName === permissionName);
    }

    // ObjectId permission kontrolü
    return this.permissions.some(p => p._id.toString() === permissionName.toString());
};

// Instance method - birden fazla izin kontrolü
roleSchema.methods.hasAnyPermission = async function (permissionNames) {
    await this.populate('permissions');
    if (!this.permissions) return false;

    return permissionNames.some(permissionName => {
        if (typeof permissionName === 'string') {
            return this.permissions.some(p => p.fullName === permissionName);
        }
        return this.permissions.some(p => p._id.toString() === permissionName.toString());
    });
};

// Instance method - tüm izinleri kontrol et
roleSchema.methods.hasAllPermissions = async function (permissionNames) {
    await this.populate('permissions');
    if (!this.permissions) return false;

    return permissionNames.every(permissionName => {
        if (typeof permissionName === 'string') {
            return this.permissions.some(p => p.fullName === permissionName);
        }
        return this.permissions.some(p => p._id.toString() === permissionName.toString());
    });
};

// Instance method - izinleri getir
roleSchema.methods.getPermissions = async function () {
    await this.populate('permissions');
    return this.permissions || [];
};

// Instance method - kategoriye göre izinleri getir
roleSchema.methods.getPermissionsByCategory = async function (category) {
    await this.populate('permissions');
    if (!this.permissions) return [];
    return this.permissions.filter(p => p.category === category);
};

module.exports = mongoose.model('Role', roleSchema); 