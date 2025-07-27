const Role = require('../../models/Role');
const User = require('../../models/User');
const Permission = require('../../models/Permission');

const seedRoles = async () => {
    try {
        console.log('Roller oluşturuluyor...');

        // Mevcut rolleri temizle
        await Role.deleteMany({});
        console.log('Mevcut roller temizlendi');

        // Önce izinleri al
        const permissions = await Permission.find({ isActive: true });
        const permissionMap = {};
        permissions.forEach(p => {
            permissionMap[p.name] = p._id;
        });

        // Varsayılan rolleri oluştur
        const roles = [
            {
                name: 'user',
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
        console.log(`Roller başarıyla oluşturuldu! (${createdRoles.length})`, createdRoles.map(r => r.name));
        console.log(`----------------------------------------------------------------`);
    } catch (error) {
        console.error('Seed hatası:', error);
        throw error;
    }
};

module.exports = seedRoles; 