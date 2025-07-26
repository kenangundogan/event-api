const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // MongoDB URI'yi environment'dan al veya default kullan
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_api';

        const conn = await mongoose.connect(mongoURI, {});

        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error.message);
        console.log('MongoDB\'nin çalıştığından emin olun: mongod');
        // Production'da process.exit(1) kullan, development'ta devam et
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB; 