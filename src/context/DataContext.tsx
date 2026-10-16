import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as api from '@/services/api';

export interface Multilang {
  tr: string;
  en: string;
  es: string;
  ru: string;
}

export interface Product {
  id: string;
  title: string | Multilang;
  titleKey?: string;
  description: string | Multilang;
  descKey?: string;
  category: string | Multilang;
  specs: string[] | { tr: string[], en: string[], es: string[], ru: string[] };
  specsKeys?: string[];
  icon: string;
  images?: string[];
  is_featured?: number;
  sort_order?: number;
}

export interface BlogPost {
  id: string;
  title: string | Multilang;
  titleKey?: string;
  content: string | Multilang;
  contentKey?: string;
  excerpt: string | Multilang;
  excerptKey?: string;
  date: string;
  category: string | Multilang;
  categoryKey?: string;
  images?: string[];
  sort_order?: number;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
}

export const defaultSectionsData: Record<string, any> = {
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
      { label: 'Bilal METLİ', number: '0545 479 05 85', tel: '+905454790585' },
      { label: 'Fatih METLİ', number: '0531 345 73 04', tel: '+905313457304' },
      { label: 'Abdullah METLİ', number: '0535 616 49 41', tel: '+905356164941' }
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

const defaultProducts: Product[] = [
  { id: '1', titleKey: 'p1.title', descKey: 'p1.desc', title: 'Dikenli Tel (Ters Büküm)', description: '', category: 'wire', specs: [], specsKeys: ['p1.s1','p1.s2','p1.s3','p1.s4'], icon: '🔗', images: ['/images/barbed-wire.jpg'], is_featured: 1 },
  { id: '2', titleKey: 'p2.title', descKey: 'p2.desc', title: 'Helezon (Fens) Çit Teli', description: '', category: 'fence', specs: [], specsKeys: ['p2.s1','p2.s2','p2.s3','p2.s4'], icon: '🏗️', images: ['/images/fence-wire.jpg'], is_featured: 1 },
  { id: '3', titleKey: 'p3.title', descKey: 'p3.desc', title: 'Emprenyeli Ahşap Direkler', description: '', category: 'wood', specs: [], specsKeys: ['p3.s1','p3.s2','p3.s3','p3.s4'], icon: '🪵', images: ['/images/wooden-posts.jpg'], is_featured: 1 },
  { id: '4', titleKey: 'p4.title', descKey: 'p4.desc', title: 'L Profil ve Kazık', description: '', category: 'fence', specs: [], specsKeys: ['p4.s1','p4.s2','p4.s3','p4.s4'], icon: '📐', images: ['/images/l-profile.jpg'], is_featured: 1 },
  { id: '5', titleKey: 'p5.title', descKey: 'p5.desc', title: 'Jiletli Tel', description: '', category: 'wire', specs: [], specsKeys: ['p5.s1','p5.s2','p5.s3','p5.s4'], icon: '⚔️', images: ['/images/razor-wire.jpg'], is_featured: 1 },
  { id: '6', titleKey: 'p6.title', descKey: 'p6.desc', title: 'Kafes Tel', description: '', category: 'wire', specs: [], specsKeys: ['p6.s1','p6.s2','p6.s3','p6.s4'], icon: '🔲', images: ['/images/fence-wire.jpg'], is_featured: 1 },
  { id: '7', titleKey: 'p7.title', descKey: 'p7.desc', title: 'Altıgen Örgü Çit Teli', description: '', category: 'fence', specs: [], specsKeys: ['p7.s1','p7.s2','p7.s3','p7.s4'], icon: '⬡', images: [] },
  { id: '8', titleKey: 'p8.title', descKey: 'p8.desc', title: 'Kümes Teli', description: '', category: 'fence', specs: [], specsKeys: ['p8.s1','p8.s2','p8.s3','p8.s4'], icon: '🐔', images: [] },
  { id: '9', titleKey: 'p9.title', descKey: 'p9.desc', title: 'Bağ Teli', description: '', category: 'agriculture', specs: [], specsKeys: ['p9.s1','p9.s2','p9.s3','p9.s4'], icon: '🍇', images: ['/images/trellis-system.jpg'] },
  { id: '10', titleKey: 'p10.title', descKey: 'p10.desc', title: 'Telli Terbiye File Sistemi', description: '', category: 'agriculture', specs: [], specsKeys: ['p10.s1','p10.s2','p10.s3','p10.s4'], icon: '🌳', images: ['/images/trellis-system.jpg'], is_featured: 1 },
  { id: '11', titleKey: 'p11.title', descKey: 'p11.desc', title: 'Galvanizli Boru Direk', description: '', category: 'fence', specs: [], specsKeys: ['p11.s1','p11.s2','p11.s3','p11.s4'], icon: '🔩', images: [] },
  { id: '12', titleKey: 'p12.title', descKey: 'p12.desc', title: 'Demir Direk', description: '', category: 'fence', specs: [], specsKeys: ['p12.s1','p12.s2','p12.s3','p12.s4'], icon: '🏛️', images: [] },
  { id: '13', titleKey: 'p13.title', descKey: 'p13.desc', title: 'Gölgeleme ve Dolu Filesi', description: '', category: 'accessories', specs: [], specsKeys: ['p13.s1','p13.s2','p13.s3','p13.s4'], icon: '☀️', images: ['/images/orchard-netting.jpg'], is_featured: 1 },
  { id: '14', titleKey: 'p14.title', descKey: 'p14.desc', title: 'Kova Tipi Ahşap Direk Şapkası', description: '', category: 'accessories', specs: [], specsKeys: ['p14.s1','p14.s2','p14.s3','p14.s4'], icon: '🎩', images: ['/images/wooden-posts.jpg'] },
  { id: '15', titleKey: 'p15.title', descKey: 'p15.desc', title: 'Tel Gerdirme Aparatı', description: '', category: 'accessories', specs: [], specsKeys: ['p15.s1','p15.s2','p15.s3','p15.s4'], icon: '🔧', images: ['/images/l-profile.jpg'] },
];

const defaultBlogPosts: BlogPost[] = [
  { id: '1', titleKey: 'blog1.title', contentKey: 'blog1.content', excerptKey: 'blog1.excerpt', categoryKey: 'blog1.cat', title: '', content: '', excerpt: '', date: '2024-12-15', category: '', images: ['/images/trellis-system.jpg'] },
  { id: '2', titleKey: 'blog2.title', contentKey: 'blog2.content', excerptKey: 'blog2.excerpt', categoryKey: 'blog2.cat', title: '', content: '', excerpt: '', date: '2024-11-20', category: '', images: ['/images/factory.jpg'] },
  { id: '3', titleKey: 'blog3.title', contentKey: 'blog3.content', excerptKey: 'blog3.excerpt', categoryKey: 'blog3.cat', title: '', content: '', excerpt: '', date: '2024-10-05', category: '', images: ['/images/hero-bg.jpg'] },
];

const defaultAdminUsers: AdminUser[] = [
  { id: '1', username: 'admin', name: 'Yönetici' },
];

interface DataContextType {
  products: Product[];
  blogPosts: BlogPost[];
  adminUsers: AdminUser[];
  sections: Record<string, any>;
  getSection: <T = any>(key: string, fallback?: T) => T;
  updateSectionData: (key: string, data: any) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  deleteAdminUser: (id: string) => void;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  currentUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DATA_VERSION = '4';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const storedVersion = localStorage.getItem('metli-data-version');
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem('metli-products');
      localStorage.removeItem('metli-blog');
      localStorage.removeItem('metli-sections');
      localStorage.setItem('metli-data-version', DATA_VERSION);
      return fallback;
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('metli-products', defaultProducts));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('metli-blog', defaultBlogPosts));
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => loadFromStorage('metli-admins', defaultAdminUsers));
  const [sections, setSections] = useState<Record<string, any>>(() => loadFromStorage('metli-sections', defaultSectionsData));

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!sessionStorage.getItem('metli-token'));
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => !!sessionStorage.getItem('metli-token'));
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('metli-user');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshAllData = async () => {
    try {
      const [apiProducts, apiBlogs, apiSections] = await Promise.all([
        api.getProducts().catch(() => null),
        api.getBlogPosts().catch(() => null),
        api.getSections().catch(() => null),
      ]);
      if (apiProducts && Array.isArray(apiProducts)) {
        const mapped = apiProducts.map(p => ({ ...p, id: String(p.id) }));
        setProducts(mapped);
        localStorage.setItem('metli-products', JSON.stringify(mapped));
      }
      if (apiBlogs && Array.isArray(apiBlogs)) {
        const mapped = apiBlogs.map(b => ({ ...b, id: String(b.id) }));
        setBlogPosts(mapped);
        localStorage.setItem('metli-blog', JSON.stringify(mapped));
      }
      if (apiSections && typeof apiSections === 'object') {
        setSections(prev => {
          const merged = { ...defaultSectionsData, ...prev, ...apiSections };
          localStorage.setItem('metli-sections', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.log('Using cached / local data');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('metli-token');
    if (token) {
      api.verifyToken()
        .then((user) => {
          if (user) {
            setIsLoggedIn(true);
            setCurrentUser(user as any);
          } else {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsAuthLoading(false);
    }
    refreshAllData();
  }, []);

  const getSection = <T = any>(key: string, fallback?: T): T => {
    if (sections[key] !== undefined) return sections[key] as T;
    if (defaultSectionsData[key] !== undefined) return defaultSectionsData[key] as T;
    return (fallback !== undefined ? fallback : {}) as T;
  };

  const updateSectionData = async (key: string, data: any) => {
    const updated = { ...sections, [key]: data };
    setSections(updated);
    localStorage.setItem('metli-sections', JSON.stringify(updated));
    try {
      await api.updateSection(key, data);
    } catch (e) {
      console.error('Failed to sync section to backend:', e);
    }
  };

  const saveProducts = (p: Product[]) => { setProducts(p); localStorage.setItem('metli-products', JSON.stringify(p)); };
  const saveBlog = (b: BlogPost[]) => { setBlogPosts(b); localStorage.setItem('metli-blog', JSON.stringify(b)); };
  const saveAdmins = (a: AdminUser[]) => { setAdminUsers(a); localStorage.setItem('metli-admins', JSON.stringify(a)); };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    saveProducts([...products, newProduct]);
  };
  const updateProduct = (product: Product) => {
    saveProducts(products.map(p => p.id === product.id ? product : p));
  };
  const deleteProduct = (id: string) => saveProducts(products.filter(p => p.id !== id));

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: Date.now().toString() };
    saveBlog([newPost, ...blogPosts]);
  };
  const updateBlogPost = (post: BlogPost) => {
    saveBlog(blogPosts.map(p => p.id === post.id ? post : p));
  };
  const deleteBlogPost = (id: string) => saveBlog(blogPosts.filter(p => p.id !== id));

  const addAdminUser = (user: Omit<AdminUser, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    saveAdmins([...adminUsers, newUser]);
  };
  const deleteAdminUser = (id: string) => saveAdmins(adminUsers.filter(u => u.id !== id));

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login(username, password);
      if (res && res.token) {
        setIsLoggedIn(true);
        setCurrentUser(res.user as any);
        return true;
      }
      setIsLoggedIn(false);
      setCurrentUser(null);
      return false;
    } catch (e) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      throw e;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    api.logout();
  };

  return (
    <DataContext.Provider value={{
      products, blogPosts, adminUsers, sections,
      getSection, updateSectionData, refreshAllData,
      addProduct, updateProduct, deleteProduct,
      addBlogPost, updateBlogPost, deleteBlogPost,
      addAdminUser, deleteAdminUser,
      isLoggedIn, isAuthLoading, currentUser, login, logout,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
