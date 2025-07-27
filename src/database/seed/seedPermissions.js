const Permission = require('../../models/Permission');

const seedPermissions = async () => {
    try {
        console.log('İzinler oluşturuluyor...');

        // Mevcut izinleri temizle
        await Permission.deleteMany({});
        console.log('Mevcut izinler temizlendi');

        // Varsayılan izinleri oluştur
        const permissions = [
            // User permissions
            {
                description: 'Kullanıcı bilgilerini görüntüleme izni',
                resource: 'user',
                action: 'read',
                priority: 10
            },
            {
                description: 'Yeni kullanıcı oluşturma izni',
                resource: 'user',
                action: 'create',
                priority: 20
            },
            {
                description: 'Kullanıcı bilgilerini güncelleme izni',
                resource: 'user',
                action: 'update',
                priority: 30
            },
            {
                description: 'Kullanıcı silme izni',
                resource: 'user',
                action: 'delete',
                priority: 40
            },
            {
                description: 'Kullanıcı listesini görüntüleme izni',
                resource: 'user',
                action: 'list',
                priority: 50
            },

            // Event permissions
            {
                description: 'Etkinlik bilgilerini görüntüleme izni',
                resource: 'event',
                action: 'read',
                priority: 10
            },
            {
                description: 'Yeni etkinlik oluşturma izni',
                resource: 'event',
                action: 'create',
                priority: 20
            },
            {
                description: 'Etkinlik bilgilerini güncelleme izni',
                resource: 'event',
                action: 'update',
                priority: 30
            },
            {
                description: 'Etkinlik silme izni',
                resource: 'event',
                action: 'delete',
                priority: 40
            },
            {
                description: 'Etkinlik listesini görüntüleme izni',
                resource: 'event',
                action: 'list',
                priority: 50
            },

            // Category permissions
            {
                description: 'Kategori bilgilerini görüntüleme izni',
                resource: 'category',
                action: 'read',
                priority: 10
            },
            {
                description: 'Yeni kategori oluşturma izni',
                resource: 'category',
                action: 'create',
                priority: 20
            },
            {
                description: 'Kategori bilgilerini güncelleme izni',
                resource: 'category',
                action: 'update',
                priority: 30
            },
            {
                description: 'Kategori silme izni',
                resource: 'category',
                action: 'delete',
                priority: 40
            },
            {
                description: 'Kategori listesini görüntüleme izni',
                resource: 'category',
                action: 'list',
                priority: 50
            },

            // System permissions
            {
                description: 'Tam sistem yönetici izni',
                resource: 'system',
                action: 'admin',
                priority: 100
            },
            {
                description: 'Sistem ayarlarını değiştirme izni',
                resource: 'system',
                action: 'settings',
                priority: 90
            },
            {
                description: 'Sistem loglarını görüntüleme izni',
                resource: 'system',
                action: 'logs',
                priority: 80
            }
        ];

        const createdPermissions = await Permission.insertMany(permissions);
        console.log(`İzinler başarıyla oluşturuldu! (${createdPermissions.length})`, createdPermissions.map(p => p.resource + ':' + p.action));
        console.log(`----------------------------------------------------------------`);
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

module.exports = seedPermissions; 