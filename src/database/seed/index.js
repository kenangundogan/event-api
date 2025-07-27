const connectDB = require('../../config/database');
const seedPermissions = require('./seedPermissions');
const seedRoles = require('./seedRoles');
const seedUsers = require('./seedUsers');

const runAllSeeds = async () => {
    try {
        console.log('Seed işlemi başlatılıyor...\n');

        // Veritabanı bağlantısını kur
        await connectDB();

        // 1. İzinleri oluştur
        await seedPermissions();

        // 2. Rolleri oluştur
        await seedRoles();

        // 3. Kullanıcıları oluştur
        await seedUsers();

        console.log('Tüm seed işlemleri başarıyla tamamlandı!');
        process.exit(0);
    } catch (error) {
        console.error('Seed hatası:', error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    runAllSeeds();
}

module.exports = {
    runAllSeeds,
    connectDB
}; 