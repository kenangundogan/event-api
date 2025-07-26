const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Ad alanı zorunludur'],
        trim: true,
        maxlength: [50, 'Ad 50 karakterden uzun olamaz']
    },
    lastName: {
        type: String,
        required: [true, 'Soyad alanı zorunludur'],
        trim: true,
        maxlength: [50, 'Soyad 50 karakterden uzun olamaz']
    },
    email: {
        type: String,
        required: [true, 'Email alanı zorunludur'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Şifre alanı zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
        select: false // Şifreyi varsayılan olarak sorgularda getirme
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz']
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Rol zorunludur']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    profileImage: {
        type: String
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        },
        language: {
            type: String,
            enum: ['tr', 'en'],
            default: 'tr'
        }
    }
}, {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Index'ler
userSchema.index({ createdAt: -1 });

// Password hash middleware
userSchema.pre('save', async function (next) {
    // Sadece şifre değiştiğinde hash'le
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// User'ı JSON'a çevirirken hassas bilgileri çıkar
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// User'ı response için hazırla (şifre hariç)
userSchema.methods.toResponse = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Instance method - son giriş zamanını güncelle
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Static method - email ile kullanıcı bul
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Static method - aktif kullanıcıları getir
userSchema.statics.findActive = function () {
    return this.find({ isActive: true });
};

// Instance method - kullanıcının izin kontrolü
userSchema.methods.hasPermission = async function (permission) {
    await this.populate('role');
    return this.role && this.role.hasPermission(permission);
};

// Instance method - birden fazla izin kontrolü
userSchema.methods.hasAnyPermission = async function (permissions) {
    await this.populate('role');
    return this.role && this.role.hasAnyPermission(permissions);
};

// Instance method - tüm izinleri kontrol et
userSchema.methods.hasAllPermissions = async function (permissions) {
    await this.populate('role');
    return this.role && this.role.hasAllPermissions(permissions);
};

// Instance method - kullanıcının rol adını getir
userSchema.methods.getRoleName = async function () {
    await this.populate('role');
    return this.role ? this.role.name : null;
};

// Instance method - kullanıcının rol görünen adını getir
userSchema.methods.getRoleDisplayName = async function () {
    await this.populate('role');
    return this.role ? this.role.displayName : null;
};

module.exports = mongoose.model('User', userSchema); 