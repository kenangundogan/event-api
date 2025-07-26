const mongoose = require('mongoose');
const Permission = require('../../models/Permission');
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

const seedPermissions = async () => {
  try {
    await connectDB();
    
    // Mevcut izinleri temizle
    await Permission.deleteMany({});
    console.log('Mevcut izinler temizlendi');
    
    // Varsayılan izinleri oluştur
    const permissions = [
      // User permissions
      {
        name: 'user_read',
        displayName: 'Kullanıcı Okuma',
        description: 'Kullanıcı bilgilerini görüntüleme izni',
        category: 'user',
        resource: 'user',
        action: 'read',
        isSystem: true,
        priority: 10
      },
      {
        name: 'user_create',
        displayName: 'Kullanıcı Oluşturma',
        description: 'Yeni kullanıcı oluşturma izni',
        category: 'user',
        resource: 'user',
        action: 'create',
        isSystem: true,
        priority: 20
      },
      {
        name: 'user_update',
        displayName: 'Kullanıcı Güncelleme',
        description: 'Kullanıcı bilgilerini güncelleme izni',
        category: 'user',
        resource: 'user',
        action: 'update',
        isSystem: true,
        priority: 30
      },
      {
        name: 'user_delete',
        displayName: 'Kullanıcı Silme',
        description: 'Kullanıcı silme izni',
        category: 'user',
        resource: 'user',
        action: 'delete',
        isSystem: true,
        priority: 40
      },
      {
        name: 'user_list',
        displayName: 'Kullanıcı Listeleme',
        description: 'Kullanıcı listesini görüntüleme izni',
        category: 'user',
        resource: 'user',
        action: 'list',
        isSystem: true,
        priority: 50
      },
      
      // Event permissions
      {
        name: 'event_read',
        displayName: 'Etkinlik Okuma',
        description: 'Etkinlik bilgilerini görüntüleme izni',
        category: 'event',
        resource: 'event',
        action: 'read',
        isSystem: true,
        priority: 10
      },
      {
        name: 'event_create',
        displayName: 'Etkinlik Oluşturma',
        description: 'Yeni etkinlik oluşturma izni',
        category: 'event',
        resource: 'event',
        action: 'create',
        isSystem: true,
        priority: 20
      },
      {
        name: 'event_update',
        displayName: 'Etkinlik Güncelleme',
        description: 'Etkinlik bilgilerini güncelleme izni',
        category: 'event',
        resource: 'event',
        action: 'update',
        isSystem: true,
        priority: 30
      },
      {
        name: 'event_delete',
        displayName: 'Etkinlik Silme',
        description: 'Etkinlik silme izni',
        category: 'event',
        resource: 'event',
        action: 'delete',
        isSystem: true,
        priority: 40
      },
      {
        name: 'event_list',
        displayName: 'Etkinlik Listeleme',
        description: 'Etkinlik listesini görüntüleme izni',
        category: 'event',
        resource: 'event',
        action: 'list',
        isSystem: true,
        priority: 50
      },
      
      // Category permissions
      {
        name: 'category_read',
        displayName: 'Kategori Okuma',
        description: 'Kategori bilgilerini görüntüleme izni',
        category: 'category',
        resource: 'category',
        action: 'read',
        isSystem: true,
        priority: 10
      },
      {
        name: 'category_create',
        displayName: 'Kategori Oluşturma',
        description: 'Yeni kategori oluşturma izni',
        category: 'category',
        resource: 'category',
        action: 'create',
        isSystem: true,
        priority: 20
      },
      {
        name: 'category_update',
        displayName: 'Kategori Güncelleme',
        description: 'Kategori bilgilerini güncelleme izni',
        category: 'category',
        resource: 'category',
        action: 'update',
        isSystem: true,
        priority: 30
      },
      {
        name: 'category_delete',
        displayName: 'Kategori Silme',
        description: 'Kategori silme izni',
        category: 'category',
        resource: 'category',
        action: 'delete',
        isSystem: true,
        priority: 40
      },
      {
        name: 'category_list',
        displayName: 'Kategori Listeleme',
        description: 'Kategori listesini görüntüleme izni',
        category: 'category',
        resource: 'category',
        action: 'list',
        isSystem: true,
        priority: 50
      },
      
      // System permissions
      {
        name: 'system_admin',
        displayName: 'Sistem Yöneticisi',
        description: 'Tam sistem yönetici izni',
        category: 'system',
        resource: 'system',
        action: 'admin',
        isSystem: true,
        priority: 100
      },
      {
        name: 'system_settings',
        displayName: 'Sistem Ayarları',
        description: 'Sistem ayarlarını değiştirme izni',
        category: 'system',
        resource: 'system',
        action: 'settings',
        isSystem: true,
        priority: 90
      },
      {
        name: 'system_logs',
        displayName: 'Sistem Logları',
        description: 'Sistem loglarını görüntüleme izni',
        category: 'system',
        resource: 'system',
        action: 'logs',
        isSystem: true,
        priority: 80
      }
    ];
    
    const createdPermissions = await Permission.insertMany(permissions);
    console.log(`${createdPermissions.length} izin başarıyla oluşturuldu`);
    
    // İzinleri kategorilere göre listele
    const categories = ['user', 'event', 'category', 'system'];
    for (const category of categories) {
      const categoryPermissions = await Permission.find({ category, isActive: true });
      console.log(`\n${category.toUpperCase()} kategorisi (${categoryPermissions.length} izin):`);
      categoryPermissions.forEach(p => {
        console.log(`  - ${p.displayName} (${p.fullName})`);
      });
    }
    
    console.log('\n✅ İzinler başarıyla oluşturuldu!');
  } catch (error) {
    console.error('❌ Hata:', error.message);
    throw error;
  }
};

module.exports = seedPermissions; 