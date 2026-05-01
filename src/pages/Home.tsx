import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import metlilogo from '../../public/images/metlilogo.png'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
} as const;
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
} as const;

const productImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg',
  '2': '/images/fence-wire.jpg',
  '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg',
  '5': '/images/razor-wire.jpg',
  '6': '/images/fence-wire.jpg',
  '10': '/images/trellis-system.jpg',
  '13': '/images/orchard-netting.jpg',
};

function Counter({ end, label }: { end: number; label: string }) {
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-1">{end}+</div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const { products } = useData();
  const featuredProducts = products.slice(0, 6);

  const galleryImages = [
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
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex flex-col md:flex-row overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Content */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:w-3/5 lg:p-16 pt-24 md:pt-12">
          <div>
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="w-28 flex items-center justify-center">
                  <img
                    src={metlilogo}
                    alt="Metli Logo"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-secondary">METLİ / FMT</p>
                  <p className="text-xs tracking-wider text-gray-500">Ticaret & Makina Mühendislik</p>
                </div>
              </div>
            </motion.div>

            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-secondary-dark font-heading" variants={itemVariants}>
              {t('hero.title')}
            </motion.h1>
            <motion.div className="my-6 h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full" variants={itemVariants} />
            <motion.p className="mb-6 max-w-lg text-base md:text-lg text-gray-600 leading-relaxed" variants={itemVariants}>
              {t('hero.subtitle')}
            </motion.p>
            <motion.p className="mb-8 max-w-lg text-sm text-gray-500 italic border-l-4 border-primary pl-4" variants={itemVariants}>
              {t('hero.slogan')}
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl">
                {t('hero.cta')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-secondary text-secondary rounded-full font-semibold hover:bg-secondary hover:text-white transition-all">
                {t('home.ctaButton')}
              </Link>
            </motion.div>
          </div>

          <motion.div className="mt-12 grid grid-cols-3 gap-4 text-xs text-gray-500" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <span>0545 479 05 85</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <span className="truncate">metliticaret@hotmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Kozan OSB, Adana</span>
            </div>
          </motion.div>
        </div>

        {/* Right Image Area */}
        <motion.div
          className="w-full min-h-[400px] md:w-1/2 md:min-h-full lg:w-2/5 relative"
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
          transition={{ duration: 1.2, ease: 'circOut' }}
        >
          <img src="/images/hero-bg.jpg" alt="METLİ Üretim" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl font-bold">FMT</span>
              </div>
              <div>
                <p className="font-semibold text-lg">FMT Makina Mühendislik</p>
                <p className="text-sm text-white/70">İth. İhr. San. Tic. Ltd. Şti.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6'].map((cert) => (
                <span key={cert} className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs border border-white/20">{cert}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={50} label={t('home.experience')} />
            <Counter end={5000} label={t('home.customers')} />
            <Counter end={15} label={t('home.productCount')} />
            <Counter end={1000} label={t('home.projects')} />
          </div>
        </div>
      </section>

      {/* Featured Products with IMAGES */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark font-heading">{t('home.featured')}</h2>
            <div className="mt-4 h-1 w-16 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="card-hover bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-52 relative overflow-hidden">
                  {productImages[product.id] ? (
                    <img src={productImages[product.id]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{product.icon}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-primary text-xs rounded-full font-medium shadow-sm">{product.category}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-secondary-dark mb-2">{product.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <Link to="/products" className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-semibold hover:gap-2 transition-all">
                    {t('products.details')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl">
              {t('common.viewAll')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark font-heading">{t('home.galleryTitle')}</h2>
            <div className="mt-4 h-1 w-16 bg-primary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                className={`relative overflow-hidden rounded-2xl shadow-md group ${i === 0 || i === 7 ? 'md:col-span-2 md:row-span-2' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <img src={img.src} alt={img.alt} className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${i === 0 || i === 7 ? 'h-64 md:h-full' : 'h-48 md:h-56'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-medium">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark font-heading">{t('home.whyUs')}</h2>
            <div className="mt-4 h-1 w-16 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: t('home.quality'), desc: t('home.qualityDesc'), img: '/images/factory.jpg' },
              { icon: '🤝', title: t('home.trust'), desc: t('home.trustDesc'), img: '/images/trellis-system.jpg' },
              { icon: '💡', title: t('home.innovation'), desc: t('home.innovationDesc'), img: '/images/orchard-netting.jpg' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card-hover bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto -mt-12 mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-100">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-dark mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with background image */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">{t('home.ctaTitle')}</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">{t('home.ctaDesc')}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">
                {t('home.ctaButton')}
              </Link>
              <a href="tel:+905454790585" className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all">
                0545 479 05 85
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
