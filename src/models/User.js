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
    timestamps: true
});

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


module.exports = mongoose.model('User', userSchema); 