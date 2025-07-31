const City = require('../../models/City');
const Country = require('../../models/Country');

const seedCities = async () => {
    try {
        console.log('Cities seed işlemi başlatılıyor...');

        // Mevcut city'leri temizle
        await City.deleteMany({});
        console.log('Mevcut cities temizlendi');

        // Country'leri al
        const countries = await Country.find({});
        const countryMap = {};
        countries.forEach(country => {
            countryMap[country.isoAlpha2] = country._id;
        });

        // Varsayılan city'leri oluştur
        const defaultCities = [
            {
                countryId: countryMap['TR'],
                name: 'Istanbul',
                isCapital: false,
                region: 'Marmara',
                latitude: 41.0082,
                longitude: 28.9784,
                status: 'active'
            },
            {
                countryId: countryMap['TR'],
                name: 'Ankara',
                isCapital: true,
                region: 'İç Anadolu',
                latitude: 39.9334,
                longitude: 32.8597,
                status: 'active'
            },
            {
                countryId: countryMap['TR'],
                name: 'Izmir',
                isCapital: false,
                region: 'Ege',
                latitude: 38.4192,
                longitude: 27.1287,
                status: 'active'
            },
            {
                countryId: countryMap['DE'],
                name: 'Berlin',
                isCapital: true,
                region: 'Berlin',
                latitude: 52.5200,
                longitude: 13.4050,
                status: 'active'
            },
            {
                countryId: countryMap['DE'],
                name: 'Munich',
                isCapital: false,
                region: 'Bavaria',
                latitude: 48.1351,
                longitude: 11.5820,
                status: 'active'
            },
            {
                countryId: countryMap['US'],
                name: 'Washington, D.C.',
                isCapital: true,
                region: 'District of Columbia',
                latitude: 38.9072,
                longitude: -77.0369,
                status: 'active'
            },
            {
                countryId: countryMap['US'],
                name: 'New York',
                isCapital: false,
                region: 'New York',
                latitude: 40.7128,
                longitude: -74.0060,
                status: 'active'
            },
            {
                countryId: countryMap['JP'],
                name: 'Tokyo',
                isCapital: true,
                region: 'Kanto',
                latitude: 35.6762,
                longitude: 139.6503,
                status: 'active'
            },
            {
                countryId: countryMap['JP'],
                name: 'Osaka',
                isCapital: false,
                region: 'Kansai',
                latitude: 34.6937,
                longitude: 135.5023,
                status: 'active'
            },
            {
                countryId: countryMap['GB'],
                name: 'London',
                isCapital: true,
                region: 'England',
                latitude: 51.5074,
                longitude: -0.1278,
                status: 'active'
            },
            {
                countryId: countryMap['GB'],
                name: 'Manchester',
                isCapital: false,
                region: 'England',
                latitude: 53.4808,
                longitude: -2.2426,
                status: 'active'
            }
        ];

        // City'leri oluştur
        const createdCities = await City.insertMany(defaultCities);
        console.log(`Cities başarıyla oluşturuldu! (${createdCities.length})`, createdCities.map(c => c.name));
        console.log(`----------------------------------------------------------------`);
        
        return createdCities;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedCities; 