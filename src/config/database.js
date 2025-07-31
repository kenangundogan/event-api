const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        const conn = await mongoose.connect(mongoURI, {});
        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
        console.log(`--------------------------------`);
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB; 