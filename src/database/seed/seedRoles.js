const mongoose = require('mongoose');
const Role = require('../../models/Role');
const User = require('../../models/User');
const Permission = require('../../models/Permission');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_api');
        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error.message);
        process.exit(1);
    }
};

const seedRoles = async () => {
    try {
        await connectDB();

        // Mevcut rolleri temizle
        await Role.deleteMany({});

        // Önce izinleri al
        const permissions = await Permission.find({ isActive: true });
        const permissionMap = {};
        permissions.forEach(p => {
            permissionMap[p.fullName] = p._id;
        });

        // Varsayılan rolleri oluştur
        const roles = [
            {
                name: 'user',
                displayName: 'Kullanıcı',
                description: 'Standart kullanıcı rolü',
                permissions: [
                    permissionMap['user:read'],
                    permissionMap['event:read'],
                    permissionMap['event:list'],
                    permissionMap['category:read'],
                    permissionMap['category:list']
                ].filter(Boolean), // undefined değerleri filtrele
                isActive: true,
                isDefault: true,
                priority: 0
            },
            {
                name: 'moderator',
                displayName: 'Moderatör',
                description: 'Moderatör rolü - sınırlı yönetici yetkileri',
                permissions: [
                    permissionMap['user:read'],
                    permissionMap['user:list'],
                    permissionMap['user:update'],
                    permissionMap['event:read'],
                    permissionMap['event:create'],
                    permissionMap['event:update'],
                    permissionMap['event:list'],
                    permissionMap['category:read'],
                    permissionMap['category:create'],
                    permissionMap['category:update'],
                    permissionMap['category:list']
                ].filter(Boolean),
                isActive: true,
                isDefault: false,
                priority: 50
            },
            {
                name: 'admin',
                displayName: 'Yönetici',
                description: 'Tam yönetici rolü - tüm yetkilere sahip',
                permissions: [
                    permissionMap['user:read'],
                    permissionMap['user:create'],
                    permissionMap['user:update'],
                    permissionMap['user:delete'],
                    permissionMap['user:list'],
                    permissionMap['event:read'],
                    permissionMap['event:create'],
                    permissionMap['event:update'],
                    permissionMap['event:delete'],
                    permissionMap['event:list'],
                    permissionMap['category:read'],
                    permissionMap['category:create'],
                    permissionMap['category:update'],
                    permissionMap['category:delete'],
                    permissionMap['category:list'],
                    permissionMap['system:admin'],
                    permissionMap['system:settings'],
                    permissionMap['system:logs']
                ].filter(Boolean),
                isActive: true,
                isDefault: false,
                priority: 100
            }
        ];

        // Rolleri kaydet
        const createdRoles = await Role.insertMany(roles);
        console.log('Roller başarıyla oluşturuldu:', createdRoles.map(r => r.name));

        // Mevcut kullanıcıların rollerini güncelle
        const defaultRole = await Role.findOne({ name: 'user' });
        const adminRole = await Role.findOne({ name: 'admin' });

        if (defaultRole) {
            // Tüm kullanıcıları varsayılan role ata
            await User.updateMany(
                { role: { $exists: false } },
                { role: defaultRole._id }
            );
            console.log('Mevcut kullanıcılar varsayılan role atandı');
        }

        // Admin kullanıcılarını admin role ata
        if (adminRole) {
            await User.updateMany(
                { email: { $in: ['admin@example.com'] } },
                { role: adminRole._id }
            );
            console.log('Admin kullanıcıları admin role atandı');
        }

        console.log('Seed işlemi tamamlandı!');
    } catch (error) {
        console.error('Seed hatası:', error);
        throw error;
    }
};

// Artık ayrı çalıştırılmayacak, sadece export

module.exports = seedRoles; 