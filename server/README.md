# METLİ/FMT Backend Server

## Kurulum

```bash
cd server
npm install
```

## MySQL Ayarları

Ortam değişkenlerini ayarlayın veya varsayılan değerleri kullanın:

```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=your_password
export DB_NAME=metli_db
export JWT_SECRET=your-secret-key
export PORT=3001
```

## Çalıştırma

```bash
npm start
# veya geliştirme modunda:
npm run dev
```

Sunucu başlatıldığında otomatik olarak:
- `metli_db` veritabanını oluşturur
- `admin_users`, `products`, `blog_posts` tablolarını oluşturur
- Varsayılan admin kullanıcısını ekler (admin / admin123)
- 15 varsayılan ürünü ekler
- 3 varsayılan blog yazısını ekler

## API Endpoints

### Auth
- `POST /api/auth/login` — Giriş (username, password)

### Ürünler
- `GET /api/products` — Tüm ürünler
- `GET /api/products/:id` — Ürün detayı
- `POST /api/products` — Yeni ürün (auth + multipart/form-data)
- `PUT /api/products/:id` — Ürün güncelle (auth + multipart/form-data)
- `DELETE /api/products/:id` — Ürün sil (auth)

### Blog
- `GET /api/blog` — Tüm yazılar
- `GET /api/blog/:id` — Yazı detayı
- `POST /api/blog` — Yeni yazı (auth + multipart/form-data)
- `PUT /api/blog/:id` — Yazı güncelle (auth + multipart/form-data)
- `DELETE /api/blog/:id` — Yazı sil (auth)

### Admin Kullanıcılar
- `GET /api/admin/users` — Kullanıcı listesi (auth)
- `POST /api/admin/users` — Yeni admin (auth)
- `PUT /api/admin/users/:id/password` — Şifre değiştir (auth)
- `DELETE /api/admin/users/:id` — Admin sil (auth)

### Görsel Yükleme
- `POST /api/upload` — Görsel yükle (auth, max 10 dosya)

## Varsayılan Giriş
- Kullanıcı adı: `admin`
- Şifre: `admin123`
