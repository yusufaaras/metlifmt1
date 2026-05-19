import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const timeline = [
    { year: '1992', title: t('about.timeline1Title'), desc: t('about.timeline1Desc') },
    { year: '2000', title: t('about.timeline2Title'), desc: t('about.timeline2Desc') },
    { year: '2012', title: t('about.timeline3Title'), desc: t('about.timeline3Desc') },
    { year: '2017', title: t('about.timeline4Title'), desc: t('about.timeline4Desc') },
    { year: '2024', title: t('about.timeline5Title'), desc: t('about.timeline5Desc') },
  ];
  const texts = [t('about.text1'), t('about.text2'), t('about.text3'), t('about.text4'), t('about.text5'), t('about.text6')];


  return (
    <div>
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img src="/images/factory.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/85 to-secondary-dark/85" />
        <div className="relative z-10 text-center text-white px-4 pt-16">
          <motion.h1 className="text-3xl md:text-5xl font-bold font-heading mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{t('about.title')}</motion.h1>
          <motion.div className="h-1 w-16 bg-white/50 rounded-full mx-auto mb-3" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }} />
          <motion.p className="text-sm md:text-base text-white/80 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{t('about.subtitle')}</motion.p>
        </div>
      </section>

      {/* ABOUT TEXT + SIDEBAR */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left text — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            {texts.map((txt, i) => (
              <motion.p key={i} className="text-sm text-gray-600 leading-relaxed" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                {txt}
              </motion.p>
            ))}
          </div>
          {/* Right sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img src="/images/factory.jpg" alt="" className="w-full h-48 object-cover" />
              <div className="bg-primary/5 p-4 border border-primary/10">
                <h4 className="font-bold text-sm text-secondary-dark">{t('about.factoryTitle')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('about.factoryDesc')}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="text-sm font-bold text-secondary-dark mb-2">{t('about.visionTitle')}</h3>
              <p className="text-xs text-gray-600 italic border-l-2 border-primary pl-3 leading-relaxed">"{t('about.visionQuote')}"</p>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">{t('about.visionDesc')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: '1992', l: t('about.foundYear') }, { n: '50+', l: t('about.yearsExp') },
                { n: '15+', l: t('about.prodVariety') }, { n: '3', l: t('about.qualityCerts') },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow border border-gray-100 text-center">
                  <div className="text-xl font-bold gradient-text">{s.n}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT STRIP */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: '/images/barbed-wire.jpg', l: t('products.wire') },
            { src: '/images/fence-wire.jpg', l: t('products.fence') },
            { src: '/images/wooden-posts.jpg', l: t('products.wood') },
            { src: '/images/trellis-system.jpg', l: t('products.agriculture') },
          ].map((it, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow group relative">
              <img src={it.src} alt={it.l} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-medium">{it.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-secondary-dark font-heading mb-10">{t('about.history')}</h2>
          <div className="relative">
            <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:-translate-x-px" />
            {timeline.map((it, i) => (
              <motion.div key={i} className={`relative flex items-start mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="absolute left-3 md:left-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow -translate-x-1.5 md:-translate-x-1.5 z-10" />
                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                  <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full mb-1">{it.year}</span>
                    <h3 className="text-sm font-bold text-secondary-dark mb-1">{it.title}</h3>
                    <p className="text-xs text-gray-500">{it.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-secondary-dark font-heading mb-6 text-center">{t('about.certs')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { name: 'ISO 9001:2015', desc: t('about.certQuality') },
              { name: 'TSE EN 10223-1', desc: t('about.certBarbed') },
              { name: 'TSE EN 10223-6', desc: t('about.certFence') },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-primary/10 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div><h4 className="font-bold text-sm text-secondary-dark">{c.name}</h4><p className="text-[10px] text-gray-500">{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-12 relative overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 to-secondary-dark/90" />
        <div className="relative max-w-2xl mx-auto px-4 text-center text-white">
          <p className="text-base md:text-lg font-heading italic leading-relaxed">"{t('about.finalQuote')}"</p>
          <p className="mt-3 text-white/50 text-xs">— FMT Makina Mühendislik</p>
        </div>
      </section>

      {/* Service marquee is now global in App.tsx, above footer */}
    </div>
  );
}
