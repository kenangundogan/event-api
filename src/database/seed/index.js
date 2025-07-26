const mongoose = require('mongoose');
const seedPermissions = require('./seedPermissions');
const seedRoles = require('./seedRoles');
const seedUsers = require('./seedUsers');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_api';
        await mongoose.connect(mongoURI);
        console.log('MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error.message);
        process.exit(1);
    }
};

const runAllSeeds = async () => {
    try {
        console.log('🌱 Seed işlemi başlatılıyor...\n');

        // 1. İzinleri oluştur
        await seedPermissions();

        // 2. Rolleri oluştur
        await seedRoles();

        // 3. Kullanıcıları oluştur
        await seedUsers();
        console.log('✅ Kullanıcılar başarıyla oluşturuldu\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed hatası:', error.message);
        process.exit(1);
    }
};

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
    runAllSeeds();
}

module.exports = {
    runAllSeeds,
    connectDB
}; 