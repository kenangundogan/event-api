# Event API

Professional standartlara uygun Express.js API projesi.

## 🚀 Özellikler

- **Express.js** - Modern web framework
- **MongoDB & Mongoose** - Veritabanı ve ODM
- **JWT Authentication** - Güvenli kimlik doğrulama
- **Role-based Authorization** - Rol tabanlı yetkilendirme
- **Permission-based Authorization** - İzin tabanlı yetkilendirme
- **Input Validation** - Joi ile veri doğrulama
- **Error Handling** - Kapsamlı hata yönetimi
- **Rate Limiting** - API rate limiting
- **Security** - Helmet ile güvenlik
- **Logging** - Morgan ile loglama
- **CORS** - Cross-origin resource sharing
- **Query Builder** - Laravel benzeri profesyonel sorgu oluşturucu

## 📁 Proje Yapısı

```
src/
├── config/
│   └── database.js          # MongoDB bağlantı konfigürasyonu
├── controllers/
│   ├── userController.js    # User işlemleri controller'ı
│   ├── roleController.js    # Role işlemleri controller'ı
│   └── permissionController.js # Permission işlemleri controller'ı
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User modeli
│   ├── Role.js             # Role modeli
│   └── Permission.js       # Permission modeli
├── routes/
│   ├── userRoutes.js       # User route'ları
│   ├── roleRoutes.js       # Role route'ları
│   └── permissionRoutes.js # Permission route'ları
├── validations/
│   ├── userValidation.js   # User validation şemaları
│   ├── roleValidation.js   # Role validation şemaları
│   └── permissionValidation.js # Permission validation şemaları
├── utils/
│   ├── queryBuilder.js     # Profesyonel Query Builder
│   └── secretKey.js        # JWT secret key generator
├── database/
│   └── seed/
│       ├── index.js           # Ana seed dosyası
│       ├── seedPermissions.js # Varsayılan izinleri oluşturma
│       ├── seedRoles.js       # Varsayılan rolleri oluşturma
│       └── seedUsers.js       # Varsayılan kullanıcıları oluşturma
└── index.js                # Ana uygulama dosyası
```

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment variables dosyasını oluşturun:**
   ```bash
   cp env.example .env
   ```

3. **Environment variables'ları düzenleyin:**
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/event_api
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **MongoDB'yi başlatın:**
   ```bash
   # MongoDB'nin yüklü olduğundan emin olun
   mongod
   ```

5. **Varsayılan verileri oluşturun:**
   ```bash
   npm run seed
   ```
   Bu komut:
   - ✅ 18 izin oluşturur
   - ✅ 3 rol oluşturur (user, moderator, admin)
   - ✅ 3 kullanıcı oluşturur (admin, moderator, test)

6. **Uygulamayı başlatın:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Yeni kullanıcı kaydı |
| POST | `/api/users/login` | Kullanıcı girişi |
| GET | `/api/roles/default` | Varsayılan rolü getir |

### Protected Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Kullanıcı profili | ✅ |
| PUT | `/api/users/profile` | Kendi profilini güncelle | ✅ |
| PUT | `/api/users/change-password` | Kendi şifresini değiştir | ✅ |
| PUT | `/api/users/change-password/:id` | Şifre değiştirme (admin) | ✅ |

### Admin Routes

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/users` | Tüm kullanıcıları listele | ✅ | Admin |
| GET | `/api/users/:id` | Tek kullanıcı getir | ✅ | Admin |
| PUT | `/api/users/:id` | Kullanıcı güncelle | ✅ | Admin |
| DELETE | `/api/users/:id` | Kullanıcı sil | ✅ | Admin |

### Role Management Routes

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/roles` | Tüm rolleri listele | ✅ | Admin |
| GET | `/api/roles/:id` | Tek rol getir | ✅ | Admin |
| POST | `/api/roles` | Yeni rol oluştur | ✅ | Admin |
| PUT | `/api/roles/:id` | Rol güncelle | ✅ | Admin |
| DELETE | `/api/roles/:id` | Rol sil | ✅ | Admin |
| GET | `/api/roles/:roleId/permissions` | Rolün tüm izinlerini getir | ✅ | Admin |
| GET | `/api/roles/:roleId/permissions/:permission` | Rolün belirli iznini getir | ✅ | Admin |

### Permission Management Routes

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/permissions` | Tüm izinleri listele | ✅ | Admin |
| GET | `/api/permissions/:id` | Tek izin getir | ✅ | Admin |
| POST | `/api/permissions` | Yeni izin oluştur | ✅ | Admin |
| PUT | `/api/permissions/:id` | İzin güncelle | ✅ | Admin |
| DELETE | `/api/permissions/:id` | İzin sil | ✅ | Admin |

## 🔐 Authentication

API, JWT (JSON Web Token) kullanır. Protected route'lara erişim için:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Örnek Kullanım

### Kullanıcı Kaydı
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "password": "SecurePass123"
  }'
```

### Kullanıcı Girişi
```bash
# Admin ile giriş
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123"
  }'

# Moderator ile giriş
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moderator@example.com",
    "password": "ModeratorPass123"
  }'

# Test kullanıcısı ile giriş
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Protected Route Erişimi
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Kendi Profilini Güncelleme
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "firstName": "Yeni Ad",
    "lastName": "Yeni Soyad",
    "phone": "+90 555 123 4567"
  }'
```

### Kendi Şifresini Değiştirme
```bash
curl -X PUT http://localhost:3000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "currentPassword": "MevcutŞifre",
    "newPassword": "YeniŞifre123",
    "confirmPassword": "YeniŞifre123"
  }'
```

### Role Yönetimi Örnekleri

#### Rolleri Listeleme
```bash
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Yeni Rol Oluşturma
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{
    "name": "editor",
    "description": "İçerik editörü rolü",
    "permissions": ["event:read", "event:create", "event:update", "event:list"],
    "priority": 25
  }'
```

#### Rolün Tüm İzinlerini Getirme
```bash
curl -X GET http://localhost:3000/api/roles/{roleId}/permissions \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Rolün Belirli İznini Getirme
```bash
curl -X GET http://localhost:3000/api/roles/{roleId}/permissions/user:read \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### Permission Yönetimi Örnekleri

#### Tüm İzinleri Listeleme
```bash
curl -X GET http://localhost:3000/api/permissions \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Yeni İzin Oluşturma
```bash
curl -X POST http://localhost:3000/api/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{
    "description": "Etkinlikleri onaylama izni",
    "resource": "event",
    "action": "approve",
    "priority": 35
  }'
```

## 🔍 Query Builder Kullanımı

### User Controller Query Builder Örnekleri

#### Basit Kullanıcı Listesi
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Arama ile Kullanıcı Listesi
```bash
curl -X GET "http://localhost:3000/api/users?filter={\"firstName\":{\"like\":\"ahmet\"}}&page=1&limit=5" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Rol Filtresi ile Kullanıcı Listesi
```bash
curl -X GET "http://localhost:3000/api/users?filter={\"role\":\"admin\",\"isActive\":true}&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Sıralama ile Kullanıcı Listesi
```bash
curl -X GET "http://localhost:3000/api/users?sort=firstName&page=1&limit=20" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Alan Seçimi ile Kullanıcı Listesi
```bash
# Sadece belirli alanları getir
curl -X GET "http://localhost:3000/api/users?select=firstName,lastName,email&page=1&limit=10" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Password hariç tüm alanları getir
curl -X GET "http://localhost:3000/api/users?select=-password,-__v&page=1&limit=10" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Varsayılan olarak password hariç tutulur
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### İlişkiler ile Kullanıcı Listesi
```bash
# Role bilgisi ile birlikte getir
curl -X GET "http://localhost:3000/api/users?with=role&page=1&limit=10" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Karmaşık Sorgu Örneği
```bash
curl -X GET "http://localhost:3000/api/users?search=admin&role=admin&isActive=true&sortBy=createdAt&sortOrder=desc&select=firstName,lastName,email,role&with=role&page=1&limit=5" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### 🚀 Gelişmiş Filtreleme ve Sıralama (Laravel Benzeri)

#### Gelişmiş Filtreleme
```bash
# Basit eşitlik (Array formatı)
curl -X GET "http://localhost:3000/api/users?filter[firstName]=Admin&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Çoklu değer (Array formatı)
curl -X GET "http://localhost:3000/api/users?filter[firstName]=Admin,Test&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# JSON formatında gelişmiş filtreleme
curl -X GET "http://localhost:3000/api/users?filter={\"firstName\":\"Admin\"}&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Operatörler ile filtreleme
curl -X GET "http://localhost:3000/api/users?filter={\"firstName\":{\"like\":\"admin\"}}&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Çoklu değer JSON formatında
curl -X GET "http://localhost:3000/api/users?filter={\"firstName\":[\"Admin\",\"Test\"]}&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Gelişmiş Sıralama
```bash
# Tek alan azalan: sort=-name
curl -X GET "http://localhost:3000/api/users?sort=-firstName&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Çoklu alan sıralama: sort=name,-email
curl -X GET "http://localhost:3000/api/users?sort=firstName,-email&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Karmaşık sıralama: sort=firstName,-email,createdAt
curl -X GET "http://localhost:3000/api/users?sort=firstName,-email,createdAt&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Sort Alias'ları: sort=name-length
curl -X GET "http://localhost:3000/api/users?sort=name-length&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Tam isim sıralama: sort=full-name
curl -X GET "http://localhost:3000/api/users?sort=full-name&page=1" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### Query Builder Özellikleri

#### Filtreleme (Filtering)
- **Eşitlik:** `?filter={"role":"admin"}`
- **Arama:** `?filter={"firstName":{"like":"ahmet"}}`
- **Boolean:** `?filter={"isActive":true}`
- **Çoklu değer:** `?filter={"role":["admin","moderator"]}`

#### Gelişmiş Filtreleme (Advanced Filtering)
- **Basit eşitlik:** `?filter[firstName]=Admin`
- **Çoklu değer:** `?filter[firstName]=Admin,Test`
- **JSON formatı:** `?filter={"firstName":"Admin"}`
- **Operatörler:** `?filter={"firstName":{"like":"admin"}}`
- **Çoklu değer JSON:** `?filter={"firstName":["Admin","Test"]}`

#### Sıralama (Sorting)
- **Tek alan:** `?sort=firstName`
- **Varsayılan:** `createdAt` alanına göre `desc` sıralama

#### Gelişmiş Sıralama (Advanced Sorting)
- **Tek alan azalan:** `?sort=-firstName`
- **Çoklu alan:** `?sort=firstName,-email,createdAt`
- **Laravel benzeri:** `?sort=name,-email,password`
- **Sort Alias'ları:** `?sort=name-length`, `?sort=full-name`, `?sort=email-length`

#### Sayfalama (Pagination)
- **Sayfa:** `?page=1` (varsayılan: 1)
- **Limit:** `?limit=10` (varsayılan: 10, max: 100)

#### Alan Seçimi (Selecting Fields)
- **Dahil etme:** `?select=firstName,lastName,email`
- **Hariç tutma:** `?select=-password,-__v`

#### İlişkiler (Including Relationships)
- **Tek ilişki:** `?with=role`
- **Çoklu ilişki:** `?with=role,permissions`

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "email": "ahmet@example.com",
      "role": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "admin",
        "description": "Tam yönetici rolü"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🧪 Test

```bash
npm test
```

## 📊 Health Check

```bash
curl http://localhost:3000/api/health
```

## 🔧 Scripts

- `npm start` - Production modunda başlat
- `npm run dev` - Development modunda başlat (nodemon)
- `npm test` - Testleri çalıştır
- `npm run lint` - ESLint kontrolü
- `npm run lint:fix` - ESLint düzeltmeleri
- `npm run seed` - Tüm varsayılan verileri oluştur (izinler, roller, kullanıcılar)

## 🛡️ Güvenlik

- **Helmet** - Güvenlik header'ları
- **Rate Limiting** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Veri doğrulama
- **Password Hashing** - bcrypt ile şifre hash'leme
- **JWT** - Güvenli token tabanlı authentication
- **Role-based Authorization** - Rol tabanlı yetkilendirme
- **Permission-based Authorization** - İzin tabanlı yetkilendirme

## 📈 Performance

- **Database Indexing** - MongoDB index'leri
- **Query Optimization** - Optimize edilmiş sorgular
- **Response Caching** - Uygun yerlerde cache
- **Error Handling** - Hızlı hata yanıtları

## 🎭 Role & Permission System

### Permission Model Yapısı

**Permission Modeli:**
```javascript
{
  "description": "Kullanıcı bilgilerini görüntüleme izni",
  "resource": "user",           // Kaynak (user, event, category, system)
  "action": "read",             // Eylem (read, create, update, delete, list)
  "isActive": true,             // Aktif durumu
  "priority": 10,               // Öncelik
}
```

### Varsayılan Roller

| Rol | Açıklama | İzinler |
|-----|----------|---------|
| **User** | Standart kullanıcı | `user:read`, `event:read`, `event:list`, `category:read`, `category:list` |
| **Moderator** | Sınırlı yönetici | User + `user:list`, `user:update`, `event:create`, `event:update`, `category:create`, `category:update` |
| **Admin** | Tam yönetici | Tüm sistem izinleri (18 izin) |

### Varsayılan Kullanıcılar

| Kullanıcı | Email | Şifre | Rol |
|-----------|-------|-------|-----|
| **Admin** | admin@example.com | AdminPass123 | Yönetici |
| **Moderator** | moderator@example.com | ModeratorPass123 | Moderatör |
| **Test User** | test@example.com | TestPass123 | Kullanıcı |

### İzin Sistemi

**Mevcut İzinler (18 adet):**

**User Permissions (5):**
- `user:read` - Kullanıcı bilgilerini görüntüleme
- `user:create` - Yeni kullanıcı oluşturma
- `user:update` - Kullanıcı bilgilerini güncelleme
- `user:delete` - Kullanıcı silme
- `user:list` - Kullanıcı listesini görüntüleme

**Event Permissions (5):**
- `event:read` - Etkinlik bilgilerini görüntüleme
- `event:create` - Yeni etkinlik oluşturma
- `event:update` - Etkinlik bilgilerini güncelleme
- `event:delete` - Etkinlik silme
- `event:list` - Etkinlik listesini görüntüleme

**Category Permissions (5):**
- `category:read` - Kategori bilgilerini görüntüleme
- `category:create` - Yeni kategori oluşturma
- `category:update` - Kategori bilgilerini güncelleme
- `category:delete` - Kategori silme
- `category:list` - Kategori listesini görüntüleme

**System Permissions (3):**
- `system:admin` - Tam sistem yönetici izni
- `system:settings` - Sistem ayarlarını değiştirme izni
- `system:logs` - Sistem loglarını görüntüleme izni

### Yetkilendirme Middleware'leri

```javascript
// Role tabanlı yetkilendirme
app.get('/admin/users', authorizeRoles(['admin']), userController.getAllUsers);

// İzin tabanlı yetkilendirme
app.post('/events', authorizePermission('event:create'), eventController.createEvent);

// Birden fazla izin kontrolü
app.put('/users/:id', authorizeAnyPermission(['user:update', 'system:admin']), userController.updateUser);
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Kenan Gundogan**

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 