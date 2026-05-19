import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'metli-fmt-secret-key-2024';

// ═══ Middleware ═══
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// ═══ MySQL Connection ═══
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'metli_db',
  charset: 'utf8mb4',
};

let pool;

async function initDB() {
  // Create database if not exists
  const tempConn = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
  });
  await tempConn.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await tempConn.end();

  pool = mysql.createPool(DB_CONFIG);

  // Create tables
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'wire',
      icon VARCHAR(50) DEFAULT '🔗',
      specs JSON,
      images JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      content TEXT,
      excerpt TEXT,
      category VARCHAR(200) DEFAULT 'Haberler',
      images JSON,
      date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Seed default admin if none exists
  const [admins] = await pool.execute('SELECT COUNT(*) as cnt FROM admin_users');
  if (admins[0].cnt === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.execute('INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)', ['admin', hash, 'Yönetici']);
    console.log('✅ Default admin created: admin / admin123');
  }

  // Seed default products if none exist
  const [prods] = await pool.execute('SELECT COUNT(*) as cnt FROM products');
  if (prods[0].cnt === 0) {
    const defaultProducts = [
      ['Dikenli Tel (Ters Büküm)', 'Sıcak daldırma galvanizli telden üretilen ters bükümlü dikenli tel. TSE EN 10223-1:2012 ve ISO 9001:2015 standartlarında.', 'wire', '🔗', JSON.stringify(['Halat teli çapı: 1.30 - 2.50 mm', 'Diken teli çapı: 1.30 - 2.00 mm', 'Dikenler arası: 75 - 110 mm', 'TSE EN 10223-1:2012']), '[]'],
      ['Helezon (Fens) Çit Teli', 'Galvanizli veya PVC kaplı helezon çit teli. Farklı göz aralığı ve rulo genişliği seçenekleri.', 'fence', '🏗️', JSON.stringify(['Tel çapı: 1.8 - 4 mm', 'Göz aralığı: 1.5x1.5 - 7x7 cm', 'Rulo genişliği: 1 - 6 mt', 'Galvanizli veya PVC kaplı']), '[]'],
      ['Emprenyeli Ahşap Direkler', 'Kestane, kızılçam, sarıçam ağaçlarından üretilen, WBC ile basınç altında emprenye edilmiş direkler.', 'wood', '🪵', JSON.stringify(['Kalınlık: Q6 - Q12', 'Uzunluk: 100 - 200 cm', 'Çap: 8-10 cm', 'WBC emprenye']), '[]'],
      ['L Profil ve Kazık', 'Çeşitli ölçülerde L profil ve kazık çeşitleri. Tek ve çift T seçenekleri mevcuttur.', 'fence', '📐', JSON.stringify(['40x40x4 mm (70-200 cm)', '25x25x3 mm (70-90 cm)', '40x40x5 mm (200-225 cm)', 'Tek/Çift T seçenekleri']), '[]'],
      ['Jiletli Tel', 'Yüksek güvenlikli alanlar için jiletli tel çözümleri. Galvanizli çelik malzemeden üretim.', 'wire', '⚔️', JSON.stringify(['Yüksek güvenlik', 'Galvanizli çelik', 'Farklı çap seçenekleri', 'Uzun ömürlü']), '[]'],
      ['Kafes Tel', 'Çeşitli amaçlarla kullanılabilen galvanizli kafes tel ürünleri.', 'wire', '🔲', JSON.stringify(['Galvanizli', 'Farklı göz aralıkları', 'Çeşitli genişlikler', 'Dayanıklı yapı']), '[]'],
      ['Altıgen Örgü Çit Teli', 'Tavuk teli olarak da bilinen altıgen örgü çit teli. Bahçe ve kümes uygulamaları için ideal.', 'fence', '⬡', JSON.stringify(['Altıgen örgü', 'Galvanizli', 'Farklı göz boyutları', 'Hafif ve dayanıklı']), '[]'],
      ['Kümes Teli', 'Kümes ve bahçe çitleme uygulamaları için özel üretim kümes teli.', 'fence', '🐔', JSON.stringify(['Galvanizli', 'Korozyona dayanıklı', 'Kolay uygulama', 'Ekonomik']), '[]'],
      ['Bağ Teli', 'Bağ ve bahçelerde kullanılan özel üretim bağ teli.', 'agriculture', '🍇', JSON.stringify(['Galvanizli', 'Yüksek mukavemet', 'UV dayanıklı', 'Uzun ömürlü']), '[]'],
      ['Telli Terbiye File Sistemi', 'Modern meyve bahçeleri için emprenyeli ahşap direk, galvanizli çelik halat ve koruyucu filelerden oluşan profesyonel sistem.', 'agriculture', '🌳', JSON.stringify(['Emprenyeli ahşap direk', 'Galvanizli çelik halat', 'Koruyucu file', 'Profesyonel kurulum']), '[]'],
      ['Galvanizli Boru Direk', 'Çit ve çevre güvenliği uygulamalarında kullanılan galvanizli boru direkler.', 'fence', '🔩', JSON.stringify(['Galvanizli', 'Farklı çap seçenekleri', 'Farklı uzunluklar', 'Korozyona dayanıklı']), '[]'],
      ['Demir Direk', 'Çit ve çevre güvenliği için sağlam demir direk çeşitleri.', 'fence', '🏛️', JSON.stringify(['Yüksek mukavemet', 'Farklı profiller', 'Boyalı veya ham', 'Uzun ömürlü']), '[]'],
      ['Gölgeleme ve Dolu Filesi', 'Güneş yanığını ve meyve çatlamasını önleyen koruyucu fileler.', 'accessories', '☀️', JSON.stringify(['UV dayanıklı', 'Farklı gölgeleme oranları', 'Dolu koruması', 'Uzun ömürlü']), '[]'],
      ['Kova Tipi Ahşap Direk Şapkası', 'Direği su ve nemden koruyarak ömrünü uzatan ahşap direk şapkası.', 'accessories', '🎩', JSON.stringify(['Su geçirmez', 'Kolay montaj', 'Dayanıklı malzeme', 'Direk koruma']), '[]'],
      ['Tel Gerdirme Aparatı', 'Sistemin zamanla gevşemesini önleyerek gergin tutan tel gerdirme aparatı.', 'accessories', '🔧', JSON.stringify(['Galvanizli çelik', 'Kolay kullanım', 'Ayarlanabilir', 'Uzun ömürlü']), '[]'],
    ];
    for (const p of defaultProducts) {
      await pool.execute('INSERT INTO products (title, description, category, icon, specs, images) VALUES (?, ?, ?, ?, ?, ?)', p);
    }
    console.log('✅ 15 default products seeded');
  }

  // Seed default blog posts if none exist
  const [blogs] = await pool.execute('SELECT COUNT(*) as cnt FROM blog_posts');
  if (blogs[0].cnt === 0) {
    const defaultBlogs = [
      ['Telli Terbiye Sistemlerinde Yeni Dönem', 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır. FMT Makina olarak bu alanda sunduğumuz yenilikçi çözümlerle müşterilerimizin verimliliklerini artırıyoruz.', 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır.', 'Projeler', '2024-12-15'],
      ['ISO 9001:2015 Sertifikamızı Yeniledik', 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz. ISO 9001:2015 sertifikamızı başarıyla yeniledik.', 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz.', 'Haberler', '2024-11-20'],
      ['Kozan OSB\'deki Üretim Tesisimiz Genişliyor', 'Artan üretim kapasitesi ve büyüyen müşteri talepleri doğrultusunda Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz.', 'Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz.', 'Haberler', '2024-10-05'],
    ];
    for (const b of defaultBlogs) {
      await pool.execute('INSERT INTO blog_posts (title, content, excerpt, category, date) VALUES (?, ?, ?, ?, ?)', b);
    }
    console.log('✅ 3 default blog posts seeded');
  }

  console.log('✅ Database initialized successfully');
}

// ═══ Auth Middleware ═══
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ═══ AUTH ROUTES ═══
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ ADMIN USER ROUTES ═══
app.get('/api/admin/users', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, name, created_at FROM admin_users');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/users', auth, async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute('INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)', [username, hash, name]);
    res.json({ id: result.insertId, username, name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/users/:id/password', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hash, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/users/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ PRODUCT ROUTES ═══
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY id ASC');
    res.json(rows.map(r => ({ ...r, specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : r.specs, images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const r = rows[0];
    res.json({ ...r, specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : r.specs, images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category, icon, specs } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...images];
    const [result] = await pool.execute(
      'INSERT INTO products (title, description, category, icon, specs, images) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, category || 'wire', icon || '🔗', specs || '[]', JSON.stringify(allImages)]
    );
    res.json({ id: result.insertId, title, description, category, icon, specs: JSON.parse(specs || '[]'), images: allImages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category, icon, specs } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    await pool.execute(
      'UPDATE products SET title=?, description=?, category=?, icon=?, specs=?, images=? WHERE id=?',
      [title, description, category, icon, specs || '[]', JSON.stringify(allImages), req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ BLOG ROUTES ═══
app.get('/api/blog', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts ORDER BY date DESC, id DESC');
    res.json(rows.map(r => ({ ...r, images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || []) })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    const r = rows[0];
    res.json({ ...r, images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || []) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/blog', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...images];
    const [result] = await pool.execute(
      'INSERT INTO blog_posts (title, content, excerpt, category, date, images) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt || (content || '').slice(0, 150), category || 'Haberler', date || new Date().toISOString().split('T')[0], JSON.stringify(allImages)]
    );
    res.json({ id: result.insertId, title });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/blog/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    await pool.execute(
      'UPDATE blog_posts SET title=?, content=?, excerpt=?, category=?, date=?, images=? WHERE id=?',
      [title, content, excerpt, category, date, JSON.stringify(allImages), req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/blog/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ IMAGE UPLOAD ═══
app.post('/api/upload', auth, upload.array('images', 10), (req, res) => {
  const urls = (req.files || []).map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// ═══ START ═══
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 METLİ/FMT Backend running on http://localhost:${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api`);
    console.log(`\n📋 Endpoints:`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/products`);
    console.log(`   GET  /api/products/:id`);
    console.log(`   POST /api/products (auth + images)`);
    console.log(`   PUT  /api/products/:id (auth + images)`);
    console.log(`   DEL  /api/products/:id (auth)`);
    console.log(`   GET  /api/blog`);
    console.log(`   GET  /api/blog/:id`);
    console.log(`   POST /api/blog (auth + images)`);
    console.log(`   PUT  /api/blog/:id (auth + images)`);
    console.log(`   DEL  /api/blog/:id (auth)`);
    console.log(`   GET  /api/admin/users (auth)`);
    console.log(`   POST /api/admin/users (auth)`);
    console.log(`   PUT  /api/admin/users/:id/password (auth)`);
    console.log(`   DEL  /api/admin/users/:id (auth)`);
    console.log(`\n🔐 Default admin: admin / admin123`);
    console.log(`\n⚙️  MySQL config: ${DB_CONFIG.host}/${DB_CONFIG.database}`);
  });
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  console.error('   Make sure MySQL is running and credentials are correct.');
  console.error('   Set DB_HOST, DB_USER, DB_PASS, DB_NAME environment variables.');
  process.exit(1);
});
