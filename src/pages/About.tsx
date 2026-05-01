import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const timelineData = [
    { year: '1992', title: t('about.timeline1Title'), desc: t('about.timeline1Desc') },
    { year: '2000', title: t('about.timeline2Title'), desc: t('about.timeline2Desc') },
    { year: '2012', title: t('about.timeline3Title'), desc: t('about.timeline3Desc') },
    { year: '2017', title: t('about.timeline4Title'), desc: t('about.timeline4Desc') },
    { year: '2024', title: t('about.timeline5Title'), desc: t('about.timeline5Desc') },
  ];

  const aboutTexts = [
    t('about.text1'), t('about.text2'), t('about.text3'),
    t('about.text4'), t('about.text5'), t('about.text6'),
  ];

  const services = [
    t('about.service1'), t('about.service2'), t('about.service3'),
    t('about.service4'), t('about.service5'), t('about.service6'),
  ];

  return (
    <div className="pt-20">
      {/* Hero Banner with Image */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src="/images/factory.jpg" alt={t('about.factoryTitle')} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">{t('about.title')}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">{t('about.subtitle')}</p>
            <div className="mt-6 h-1 w-20 bg-white/50 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* About Content with Images */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              {aboutTexts.map((text, i) => (
                <motion.p key={i} className="text-gray-600 leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              {/* Factory Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/images/factory.jpg" alt={t('about.factoryTitle')} className="w-full h-64 object-cover" />
                <div className="bg-primary/5 p-4 border border-primary/10">
                  <h4 className="font-bold text-secondary-dark">{t('about.factoryTitle')}</h4>
                  <p className="text-sm text-gray-500 mt-1">{t('about.factoryDesc')}</p>
                </div>
              </div>

              {/* Company Values Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-dark">{t('about.visionTitle')}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-primary pl-4">
                  "{t('about.visionQuote')}"
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mt-4">{t('about.visionDesc')}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '1992', label: t('about.foundYear') },
                  { num: '50+', label: t('about.yearsExp') },
                  { num: '15+', label: t('about.prodVariety') },
                  { num: '3', label: t('about.qualityCerts') },
                ].map((stat, i) => (
                  <motion.div key={i} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="text-2xl font-bold gradient-text">{stat.num}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Images Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/barbed-wire.jpg', label: t('products.wire') },
              { src: '/images/fence-wire.jpg', label: t('products.fence') },
              { src: '/images/wooden-posts.jpg', label: t('products.wood') },
              { src: '/images/trellis-system.jpg', label: t('products.agriculture') },
            ].map((item, i) => (
              <motion.div key={i} className="rounded-xl overflow-hidden shadow-md group relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <img src={item.src} alt={item.label} className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-dark font-heading mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {t('about.history')}
          </motion.h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:transform md:-translate-x-0.5" />
            {timelineData.map((item, i) => (
              <motion.div key={i} className={`relative flex items-start mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow transform -translate-x-2 md:-translate-x-2 z-10" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-2">{item.year}</span>
                    <h3 className="text-lg font-bold text-secondary-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Certificates */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-secondary-dark font-heading mb-8">{t('about.services')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, i) => (
                  <motion.div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span className="text-sm font-medium text-gray-700">{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-secondary-dark font-heading mb-8">{t('about.certs')}</h2>
              <div className="space-y-4">
                {[
                  { name: 'ISO 9001:2015', desc: t('about.certQuality') },
                  { name: 'TSE EN 10223-1', desc: t('about.certBarbed') },
                  { name: 'TSE EN 10223-6', desc: t('about.certFence') },
                ].map((cert, i) => (
                  <motion.div key={i} className="flex items-center gap-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border border-primary/10" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-dark">{cert.name}</h4>
                      <p className="text-sm text-gray-500">{cert.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-16 relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.p className="text-xl md:text-2xl font-heading italic leading-relaxed" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            "{t('about.finalQuote')}"
          </motion.p>
          <p className="mt-6 text-white/70 text-sm">— FMT Makina Mühendislik</p>
        </div>
      </section>
    </div>
  );
}
