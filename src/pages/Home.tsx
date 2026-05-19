import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedProducts } from '@/hooks/useTranslatedData';
import { useState } from 'react';

const FADE = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 20 } },
};

const productImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg', '2': '/images/fence-wire.jpg', '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg', '5': '/images/razor-wire.jpg', '6': '/images/fence-wire.jpg',
  '10': '/images/trellis-system.jpg', '13': '/images/orchard-netting.jpg',
};

export default function Home() {
  const { t } = useLanguage();
  const products = useTranslatedProducts();
  const featured = products.slice(0, 6);

  // Video Playlist Mantığı
  const heroVideos = ['/images/hero1.mp4', '/images/hero2.mp4'];
  const [videoIndex, setVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setVideoIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const stats = [
    { num: '50+', label: t('home.experience') },
    { num: '5000+', label: t('home.customers') },
    { num: '15+', label: t('home.productCount') },
    { num: '1000+', label: t('home.projects') },
  ];
  const statsDup = [...stats, ...stats, ...stats];

  const gallery = [
    { src: '/images/barbed-wire.jpg', alt: t('products.wire') },
    { src: '/images/fence-wire.jpg', alt: t('products.fence') },
    { src: '/images/wooden-posts.jpg', alt: t('products.wood') },
    { src: '/images/trellis-system.jpg', alt: t('nav.telli') },
    { src: '/images/factory.jpg', alt: t('about.factoryTitle') },
    { src: '/images/razor-wire.jpg', alt: t('products.wire') },
    { src: '/images/l-profile.jpg', alt: t('products.fence') },
    { src: '/images/orchard-netting.jpg', alt: t('telli.comp3') },
  ];

  return (
    <div>
      {/* ═══════ HERO — VIDEO BACKGROUND ═══════ */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Video BG - Sıralı Oynatma */}
        <video
          key={heroVideos[videoIndex]}
          autoPlay 
          muted 
          playsInline
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideos[videoIndex]} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial="hidden" animate="show" variants={FADE} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-pulse" />
            50+ {t('home.experience')}
          </motion.div>

          <motion.h1
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight"
          >
            {t('hero.title').split(' ').map((w, i) => (
              <motion.span key={i} variants={FADE} className="inline-block mr-[0.25em]">{w}</motion.span>
            ))}
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }} className="my-5 h-1 w-20 bg-gradient-to-r from-primary-light to-accent-light rounded-full mx-auto" />

          <motion.p initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.45 }} className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </motion.p>

          <motion.p initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.55 }} className="mt-3 text-xs text-white/50 italic max-w-xl mx-auto">
            {t('hero.slogan')}
          </motion.p>

          <motion.div initial="hidden" animate="show" variants={FADE} transition={{ delay: 0.65 }} className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-lg hover:bg-primary-dark hover:scale-105 transition-all active:scale-95">
              {t('hero.cta')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-white/60 text-white text-sm font-semibold hover:bg-white/10 transition-all">
              {t('home.ctaButton')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS MARQUEE ═══════ */}
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

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">{t('home.featured')}</h2>
            <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <motion.div key={p.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="h-48 relative overflow-hidden">
                  {productImages[p.id] ? (
                    <img src={productImages[p.id]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-5xl">{p.icon}</span></div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-secondary-dark mb-1">{p.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                  <Link to="/products" className="text-primary text-xs font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                    {t('products.details')} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition-all shadow hover:shadow-lg">
              {t('common.viewAll')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY ═══════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">{t('home.galleryTitle')}</h2>
            <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <motion.div key={i} className={`relative overflow-hidden rounded-xl shadow group ${i === 0 || i === 7 ? 'md:col-span-2 md:row-span-2' : ''}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <img src={img.src} alt={img.alt} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 || i === 7 ? 'h-48 md:h-full' : 'h-36 md:h-44'}`} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY US ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-dark font-heading">{t('home.whyUs')}</h2>
            <div className="mt-3 h-1 w-14 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: t('home.quality'), desc: t('home.qualityDesc'), img: '/images/factory.jpg' },
              { icon: '🤝', title: t('home.trust'), desc: t('home.trustDesc'), img: '/images/trellis-system.jpg' },
              { icon: '💡', title: t('home.innovation'), desc: t('home.innovationDesc'), img: '/images/orchard-netting.jpg' },
            ].map((item, i) => (
              <motion.div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="h-44 overflow-hidden">
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

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 to-secondary-dark/90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">{t('home.ctaTitle')}</h2>
            <p className="text-sm text-white/80 mb-6 max-w-xl mx-auto">{t('home.ctaDesc')}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="px-7 py-2.5 bg-white text-primary rounded-full text-sm font-bold hover:bg-gray-100 transition-all shadow">{t('home.ctaButton')}</Link>
              <a href="tel:+905454790585" className="px-7 py-2.5 border-2 border-white text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">0545 479 05 85</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}