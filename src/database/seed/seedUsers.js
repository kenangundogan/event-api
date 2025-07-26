const mongoose = require('mongoose');
const User = require('../../models/User');
const Role = require('../../models/Role');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_api');
        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB bağlantısı hatası:', error.message);
        process.exit(1);
    }
};

const seedUsers = async () => {
    try {
        await connectDB();

        // Rolleri al
        const userRole = await Role.findOne({ name: 'user' });
        const adminRole = await Role.findOne({ name: 'admin' });
        const moderatorRole = await Role.findOne({ name: 'moderator' });

        if (!userRole || !adminRole || !moderatorRole) {
            throw new Error('Gerekli roller bulunamadı! Önce rolleri oluşturun.');
        }

        // Varsayılan kullanıcıları oluştur
        const users = [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'AdminPass123',
                role: adminRole._id,
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
                role: moderatorRole._id,
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
                role: userRole._id,
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

        // Mevcut kullanıcıları kontrol et ve yoksa oluştur
        const createdUsers = [];
        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                createdUsers.push(user);
                console.log(`✅ Kullanıcı oluşturuldu: ${user.email} (${user.role.name || 'role yok'})`);
            } else {
                // Mevcut kullanıcının rolünü güncelle
                existingUser.role = userData.role;
                await existingUser.save();
                console.log(`🔄 Kullanıcı güncellendi: ${existingUser.email} (${existingUser.role.name || 'role yok'})`);
            }
        }

        console.log(`\n📊 Kullanıcı Özeti:`);
        console.log(`   - Admin: admin@example.com (${adminRole.displayName})`);
        console.log(`   - Moderator: moderator@example.com (${moderatorRole.displayName})`);
        console.log(`   - Test User: test@example.com (${userRole.displayName})`);

        return createdUsers;
    } catch (error) {
        console.error('❌ Kullanıcı oluşturma hatası:', error.message);
        throw error;
    }
};

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
    seedUsers()
        .then(() => {
            console.log('✅ Kullanıcı seed işlemi tamamlandı!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Hata:', error.message);
            process.exit(1);
        });
}

module.exports = seedUsers; 