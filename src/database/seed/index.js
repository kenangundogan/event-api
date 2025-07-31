const connectDB = require('../../config/database');
const seedGenders = require('./gender');
const seedPermissions = require('./permission');
const seedRoles = require('./role');
const seedUsers = require('./user');

const runAllSeeds = async () => {
    try {
        console.log('Seed işlemi başlatılıyor...');

        await connectDB();

        await seedGenders();

        await seedPermissions();

        await seedRoles();

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