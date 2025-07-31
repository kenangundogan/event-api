const Country = require('../../models/Country');
const Continent = require('../../models/Continent');

const seedCountries = async () => {
    try {
        console.log('Countries seed işlemi başlatılıyor...');

        // Mevcut country'leri temizle
        await Country.deleteMany({});
        console.log('Mevcut countries temizlendi');

        // Continent'ları al
        const continents = await Continent.find({});
        const continentMap = {};
        continents.forEach(continent => {
            continentMap[continent.code] = continent._id;
        });

        // Varsayılan country'leri oluştur
        const defaultCountries = [
            {
                continentId: continentMap['EU'],
                name: 'Turkey',
                nativeName: 'Türkiye',
                locale: 'tr-TR',
                isoAlpha2: 'TR',
                isoAlpha3: 'TUR',
                isoNumeric: '792',
                phoneCode: '+90',
                currencyCode: 'TRY',
                currencyName: 'Turkish Lira',
                latitude: 38.9637,
                longitude: 35.2433,
                status: 'active'
            },
            {
                continentId: continentMap['EU'],
                name: 'Germany',
                nativeName: 'Deutschland',
                locale: 'de-DE',
                isoAlpha2: 'DE',
                isoAlpha3: 'DEU',
                isoNumeric: '276',
                phoneCode: '+49',
                currencyCode: 'EUR',
                currencyName: 'Euro',
                latitude: 51.1657,
                longitude: 10.4515,
                status: 'active'
            },
            {
                continentId: continentMap['NA'],
                name: 'United States',
                nativeName: 'United States',
                locale: 'en-US',
                isoAlpha2: 'US',
                isoAlpha3: 'USA',
                isoNumeric: '840',
                phoneCode: '+1',
                currencyCode: 'USD',
                currencyName: 'US Dollar',
                latitude: 37.0902,
                longitude: -95.7129,
                status: 'active'
            },
            {
                continentId: continentMap['AS'],
                name: 'Japan',
                nativeName: '日本',
                locale: 'ja-JP',
                isoAlpha2: 'JP',
                isoAlpha3: 'JPN',
                isoNumeric: '392',
                phoneCode: '+81',
                currencyCode: 'JPY',
                currencyName: 'Japanese Yen',
                latitude: 36.2048,
                longitude: 138.2529,
                status: 'active'
            },
            {
                continentId: continentMap['EU'],
                name: 'United Kingdom',
                nativeName: 'United Kingdom',
                locale: 'en-GB',
                isoAlpha2: 'GB',
                isoAlpha3: 'GBR',
                isoNumeric: '826',
                phoneCode: '+44',
                currencyCode: 'GBP',
                currencyName: 'British Pound',
                latitude: 55.3781,
                longitude: -3.4360,
                status: 'active'
            }
        ];

        // Country'leri oluştur
        const createdCountries = await Country.insertMany(defaultCountries);
        console.log(`Countries başarıyla oluşturuldu! (${createdCountries.length})`, createdCountries.map(c => c.name));
        console.log(`----------------------------------------------------------------`);
        
        return createdCountries;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedCountries; 