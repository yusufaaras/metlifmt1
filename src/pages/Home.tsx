import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedProducts, resolveLocalizedText } from '@/hooks/useTranslatedData';
import { useData } from '@/context/DataContext';
import { getImageUrl } from '@/services/api';
import { useState } from 'react';

const FADE = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 20 } },
};

const fallbackProductImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg', '2': '/images/fence-wire.jpg', '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg', '5': '/images/razor-wire.jpg', '6': '/images/fence-wire.jpg',
  '9': '/images/trellis-system.jpg', '10': '/images/trellis-system.jpg', '13': '/images/orchard-netting.jpg',
  '14': '/images/wooden-posts.jpg', '15': '/images/l-profile.jpg',
};

export default function Home() {
  const { language, t } = useLanguage();
  const { getSection } = useData();
  const products = useTranslatedProducts();

  // Dynamic Home Sections
  const heroSection = getSection('home_hero', {
    experienceBadge: '50+ Yıllık Tecrübe',
    title: { tr: 'Yarım Asırlık Tecrübe ile Güvenilir Üretim' },
    subtitle: { tr: 'Tel, çit, ahşap direk ve modern telli terbiye sistemlerinde 50 yılı aşkın tecrübemizle sanayi ve tarım sektörüne değer katıyoruz.' },
    slogan: { tr: 'Güçlü Altyapı, Kaliteli Üretim, Güvenli Gelecek' },
    ctaPrimaryText: { tr: 'Ürünlerimizi İnceleyin' },
    ctaPrimaryLink: '/products',
    ctaSecondaryText: { tr: 'İletişime Geçin' },
    ctaSecondaryLink: '/contact',
    videos: ['/images/hero1.mp4', '/images/hero2.mp4']
  });

  const heroVideos = (heroSection.videos && heroSection.videos.length > 0)
    ? heroSection.videos.map((v: string) => getImageUrl(v))
    : ['/images/hero1.mp4', '/images/hero2.mp4'];

  const [videoIndex, setVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setVideoIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const rawStats = getSection('home_stats', [
    { num: '50+', label: { tr: 'Yıllık Tecrübe' } },
    { num: '5000+', label: { tr: 'Mutlu Müşteri' } },
    { num: '15+', label: { tr: 'Ürün Çeşidi' } },
    { num: '1000+', label: { tr: 'Tamamlanan Proje' } },
  ]);

  const stats = Array.isArray(rawStats) ? rawStats.map((s: any) => ({
    num: s.num,
    label: resolveLocalizedText(s.label, language) || t('home.experience')
  })) : [];
  const statsDup = [...stats, ...stats, ...stats];

  // Dynamic Gallery (Üretim ve Projelerimizden Kareler)
  const rawGallery = getSection('home_gallery', [
    { src: '/images/barbed-wire.jpg', alt: 'Tel Ürünleri' },
    { src: '/images/fence-wire.jpg', alt: 'Çit Sistemleri' },
    { src: '/images/wooden-posts.jpg', alt: 'Emprenyeli Ahşap Direkler' },
    { src: '/images/trellis-system.jpg', alt: 'Telli Terbiye Sistemleri' },
    { src: '/images/factory.jpg', alt: 'Kozan OSB Fabrikamız' },
    { src: '/images/razor-wire.jpg', alt: 'Jiletli Tel Üretimi' },
    { src: '/images/l-profile.jpg', alt: 'L Profil ve Kazık' },
    { src: '/images/orchard-netting.jpg', alt: 'Dolu & Gölgeleme Filesi' },
  ]);

  const gallery = Array.isArray(rawGallery) ? rawGallery.map((g: any) => ({
    src: getImageUrl(g.src),
    alt: resolveLocalizedText(g.alt, language)
  })) : [];

  // Dynamic Why Us
  const rawWhyUs = getSection('home_why_us', [
    { icon: '🏆', title: { tr: 'Yüksek Kalite' }, desc: { tr: 'TSE EN ve ISO standartlarında üretim.' }, img: '/images/factory.jpg' },
    { icon: '🤝', title: { tr: 'Güven ve İstikrar' }, desc: { tr: '50 yılı aşkın süredir dürüst ticaret.' }, img: '/images/trellis-system.jpg' },
    { icon: '💡', title: { tr: 'Yenilikçi Çözümler' }, desc: { tr: 'Modern tarım ve çit teknolojileri.' }, img: '/images/orchard-netting.jpg' },
  ]);

  const whyUsList = Array.isArray(rawWhyUs) ? rawWhyUs.map((item: any) => ({
    icon: item.icon || '🏆',
    title: resolveLocalizedText(item.title, language),
    desc: resolveLocalizedText(item.desc, language),
    img: getImageUrl(item.img)
  })) : [];

  // Dynamic CTA
  const homeCta = getSection('home_cta', {
    title: { tr: 'Projeniz İçin En Doğru Çözümü Birlikte Belirleyelim' },
    desc: { tr: 'Uzman ekibimiz ihtiyacınıza en uygun tel, çit ve telli terbiye sistemlerini belirlemek için hazır.' },
    buttonText: { tr: 'İletişime Geçin' },
    phone: '0545 479 05 85'
  });

  // Featured Products (is_featured !== 0 or first 6)
  const featured = products
    .filter(p => (p as any).is_featured === undefined || (p as any).is_featured !== 0)
    .slice(0, 6);

  const heroTitle = resolveLocalizedText(heroSection.title, language) || t('hero.title');
  const heroSubtitle = resolveLocalizedText(heroSection.subtitle, language) || t('hero.subtitle');
  const heroSlogan = resolveLocalizedText(heroSection.slogan, language) || t('hero.slogan');
  const heroCtaPrimary = resolveLocalizedText(heroSection.ctaPrimaryText, language) || t('hero.cta');
  const heroCtaSecondary = resolveLocalizedText(heroSection.ctaSecondaryText, language) || t('home.ctaButton');
  const heroBadge = resolveLocalizedText(heroSection.experienceBadge, language) || '50+ ' + t('home.experience');

  return (
    <div>
      {/* ═══════ HERO — VIDEO BACKGROUND ═══════ */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Video BG - Sıralı Oynatma */}
        {heroVideos.length > 0 && (
          <video
            key={heroVideos[videoIndex % heroVideos.length]}
            autoPlay 
            muted 
            playsInline
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideos[videoIndex % heroVideos.length]} type="video/mp4" />
          </video>
        )}
        
        <div className="absolute inset-0 bg-black/60 backdrop-brightness-90" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial="hidden" animate="show" variants={FADE} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-pulse" />
            {heroBadge}
          </motion.div>

          <motion.h1
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight"
          >
            {heroTitle.split(' ').map((w: string, i: number) => (
              <motion.span key={i} variants={FADE} className="inline-block mr-[0.25em]">{w}</motion.span>
            ))}
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }} className="my-5 h-1 w-20 bg-gradient-to-r from-primary-light to-accent-light rounded-full mx-auto" />

          <motion.p initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.45 }} className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </motion.p>

          {heroSlogan && (
            <motion.p initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.55 }} className="mt-3 text-xs text-white/50 italic max-w-xl mx-auto">
              {heroSlogan}
            </motion.p>
          )}

          <motion.div initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.65 }} className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to={heroSection.ctaPrimaryLink || '/products'} className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-lg hover:bg-primary-dark hover:scale-105 transition-all active:scale-95">
              {heroCtaPrimary}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <Link to={heroSection.ctaSecondaryLink || '/contact'} className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-white/60 text-white text-sm font-semibold hover:bg-white/10 transition-all">
              {heroCtaSecondary}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS MARQUEE ═══════ */}
      {stats.length > 0 && (
        <div className="bg-secondary-dark text-white overflow-hidden">
          <motion.div
            className="flex items-center py-4 whitespace-nowrap"
            animate={{ x: ['0%', '-33.33%'] }}
            transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
          >
            {statsDup.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-8 md:px-12 flex-shrink-0">
                <span className="text-2xl md:text-3xl font-bold text-primary-light">{s.num}</span>
                <span className="text-xs md:text-sm text-white/70">{s.label}</span>
                <span className="text-white/20 mx-4">|</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">{t('home.featured')}</h2>
            <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => {
              const imgSrc = (p.images && p.images.length > 0) ? getImageUrl(p.images[0]) : (fallbackProductImages[p.id] || '');
              return (
                <motion.div key={p.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {imgSrc ? (
                      <img src={imgSrc} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-5xl">{p.icon}</span></div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-secondary-dark mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                    <Link to={`/product/${p.id}`} className="text-primary text-xs font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                      {t('products.details')} →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition-all shadow hover:shadow-lg">
              {t('common.viewAll')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY / ÜRETİM VE PROJELERİMİZDEN KARELER ═══════ */}
      {gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">
                {t('home.galleryTitle') || 'Üretim ve Projelerimizden Kareler'}
              </h2>
              <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <motion.div key={i} className={`relative overflow-hidden rounded-xl shadow group ${i === 0 || i === Math.min(7, gallery.length - 1) ? 'md:col-span-2 md:row-span-2' : ''}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <img src={img.src} alt={img.alt} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 || i === Math.min(7, gallery.length - 1) ? 'h-48 md:h-full' : 'h-36 md:h-44'}`} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-medium">{img.alt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ WHY US ═══════ */}
      {whyUsList.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">{t('home.whyUs')}</h2>
              <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyUsList.map((item, i) => (
                <motion.div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto -mt-12 mb-3 rounded-xl bg-white shadow-lg border border-gray-100 flex items-center justify-center relative z-10">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-secondary-dark mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 to-secondary-dark/90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">{resolveLocalizedText(homeCta.title, language) || t('home.ctaTitle')}</h2>
            <p className="text-sm text-white/80 mb-6 max-w-xl mx-auto">{resolveLocalizedText(homeCta.desc, language) || t('home.ctaDesc')}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="px-7 py-2.5 bg-white text-primary rounded-full text-sm font-bold hover:bg-gray-100 transition-all shadow">
                {resolveLocalizedText(homeCta.buttonText, language) || t('home.ctaButton')}
              </Link>
              <a href={`tel:${(homeCta.phone || '0545 479 05 85').replace(/\s+/g, '')}`} className="px-7 py-2.5 border-2 border-white text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                {homeCta.phone || '0545 479 05 85'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}