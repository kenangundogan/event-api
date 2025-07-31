const Gender = require('../../models/Gender');

const seedGenders = async () => {
    try {
        console.log('Genders seed işlemi başlatılıyor...');

        // Mevcut gender'ları temizle
        await Gender.deleteMany({});
        console.log('Mevcut genders temizlendi');

        // Varsayılan gender'ları oluştur
        const defaultGenders = [
            {
                name: 'Erkek',
                description: 'Erkek cinsiyeti',
                priority: 1,
                isActive: true
            },
            {
                name: 'Kadın',
                description: 'Kadın cinsiyeti',
                priority: 2,
                isActive: true
            },
            {
                name: 'Diğer',
                description: 'Diğer cinsiyet seçenekleri',
                priority: 3,
                isActive: true
            },
            {
                name: 'Belirtmek İstemiyorum',
                description: 'Cinsiyet bilgisi paylaşmak istemeyenler',
                priority: 4,
                isActive: true
            }
        ];

        // Gender'ları oluştur
        const createdGenders = await Gender.insertMany(defaultGenders);
        console.log(`Genders başarıyla oluşturuldu! (${createdGenders.length})`, createdGenders.map(g => g.name));
        console.log(`----------------------------------------------------------------`);
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedGenders; 