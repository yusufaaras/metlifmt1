import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

let pool;

export async function initDB() {
  const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'metli_db',
    charset: 'utf8mb4',
  };

  console.log(`Connecting to database: ${DB_CONFIG.database} on ${DB_CONFIG.host} as ${DB_CONFIG.user}`);

  const tempConn = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
  });
  await tempConn.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await tempConn.end();

  pool = mysql.createPool(DB_CONFIG);

  // Auto-create tables
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

  // Seed default admin
  const [admins] = await pool.execute('SELECT COUNT(*) as cnt FROM admin_users WHERE username = "admin"');
  if (admins[0].cnt === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.execute('INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)', ['admin', hash, 'Yönetici']);
    console.log('✅ Default admin created: admin / admin123');
  } else {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.execute('UPDATE admin_users SET password = ? WHERE username = "admin"', [hash]);
    console.log('✅ Admin password verified/reset to: admin123');
  }

  // Seed default products
  const [products] = await pool.execute('SELECT COUNT(*) as cnt FROM products');
  if (products[0].cnt === 0) {
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
    console.log('✅ Default products seeded');
  }

  // Seed default blogs
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
    console.log('✅ Default blog posts seeded');
  }

  return pool;
}

export { pool };
