import 'dotenv/config';
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
const PORT = process.env.PORT && Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'metli-fmt-secret-key-2024';

// ═══ Middleware ═══
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Create uploads directory with absolute path
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer config for image and video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for large videos/images
  fileFilter: (req, file, cb) => {
    const isMedia =
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      /\.(jpeg|jpg|png|gif|webp|svg|avif|heic|heif|bmp|ico|tiff|mp4|webm|mov|m4v|quicktime|ogg|ogv|mkv|avi)$/i.test(file.originalname);
    if (isMedia) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya formatı. Lütfen geçerli bir görsel veya video dosyası yükleyin.'));
    }
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
      is_featured TINYINT DEFAULT 1,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      content LONGTEXT,
      excerpt TEXT,
      category VARCHAR(200) DEFAULT 'Haberler',
      images JSON,
      date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS site_sections (
      section_key VARCHAR(50) PRIMARY KEY,
      data JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      message TEXT NOT NULL,
      is_read TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Auto-migrate missing columns in products table if existing from older schema
  try {
    const [colsSort] = await pool.execute("SHOW COLUMNS FROM products LIKE 'sort_order'");
    if (colsSort.length === 0) {
      await pool.execute("ALTER TABLE products ADD COLUMN sort_order INT DEFAULT 0");
      console.log('✅ Added sort_order column to products');
    }
  } catch (e) {}

  try {
    const [colsFeat] = await pool.execute("SHOW COLUMNS FROM products LIKE 'is_featured'");
    if (colsFeat.length === 0) {
      await pool.execute("ALTER TABLE products ADD COLUMN is_featured TINYINT DEFAULT 1");
      console.log('✅ Added is_featured column to products');
    }
  } catch (e) {}

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
      ['Dikenli Tel (Ters Büküm)', 'Sıcak daldırma galvanizli telden üretilen ters bükümlü dikenli tel. TSE EN 10223-1:2012 ve ISO 9001:2015 standartlarında.', 'wire', '🔗', JSON.stringify(['Halat teli çapı: 1.30 - 2.50 mm', 'Diken teli çapı: 1.30 - 2.00 mm', 'Dikenler arası: 75 - 110 mm', 'TSE EN 10223-1:2012']), JSON.stringify(['/images/barbed-wire.jpg'])],
      ['Helezon (Fens) Çit Teli', 'Galvanizli veya PVC kaplı helezon çit teli. Farklı göz aralığı ve rulo genişliği seçenekleri.', 'fence', '🏗️', JSON.stringify(['Tel çapı: 1.8 - 4 mm', 'Göz aralığı: 1.5x1.5 - 7x7 cm', 'Rulo genişliği: 1 - 6 mt', 'Galvanizli veya PVC kaplı']), JSON.stringify(['/images/fence-wire.jpg'])],
      ['Emprenyeli Ahşap Direkler', 'Kestane, kızılçam, sarıçam ağaçlarından üretilen, WBC ile basınç altında emprenye edilmiş direkler.', 'wood', '🪵', JSON.stringify(['Kalınlık: Q6 - Q12', 'Uzunluk: 100 - 200 cm', 'Çap: 8-10 cm', 'WBC emprenye']), JSON.stringify(['/images/wooden-posts.jpg'])],
      ['L Profil ve Kazık', 'Çeşitli ölçülerde L profil ve kazık çeşitleri. Tek ve çift T seçenekleri mevcuttur.', 'fence', '📐', JSON.stringify(['40x40x4 mm (70-200 cm)', '25x25x3 mm (70-90 cm)', '40x40x5 mm (200-225 cm)', 'Tek/Çift T seçenekleri']), JSON.stringify(['/images/l-profile.jpg'])],
      ['Jiletli Tel', 'Yüksek güvenlikli alanlar için jiletli tel çözümleri. Galvanizli çelik malzemeden üretim.', 'wire', '⚔️', JSON.stringify(['Yüksek güvenlik', 'Galvanizli çelik', 'Farklı çap seçenekleri', 'Uzun ömürlü']), JSON.stringify(['/images/razor-wire.jpg'])],
      ['Kafes Tel', 'Çeşitli amaçlarla kullanılabilen galvanizli kafes tel ürünleri.', 'wire', '🔲', JSON.stringify(['Galvanizli', 'Farklı göz aralıkları', 'Çeşitli genişlikler', 'Dayanıklı yapı']), JSON.stringify(['/images/fence-wire.jpg'])],
      ['Altıgen Örgü Çit Teli', 'Tavuk teli olarak da bilinen altıgen örgü çit teli. Bahçe ve kümes uygulamaları için ideal.', 'fence', '⬡', JSON.stringify(['Altıgen örgü', 'Galvanizli', 'Farklı göz boyutları', 'Hafif ve dayanıklı']), '[]'],
      ['Kümes Teli', 'Kümes ve bahçe çitleme uygulamaları için özel üretim kümes teli.', 'fence', '🐔', JSON.stringify(['Galvanizli', 'Korozyona dayanıklı', 'Kolay uygulama', 'Ekonomik']), '[]'],
      ['Bağ Teli', 'Bağ ve bahçelerde kullanılan özel üretim bağ teli.', 'agriculture', '🍇', JSON.stringify(['Galvanizli', 'Yüksek mukavemet', 'UV dayanıklı', 'Uzun ömürlü']), JSON.stringify(['/images/trellis-system.jpg'])],
      ['Telli Terbiye File Sistemi', 'Modern meyve bahçeleri için emprenyeli ahşap direk, galvanizli çelik halat ve koruyucu filelerden oluşan profesyonel sistem.', 'agriculture', '🌳', JSON.stringify(['Emprenyeli ahşap direk', 'Galvanizli çelik halat', 'Koruyucu file', 'Profesyonel kurulum']), JSON.stringify(['/images/trellis-system.jpg'])],
      ['Galvanizli Boru Direk', 'Çit ve çevre güvenliği uygulamalarında kullanılan galvanizli boru direkler.', 'fence', '🔩', JSON.stringify(['Galvanizli', 'Farklı çap seçenekleri', 'Farklı uzunluklar', 'Korozyona dayanıklı']), '[]'],
      ['Demir Direk', 'Çit ve çevre güvenliği için sağlam demir direk çeşitleri.', 'fence', '🏛️', JSON.stringify(['Yüksek mukavemet', 'Farklı profiller', 'Boyalı veya ham', 'Uzun ömürlü']), '[]'],
      ['Gölgeleme ve Dolu Filesi', 'Güneş yanığını ve meyve çatlamasını önleyen koruyucu fileler.', 'accessories', '☀️', JSON.stringify(['UV dayanıklı', 'Farklı gölgeleme oranları', 'Dolu koruması', 'Uzun ömürlü']), JSON.stringify(['/images/orchard-netting.jpg'])],
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
      ['Telli Terbiye Sistemlerinde Yeni Dönem', 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır. FMT Makina olarak bu alanda sunduğumuz yenilikçi çözümlerle müşterilerimizin verimliliklerini artırıyoruz.', 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır.', 'Projeler', '2024-12-15', JSON.stringify(['/images/trellis-system.jpg'])],
      ['ISO 9001:2015 Sertifikamızı Yeniledik', 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz. ISO 9001:2015 sertifikamızı başarıyla yeniledik.', 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz.', 'Haberler', '2024-11-20', JSON.stringify(['/images/factory.jpg'])],
      ['Kozan OSB\'deki Üretim Tesisimiz Genişliyor', 'Artan üretim kapasitesi ve büyüyen müşteri talepleri doğrultusunda Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz.', 'Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz.', 'Haberler', '2024-10-05', JSON.stringify(['/images/hero-bg.jpg'])],
    ];
    for (const b of defaultBlogs) {
      await pool.execute('INSERT INTO blog_posts (title, content, excerpt, category, date, images) VALUES (?, ?, ?, ?, ?, ?)', b);
    }
    console.log('✅ 3 default blog posts seeded');
  }

  // Seed default site sections if not present
  const defaultSections = {
    home_hero: {
      experienceBadge: '50+ Yıllık Tecrübe',
      title: {
        tr: 'Yarım Asırlık Tecrübe ile Güvenilir Üretim',
        en: 'Reliable Production with Half a Century of Experience',
        es: 'Producción Confiable con Medio Siglo de Experiencia',
        ru: 'Надежное производство с полувековым опытом'
      },
      subtitle: {
        tr: 'Tel, çit, ahşap direk ve modern telli terbiye sistemlerinde 50 yılı aşkın tecrübemizle sanayi ve tarım sektörüne değer katıyoruz.',
        en: 'We add value to industry and agriculture with over 50 years of experience in wire, fence, wooden posts and trellis systems.',
        es: 'Aportamos valor a los sectores industrial y agrícola con más de 50 años de experiencia...',
        ru: 'Мы приносим пользу промышленности и сельскому хозяйству с более чем 50-летним опытом...'
      },
      slogan: {
        tr: 'Güçlü Altyapı, Kaliteli Üretim, Güvenli Gelecek',
        en: 'Strong Infrastructure, Quality Production, Secure Future',
        es: 'Infraestructura Fuerte, Producción de Calidad, Futuro Seguro',
        ru: 'Сильная инфраструктура, качественное производство, надежное будущее'
      },
      ctaPrimaryText: { tr: 'Ürünlerimizi İnceleyin', en: 'View Products', es: 'Ver Productos', ru: 'Посмотреть продукты' },
      ctaPrimaryLink: '/products',
      ctaSecondaryText: { tr: 'İletişime Geçin', en: 'Contact Us', es: 'Contáctenos', ru: 'Связаться с нами' },
      ctaSecondaryLink: '/contact',
      videos: ['/images/hero1.mp4', '/images/hero2.mp4']
    },
    home_stats: [
      { num: '50+', label: { tr: 'Yıllık Tecrübe', en: 'Years Experience', es: 'Años de Experiencia', ru: 'Лет опыта' } },
      { num: '5000+', label: { tr: 'Mutlu Müşteri', en: 'Happy Customers', es: 'Clientes Satisfechos', ru: 'Довольных клиентов' } },
      { num: '15+', label: { tr: 'Ürün Çeşidi', en: 'Product Varieties', es: 'Tipos de Productos', ru: 'Видов продукции' } },
      { num: '1000+', label: { tr: 'Tamamlanan Proje', en: 'Completed Projects', es: 'Proyectos Completados', ru: 'Завершенных проектов' } }
    ],
    home_gallery: [
      { src: '/images/barbed-wire.jpg', alt: 'Tel Ürünleri' },
      { src: '/images/fence-wire.jpg', alt: 'Çit Sistemleri' },
      { src: '/images/wooden-posts.jpg', alt: 'Emprenyeli Ahşap Direkler' },
      { src: '/images/trellis-system.jpg', alt: 'Telli Terbiye Sistemleri' },
      { src: '/images/factory.jpg', alt: 'Kozan OSB Fabrikamız' },
      { src: '/images/razor-wire.jpg', alt: 'Jiletli Tel Üretimi' },
      { src: '/images/l-profile.jpg', alt: 'L Profil ve Kazık' },
      { src: '/images/orchard-netting.jpg', alt: 'Dolu & Gölgeleme Filesi' }
    ],
    home_why_us: [
      {
        icon: '🏆',
        title: { tr: 'Yüksek Kalite', en: 'High Quality', es: 'Alta Calidad', ru: 'Высокое качество' },
        desc: { tr: 'TSE EN ve ISO 9001:2015 standartlarında sertifikalı üretim ile maksimum dayanıklılık.', en: 'Maximum durability with certified production in TSE EN and ISO 9001:2015 standards.', es: 'Máxima durabilidad con producción certificada...', ru: 'Максимальная долговечность...' },
        img: '/images/factory.jpg'
      },
      {
        icon: '🤝',
        title: { tr: 'Güven ve İstikrar', en: 'Trust & Stability', es: 'Confianza y Estabilidad', ru: 'Доверие и стабильность' },
        desc: { tr: '50 yılı aşkın süredir dürüst ve ilkeli ticaret anlayışımızla müşterilerimizin yanındayız.', en: 'We stand by our customers with over 50 years of honest and principled trade.', es: 'Estamos al lado de nuestros clientes...', ru: 'Мы рядом с нашими клиентами...' },
        img: '/images/trellis-system.jpg'
      },
      {
        icon: '💡',
        title: { tr: 'Yenilikçi Çözümler', en: 'Innovative Solutions', es: 'Soluciones Innovadoras', ru: 'Инновационные решения' },
        desc: { tr: 'Telli terbiye ve koruma sistemlerinde en güncel tarım teknolojilerini uyguluyoruz.', en: 'We apply the latest agricultural technologies in trellis and protection systems.', es: 'Aplicamos las últimas tecnologías agrícolas...', ru: 'Мы применяем новейшие технологии...' },
        img: '/images/orchard-netting.jpg'
      }
    ],
    home_cta: {
      title: { tr: 'Projeniz İçin En Doğru Çözümü Birlikte Belirleyelim', en: 'Let’s Determine the Right Solution Together', es: 'Determinemos Juntos la Solución Correcta', ru: 'Давайте вместе определим правильное решение' },
      desc: { tr: 'Uzman ekibimiz ihtiyacınıza en uygun tel, çit ve modern telli terbiye sistemlerini belirlemek için hazır.', en: 'Our expert team is ready to determine the best wire, fence and trellis systems for your needs.', es: 'Nuestro equipo de expertos está listo...', ru: 'Наша команда экспертов готова...' },
      buttonText: { tr: 'Hemen İletişime Geçin', en: 'Contact Now', es: 'Contáctenos Ahora', ru: 'Связаться прямо сейчас' },
      phone: '0545 479 05 85'
    },
    about_page: {
      heroTitle: { tr: 'Hakkımızda', en: 'About Us', es: 'Sobre Nosotros', ru: 'О нас' },
      heroSubtitle: { tr: '50 Yılı Aşkın Güven ve Kalite', en: 'Over 50 Years of Trust and Quality', es: 'Más de 50 Años de Confianza y Calidad', ru: 'Более 50 лет доверия и качества' },
      texts: [
        { tr: 'METLİ Ticaret, 1992 yılında Adana\'da çit teli ve tarımsal tel ürünleri ticaretiyle faaliyetlerine başlamıştır. Kurucumuz Bilal METLİ\'nin öncülüğünde yarım asrı aşan ticari tecrübemizle sektörde güvenin simgesi haline geldik.', en: 'METLİ Ticaret began its activities in 1992 in Adana with the trade of fence wire and agricultural wire products. Under the leadership of our founder Bilal METLİ, we have become a symbol of trust in the sector with over half a century of commercial experience.' },
        { tr: '2012 yılında kurulan FMT Makina Mühendislik İth. İhr. San. Tic. Ltd. Şti. ile üretim gücümüzü artırarak Adana Kozan Organize Sanayi Bölgesi\'nde modern tesislerimizde üretim yapmaktayız.', en: 'With FMT Makina Mühendislik established in 2012, we expanded our production power and manufacture in modern facilities in Adana Kozan Organized Industrial Zone.' },
        { tr: 'TSE EN 10223-1 ve TSE EN 10223-6 standartlarına uygun dikenli tel, helezon fens teli, jiletli tel ve çit sistemleri imalatı gerçekleştirmekteyiz.', en: 'We manufacture barbed wire, chain link fence wire, razor wire and fence systems in compliance with TSE EN 10223-1 and TSE EN 10223-6 standards.' },
        { tr: 'Ayrıca meyve bahçeleri için modern telli terbiye file sistemleri, emprenyeli ahşap direkler ve bağlantı elemanları anahtar teslimi olarak sunulmaktadır.', en: 'In addition, turnkey modern trellis netting systems, impregnated wooden posts and accessories are provided for fruit orchards.' },
        { tr: 'Kalite yönetiminde ISO 9001:2015 sertifikasına sahip firmamız, müşteri memnuniyeti ve sürdürülebilir kaliteyi ilke edinmiştir.', en: 'Holding ISO 9001:2015 quality management certification, our company prioritizes customer satisfaction and sustainable quality.' },
        { tr: 'Yurt içi ve yurt dışı pazarlara kaliteli, dayanıklı ve standartlara uygun ürünler sunmaktan gurur duyuyoruz.', en: 'We are proud to offer high quality, durable, and standard-compliant products to domestic and international markets.' }
      ],
      factoryTitle: { tr: 'Kozan OSB Üretim Tesisi', en: 'Kozan OSB Production Facility', es: 'Instalación de Producción Kozan OSB', ru: 'Производственный комплекс Козан OSB' },
      factoryDesc: { tr: 'Modern makine parkurumuz ile yüksek kapasiteli üretim', en: 'High capacity production with modern machinery', es: 'Producción de alta capacidad...', ru: 'Высокопроизводительное производство...' },
      factoryImage: '/images/factory.jpg',
      visionTitle: { tr: 'Vizyonumuz', en: 'Our Vision', es: 'Nuestra Visión', ru: 'Наше видение' },
      visionQuote: { tr: 'Kaliteden ödün vermeden, yenilikçi üretim anlayışıyla sektörde öncü olmak.', en: 'To be a pioneer in the sector with an innovative production understanding without sacrificing quality.', es: 'Ser pioneros en el sector...', ru: 'Быть пионером в отрасли...' },
      visionDesc: { tr: 'Gelişen teknolojiyi yakından takip ederek, müşterilerimize en kaliteli ürün ve hizmeti sunmak temel gayemizdir.', en: 'Our main goal is to closely follow evolving technology and provide top quality products and services to our customers.', es: 'Nuestro objetivo principal...', ru: 'Наша главная цель...' },
      timeline: [
        { year: '1992', title: { tr: 'Kuruluş', en: 'Foundation' }, desc: { tr: 'Adana\'da tel ticaretiyle sektöre ilk adım atıldı.', en: 'The first step into the sector was taken in Adana with wire trading.' } },
        { year: '2000', title: { tr: 'Bölgesel Büyüme', en: 'Regional Growth' }, desc: { tr: 'Çukurova bölgesinde lider tel ve çit tedarikçisi konumuna gelindi.', en: 'Became the leading wire and fence supplier in Çukurova region.' } },
        { year: '2012', title: { tr: 'FMT Makina Kuruluşu', en: 'FMT Makina Founded' }, desc: { tr: 'İmalat ve ihracat odaklı FMT Makina Mühendislik şirketi kuruldu.', en: 'Manufacturing and export-focused FMT Makina Mühendislik was founded.' } },
        { year: '2017', title: { tr: 'Kozan OSB Fabrikası', en: 'Kozan OSB Plant' }, desc: { tr: 'Adana Kozan OSB\'deki modern üretim tesisimiz faaliyete geçti.', en: 'Our modern production facility in Adana Kozan OSB started operations.' } },
        { year: '2024', title: { tr: 'Telli Terbiye Liderliği', en: 'Trellis Leadership' }, desc: { tr: 'Modern meyve bahçesi telli terbiye sistemlerinde Türkiye genelinde öncü konuma ulaşıldı.', en: 'Achieved leading position across Turkey in modern orchard trellis systems.' } }
      ],
      certificates: [
        { name: 'ISO 9001:2015', desc: { tr: 'Kalite Yönetim Sistemi', en: 'Quality Management System' } },
        { name: 'TSE EN 10223-1', desc: { tr: 'Çelik Tel ve Tel Ürünleri - Dikenli Tel', en: 'Steel Wire & Wire Products - Barbed Wire' } },
        { name: 'TSE EN 10223-6', desc: { tr: 'Çelik Tel ve Tel Ürünleri - Çit Teli', en: 'Steel Wire & Wire Products - Fence Wire' } }
      ],
      finalQuote: { tr: 'Yarım asırlık tecrübemiz, güçlü üretim altyapımız ve uzman kadromuzla geleceği inşa ediyoruz.', en: 'We build the future with half a century of experience, strong production infrastructure, and expert staff.' }
    },
    telli_terbiye_page: {
      heroTitle: { tr: 'Telli Terbiye File Sistemleri', en: 'Trellis & Netting Systems', es: 'Sistemas de Espaldera y Mallas', ru: 'Шпалерные и защитные сетчатые системы' },
      heroSubtitle: { tr: 'Modern meyve bahçeleri için yüksek verimli, dolu ve güneş korumalı profesyonel kurulum çözümleri', en: 'High yield, hail and sun protected professional installation solutions for modern fruit orchards', es: 'Soluciones de instalación profesional...', ru: 'Профессиональные решения...' },
      desc: { tr: 'Telli terbiye sistemleri; modern bodur ve yarı bodur meyve bahçelerinde fidanların düzgün gelişmesini, erken ve bol verime yatmasını sağlayan, dolu ve aşırı güneşten koruyan profesyonel altyapı sistemidir. FMT Makina olarak emprenyeli ahşap direk, galvanizli çelik halat, ankraj ve koruyucu file dahil anahtar teslim kurulum hizmeti sunuyoruz.', en: 'Trellis systems are professional infrastructure systems that ensure proper growth of seedlings in modern orchards...' },
      benefits: [
        { icon: '🌱', text: { tr: 'Erken ve Yüksek Verim', en: 'Early & High Yield' } },
        { icon: '🛡️', text: { tr: 'Dolu ve Güneş Koruması', en: 'Hail & Sun Protection' } },
        { icon: '✂️', text: { tr: 'Kolay Budama ve Hasat', en: 'Easy Pruning & Harvest' } },
        { icon: '📊', text: { tr: 'Homojen Meyve Kalitesi', en: 'Homogeneous Fruit Quality' } },
        { icon: '🍎', text: { tr: 'Maksimum Işık Dağılımı', en: 'Maximum Light Distribution' } }
      ],
      components: [
        { title: { tr: 'Emprenyeli Ahşap Direk', en: 'Impregnated Wooden Posts' }, desc: { tr: 'Kestane ve çam ağaçlarından üretilen, WBC basınçlı emprenye ile çürümeye karşı 20+ yıl dayanıklı direkler.', en: 'Posts made from chestnut and pine woods, durable 20+ years against decay with WBC pressure impregnation.' }, img: '/images/wooden-posts.jpg' },
        { title: { tr: 'Galvanizli Çelik Halat & Tel', en: 'Galvanized Steel Wire & Cable' }, desc: { tr: 'Yüksek çekme mukavemetli sıcak daldırma galvanizli taşıyıcı halat ve gergi telleri.', en: 'High tensile strength hot-dip galvanized carrier cables and tension wires.' }, img: '/images/barbed-wire.jpg' },
        { title: { tr: 'Dolu ve Gölgeleme Filesi', en: 'Hail & Shade Netting' }, desc: { tr: 'UV katkılı, yırtılmaya dayanıklı monofilament dolu koruma ve gölgeleme fileleri.', en: 'UV-resistant, tear-proof monofilament hail protection and shade netting.' }, img: '/images/orchard-netting.jpg' },
        { title: { tr: 'L Profil & Ankraj Kazıkları', en: 'L-Profile & Anchor Stakes' }, desc: { tr: 'Sistemi yere sağlam bağlayan galvanizli L profil ve tek/çift T ankraj kazıkları.', en: 'Galvanized L-profile and single/double T anchor stakes that firmly secure the system.' }, img: '/images/l-profile.jpg' }
      ],
      applications: [
        { icon: '🍏', text: { tr: 'Elma Bahçeleri', en: 'Apple Orchards' } },
        { icon: '🍐', text: { tr: 'Armut Bahçeleri', en: 'Pear Orchards' } },
        { icon: '🍒', text: { tr: 'Kiraz Bahçeleri', en: 'Cherry Orchards' } },
        { icon: '🍑', text: { tr: 'Şeftali & Nektarin', en: 'Peach & Nectarine' } },
        { icon: '🍇', text: { tr: 'Bağ Sistemleri', en: 'Vineyards' } },
        { icon: '📅', text: { tr: 'Hurma & Narenciye', en: 'Persimmon & Citrus' } }
      ],
      woodSpecs: {
        title: { tr: 'Emprenyeli Ahşap Direk Özellikleri', en: 'Wooden Post Specifications' },
        materials: [
          { tr: 'Kestane, Kızılçam, Sarıçam ağaçları', en: 'Chestnut, Red Pine, Scots Pine woods' },
          { tr: 'WBC Vakum-Basınç yöntemiyle emprenye işlemi', en: 'WBC Vacuum-Pressure impregnation method' },
          { tr: 'Toprak altı ve üstü çürümelere karşı 20+ yıl dayanım', en: '20+ years durability against underground and surface decay' }
        ],
        dimensions: [
          { tr: 'Kalınlık: Q6 - Q8 - Q10 - Q12', en: 'Thickness: Q6 - Q8 - Q10 - Q12' },
          { tr: 'Uzunluk: 2.50 mt - 3.00 mt - 3.50 mt - 4.00 mt - 4.50 mt', en: 'Length: 2.50 m - 4.50 m' },
          { tr: 'Tepelik kova tipi şapka ve tel tutturma kanalları', en: 'Top bucket-type caps and wire fastening channels' }
        ],
        image: '/images/wooden-posts.jpg'
      },
      accessories: [
        { name: { tr: 'Direk Şapkası (Kova Tipi)', en: 'Post Cap (Bucket Type)' }, img: '/images/wooden-posts.jpg' },
        { name: { tr: 'Tel Gerdirme Aparatı (Gripple)', en: 'Wire Tightener (Gripple)' }, img: '/images/l-profile.jpg' },
        { name: { tr: 'File Birleştirme Klipsi', en: 'Netting Clip' }, img: '/images/orchard-netting.jpg' },
        { name: { tr: 'Tel Klipsi & Çivisi', en: 'Wire Clip & Nail' }, img: '/images/barbed-wire.jpg' },
        { name: { tr: 'Ankraj Vidası & Kazığı', en: 'Anchor Screw & Stake' }, img: '/images/l-profile.jpg' },
        { name: { tr: 'Bambu & Kamış Destek Çubuğu', en: 'Bamboo Support Cane' }, img: '/images/wooden-posts.jpg' },
        { name: { tr: 'Elastik Fidan Bağlama İpi', en: 'Elastic Tree Tie Rope' }, img: '/images/trellis-system.jpg' },
        { name: { tr: 'Gergi Çıkrığı', en: 'Tensioning Winch' }, img: '/images/fence-wire.jpg' },
        { name: { tr: 'Dolu Filesi Taşıyıcı Plakası', en: 'Netting Carrier Plate' }, img: '/images/orchard-netting.jpg' },
        { name: { tr: 'Ağaç Gövde Koruyucu', en: 'Trunk Protector' }, img: '/images/factory.jpg' }
      ],
      gallery: [
        '/images/trellis-system.jpg',
        '/images/orchard-netting.jpg',
        '/images/wooden-posts.jpg',
        '/images/hero-bg.jpg'
      ]
    },
    services_marquee: [
      { tr: 'İl Tarım ve Orman Genel Müdürlüğü', en: 'Provincial Directorate of Agriculture and Forestry', es: 'Dirección Provincial de Agricultura y Bosques', ru: 'Провинциальное управление сельского и лесного хозяйства' },
      { tr: 'Modern Meyve Bahçesi Telli Terbiye Sistemleri', en: 'Modern Orchard Trellis Systems', es: 'Sistemas de Espaldera para Frutales', ru: 'Современные шпалерные системы' },
      { tr: 'Dikenli & Jiletli Tel Güvenlik Çözümleri', en: 'Barbed & Razor Wire Security Solutions', es: 'Soluciones de Seguridad de Alambre', ru: 'Системы безопасности из колючей проволоки' },
      { tr: 'Helezon & Panel Çit Uygulamaları', en: 'Chain Link & Panel Fence Applications', es: 'Aplicaciones de Malla y Valla', ru: 'Рулонные и панельные ограждения' },
      { tr: 'Emprenyeli Ahşap Direk Üretimi', en: 'Impregnated Wooden Post Production', es: 'Producción de Postes de Madera Impregnada', ru: 'Производство импрегнированных столбов' },
      { tr: 'Gölgeleme ve Dolu Koruma Fileleri', en: 'Shade & Hail Protection Netting', es: 'Mallas de Sombra y Antigranizo', ru: 'Защитные сетки от града и солнца' },
      { tr: 'Sanayi & Fabrika Çevre Güvenliği', en: 'Industrial & Factory Perimeter Security', es: 'Seguridad Perimetral Industrial', ru: 'Периметральная безопасность заводов' },
      { tr: 'Karayolu & Otoyol Çit Sistemleri', en: 'Highway & Roadside Fence Systems', es: 'Sistemas de Vallas para Carreteras', ru: 'Дорожные ограждения' }
    ],
    footer_settings: {
      aboutText: {
        tr: 'Tel ürünleri, çit sistemleri, emprenyeli ahşap direkler ve telli terbiye file sistemlerinde yarım asırlık tecrübemizle sanayi ve tarım sektörüne değer katıyoruz.',
        en: 'With half a century of experience in wire products, fence systems, impregnated wooden posts and trellis netting systems, we add value to the industrial and agricultural sectors.',
        es: 'Con medio siglo de experiencia en productos de alambre, sistemas de vallas, postes de madera y espalderas...',
        ru: 'С полувековым опытом в производстве проволоки, заборов, столбов и шпалерных систем...'
      },
      companyTitle: 'METLİ / FMT',
      companySubtitle: 'Ticaret & FMT Makina',
      phones: [
        { label: 'Bilal METLİ', number: '0545 479 05 85', tel: '+905454790585', whatsapp: '0545 479 05 85', role: 'Satış & Pazarlama' },
        { label: 'Fatih METLİ', number: '0531 345 73 04', tel: '+905313457304', whatsapp: '0531 345 73 04', role: 'Mühendislik & Üretim' },
        { label: 'Abdullah METLİ', number: '0535 616 49 41', tel: '+905356164941', whatsapp: '0535 616 49 41', role: 'Kurucu' }
      ],
      emails: [
        'metliticaret@hotmail.com',
        'fatihmakinamuhendislik@hotmail.com'
      ],
      address: {
        tr: 'Adana Kozan Organize Sanayi Bölgesi (OSB), Adana / Türkiye',
        en: 'Adana Kozan Organized Industrial Zone (OSB), Adana / Turkey',
        es: 'Zona Industrial Organizada de Adana Kozan (OSB), Adana / Turquía',
        ru: 'Организованная промышленная зона Адана Козан (OSB), Адана / Турция'
      },
      quickLinks: [
        { to: '/', label: { tr: 'Ana Sayfa', en: 'Home', es: 'Inicio', ru: 'Главная' } },
        { to: '/about', label: { tr: 'Hakkımızda', en: 'About Us', es: 'Sobre Nosotros', ru: 'О нас' } },
        { to: '/products', label: { tr: 'Ürünlerimiz', en: 'Products', es: 'Productos', ru: 'Продукты' } },
        { to: '/telli-terbiye', label: { tr: 'Telli Terbiye Sistemi', en: 'Trellis System', es: 'Sistema de Espaldera', ru: 'Шпалерная система' } },
        { to: '/blog', label: { tr: 'Haberler & Projeler', en: 'News & Projects', es: 'Noticias y Proyectos', ru: 'Новости и Проекты' } },
        { to: '/contact', label: { tr: 'İletişim', en: 'Contact', es: 'Contacto', ru: 'Контакты' } }
      ],
      certificates: ['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6'],
      copyrightText: 'METLİ Ticaret & FMT Makina Mühendislik. Tüm Hakları Saklıdır.',
      legalCompany: 'FMT Makina Mühendislik İth. İhr. San. Tic. Ltd. Şti.'
    }
  };

  for (const [key, val] of Object.entries(defaultSections)) {
    const [rows] = await pool.execute('SELECT section_key FROM site_sections WHERE section_key = ?', [key]);
    if (rows.length === 0) {
      await pool.execute('INSERT INTO site_sections (section_key, data) VALUES (?, ?)', [key, JSON.stringify(val)]);
      console.log(`✅ Seeded default section: ${key}`);
    }
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

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, name FROM admin_users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
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

// ═══ SECTIONS ROUTES (SITE SETTINGS) ═══
app.get('/api/sections', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT section_key, data FROM site_sections');
    const result = {};
    for (const r of rows) {
      result[r.section_key] = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
    }
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sections/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT data FROM site_sections WHERE section_key = ?', [req.params.key]);
    if (rows.length === 0) return res.status(404).json({ error: 'Section not found' });
    const data = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/sections/:key', auth, async (req, res) => {
  try {
    const key = req.params.key;
    const data = req.body;
    const jsonData = JSON.stringify(data);
    await pool.execute(
      'INSERT INTO site_sections (section_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?',
      [key, jsonData, jsonData]
    );
    res.json({ success: true, key, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ PRODUCT ROUTES ═══
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY sort_order ASC, id ASC');
    res.json(rows.map(r => ({
      ...r,
      specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || []),
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const r = rows[0];
    res.json({
      ...r,
      specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || []),
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { title, description, category, icon, specs, is_featured, sort_order } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...images];
    const [result] = await pool.execute(
      'INSERT INTO products (title, description, category, icon, specs, images, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        description,
        category || 'wire',
        icon || '🔗',
        specs || '[]',
        JSON.stringify(allImages),
        is_featured !== undefined ? Number(is_featured) : 1,
        sort_order !== undefined ? Number(sort_order) : 0
      ]
    );
    res.json({ id: result.insertId, title, description, category, icon, specs: JSON.parse(specs || '[]'), images: allImages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { title, description, category, icon, specs, is_featured, sort_order } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    await pool.execute(
      'UPDATE products SET title=?, description=?, category=?, icon=?, specs=?, images=?, is_featured=?, sort_order=? WHERE id=?',
      [
        title,
        description,
        category,
        icon,
        specs || '[]',
        JSON.stringify(allImages),
        is_featured !== undefined ? Number(is_featured) : 1,
        sort_order !== undefined ? Number(sort_order) : 0,
        req.params.id
      ]
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
    res.json(rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    const r = rows[0];
    res.json({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/blog', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...images];
    const [result] = await pool.execute(
      'INSERT INTO blog_posts (title, content, excerpt, category, date, images) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt || (content || '').slice(0, 150), category || 'Haberler', date || new Date().toISOString().split('T')[0], JSON.stringify(allImages)]
    );
    res.json({ id: result.insertId, title, images: allImages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/blog/:id', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    await pool.execute(
      'UPDATE blog_posts SET title=?, content=?, excerpt=?, category=?, date=?, images=? WHERE id=?',
      [title, content, excerpt, category, date, JSON.stringify(allImages), req.params.id]
    );
    res.json({ success: true, images: allImages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/blog/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══ CONTACT MESSAGES ROUTES ═══
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Ad, e-posta ve mesaj alanları zorunludur' });
    }
    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), (phone || '').trim(), message.trim()]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/messages/:id/read', auth, async (req, res) => {
  try {
    const is_read = req.body.is_read !== undefined ? (req.body.is_read ? 1 : 0) : 1;
    await pool.execute('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══ FILE / VIDEO / IMAGE UPLOAD ═══
app.post('/api/upload', auth, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err.message || err);
      return res.status(400).json({ error: err.message || 'Dosya yükleme sırasında hata oluştu' });
    }
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: 'Yüklenecek dosya seçilmedi' });
    }
    const urls = files.map(f => `/uploads/${f.filename}`);
    res.json({ urls });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Sunucu hatası oluştu' });
});

// ═══ START ═══
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 METLİ/FMT Backend running on http://localhost:${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api`);
    console.log(`\n📋 Endpoints:`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/sections`);
    console.log(`   GET  /api/sections/:key`);
    console.log(`   PUT  /api/sections/:key (auth)`);
    console.log(`   GET  /api/products`);
    console.log(`   POST /api/products (auth + images)`);
    console.log(`   PUT  /api/products/:id (auth + images)`);
    console.log(`   DEL  /api/products/:id (auth)`);
    console.log(`   GET  /api/blog`);
    console.log(`   POST /api/blog (auth + images)`);
    console.log(`   PUT  /api/blog/:id (auth + images)`);
    console.log(`   DEL  /api/blog/:id (auth)`);
    console.log(`   POST /api/upload (auth + media files)`);
    console.log(`   GET  /api/admin/users (auth)`);
    console.log(`\n🔐 Default admin: admin / admin123`);
    console.log(`\n⚙️  MySQL config: ${DB_CONFIG.host}/${DB_CONFIG.database}`);
  });
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  console.error('   Make sure MySQL is running and credentials are correct.');
  console.error('   Set DB_HOST, DB_USER, DB_PASS, DB_NAME environment variables.');
  process.exit(1);
});

