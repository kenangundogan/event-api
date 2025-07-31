const Continent = require('../../models/Continent');

const seedContinents = async () => {
    try {
        console.log('Continents seed işlemi başlatılıyor...');

        // Mevcut continent'ları temizle
        await Continent.deleteMany({});
        console.log('Mevcut continents temizlendi');

        // Varsayılan continent'ları oluştur
        const defaultContinents = [
            {
                code: 'AF',
                name: 'Africa',
                nativeName: 'Afrika',
                locale: 'tr-TR',
                latitude: 8.7832,
                longitude: 34.5085,
                status: 'active'
            },
            {
                code: 'AS',
                name: 'Asia',
                nativeName: 'Asya',
                locale: 'tr-TR',
                latitude: 34.0479,
                longitude: 100.6197,
                status: 'active'
            },
            {
                code: 'EU',
                name: 'Europe',
                nativeName: 'Avrupa',
                locale: 'tr-TR',
                latitude: 54.5260,
                longitude: 15.2551,
                status: 'active'
            },
            {
                code: 'NA',
                name: 'North America',
                nativeName: 'Kuzey Amerika',
                locale: 'tr-TR',
                latitude: 45.0,
                longitude: -100.0,
                status: 'active'
            },
            {
                code: 'SA',
                name: 'South America',
                nativeName: 'Güney Amerika',
                locale: 'tr-TR',
                latitude: -8.7832,
                longitude: -55.4915,
                status: 'active'
            },
            {
                code: 'OC',
                name: 'Oceania',
                nativeName: 'Okyanusya',
                locale: 'tr-TR',
                latitude: -25.2744,
                longitude: 133.7751,
                status: 'active'
            },
            {
                code: 'AN',
                name: 'Antarctica',
                nativeName: 'Antarktika',
                locale: 'tr-TR',
                latitude: -82.8628,
                longitude: 135.0,
                status: 'active'
            }
        ];

        // Continent'ları oluştur
        const createdContinents = await Continent.insertMany(defaultContinents);
        console.log(`Continents başarıyla oluşturuldu! (${createdContinents.length})`, createdContinents.map(c => c.name));
        console.log(`----------------------------------------------------------------`);
        
        return createdContinents;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedContinents; 