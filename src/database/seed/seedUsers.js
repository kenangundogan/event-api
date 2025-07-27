const User = require('../../models/User');
const Role = require('../../models/Role');

const seedUsers = async () => {
    try {
        console.log('Kullanıcılar oluşturuluyor...');

        // Mevcut kullanıcıları temizle
        await User.deleteMany({});
        console.log('Mevcut kullanıcılar temizlendi');

        // Rolleri al
        const roles = await Role.find({});

        if (!roles) {
            throw new Error('Gerekli roller bulunamadı! Önce rolleri oluşturun.');
        }

        // Varsayılan kullanıcıları oluştur
        const users = [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'AdminPass123',
                role: roles.find(r => r.name === 'admin')._id,
                isActive: true,
                isEmailVerified: true,
                preferences: {
                    notifications: {
                        email: true,
                        push: true,
                        sms: false
                    },
                    language: 'tr'
                }
            },
            {
                firstName: 'Moderator',
                lastName: 'User',
                email: 'moderator@example.com',
                password: 'ModeratorPass123',
                role: roles.find(r => r.name === 'moderator')._id,
                isActive: true,
                isEmailVerified: true,
                preferences: {
                    notifications: {
                        email: true,
                        push: true,
                        sms: false
                    },
                    language: 'tr'
                }
            },
            {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'TestPass123',
                role: roles.find(r => r.name === 'user')._id,
                isActive: true,
                isEmailVerified: true,
                preferences: {
                    notifications: {
                        email: true,
                        push: false,
                        sms: false
                    },
                    language: 'tr'
                }
            }
        ];

        // Her kullanıcıyı ayrı ayrı oluştur (middleware çalışması için)
        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        
        console.log(`Kullanıcılar başarıyla oluşturuldu! (${createdUsers.length})`);
        createdUsers.forEach(user => {
            const role = roles.find(r => r._id.toString() === user.role.toString());
            console.log(` - ${user.email} (${role ? role.name : 'role yok'})`);
        });
        console.log(`----------------------------------------------------------------`);
        return createdUsers;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedUsers; 