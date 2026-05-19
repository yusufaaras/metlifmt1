import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function TelliTerbiye() {
  const { t } = useLanguage();

  const benefits = [
    { icon: '🌱', text: t('telli.benefit1') }, { icon: '🛡️', text: t('telli.benefit2') },
    { icon: '✂️', text: t('telli.benefit3') }, { icon: '📊', text: t('telli.benefit4') },
    { icon: '🍎', text: t('telli.benefit5') },
  ];
  const apps = [
    { icon: '🍏', text: t('telli.app1') }, { icon: '🍐', text: t('telli.app2') },
    { icon: '🍒', text: t('telli.app3') }, { icon: '🍑', text: t('telli.app4') },
    { icon: '🍇', text: t('telli.app5') }, { icon: '📅', text: t('telli.app6') },
  ];
  const comps = [
    { title: t('telli.comp1'), desc: t('telli.comp1Desc'), img: '/images/wooden-posts.jpg' },
    { title: t('telli.comp2'), desc: t('telli.comp2Desc'), img: '/images/barbed-wire.jpg' },
    { title: t('telli.comp3'), desc: t('telli.comp3Desc'), img: '/images/orchard-netting.jpg' },
    { title: t('telli.comp4'), desc: t('telli.comp4Desc'), img: '/images/l-profile.jpg' },
  ];
  const accs = Array.from({ length: 10 }, (_, i) => t(`telli.acc${i + 1}`));

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center overflow-hidden">
        <img src="/images/trellis-system.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white mb-5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {t('nav.telli')}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight mb-4">
              {t('telli.title')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm md:text-base text-white/80 leading-relaxed mb-6 max-w-md">
              {t('telli.subtitle')}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
              <Link to="/contact" className="px-6 py-2.5 bg-white text-secondary-dark rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                {t('telli.ctaButton')}
              </Link>
              <a href="tel:+905454790585" className="px-6 py-2.5 border-2 border-white/60 text-white rounded-full text-sm font-semibold hover:bg-white/10 transition-all">
                0545 479 05 85
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DESCRIPTION — Text + Image ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading mb-4">{t('telli.title')}</h2>
              <div className="h-1 w-12 bg-secondary rounded-full mb-5" />
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{t('telli.desc')}</p>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: '6+', l: t('telli.applications') },
                  { n: '10+', l: t('telli.accessories') },
                  { n: '4', l: t('telli.components') },
                ].map((s, i) => (
                  <div key={i} className="bg-secondary/5 rounded-lg p-3 text-center border border-secondary/10">
                    <div className="text-lg font-bold text-secondary">{s.n}</div>
                    <div className="text-[10px] text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3">
              <img src="/images/trellis-system.jpg" alt="" className="rounded-xl shadow-md w-full h-40 md:h-48 object-cover" />
              <img src="/images/orchard-netting.jpg" alt="" className="rounded-xl shadow-md w-full h-40 md:h-48 object-cover mt-6" />
              <img src="/images/wooden-posts.jpg" alt="" className="rounded-xl shadow-md w-full h-40 md:h-48 object-cover" />
              <img src="/images/hero-bg.jpg" alt="" className="rounded-xl shadow-md w-full h-40 md:h-48 object-cover mt-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.benefits')}</h2>
            <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={i} className="bg-white rounded-xl p-5 shadow border border-gray-100 text-center hover:-translate-y-1 hover:shadow-md transition-all" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <span className="text-3xl block mb-3">{b.icon}</span>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPONENTS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.components')}</h2>
            <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comps.map((c, i) => (
              <motion.div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <img src={c.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="sm:w-3/5 p-5 flex flex-col justify-center">
                    <h3 className="font-bold text-sm text-secondary-dark mb-2">{c.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APPLICATIONS ═══ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.applications')}</h2>
            <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {apps.map((a, i) => (
              <motion.div key={i} className="bg-white rounded-xl p-5 shadow border border-gray-100 text-center hover:-translate-y-1 hover:shadow-md transition-all" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <span className="text-3xl block mb-2">{a.icon}</span>
                <p className="text-xs font-medium text-gray-700">{a.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WOOD SPECS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src="/images/wooden-posts.jpg" alt="" className="w-full h-56 md:h-full object-cover" />
              <div className="p-6 md:p-8 bg-white">
                <h3 className="text-base font-bold text-secondary-dark font-heading mb-5">{t('telli.woodSpecsTitle')}</h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">{t('telli.material')}</h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {[t('telli.mat1'), t('telli.mat2'), t('telli.mat3')].map((m, i) => (
                        <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">{t('telli.dimensions')}</h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {[t('telli.dim1'), t('telli.dim2'), t('telli.dim3')].map((d, i) => (
                        <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ACCESSORIES ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-secondary-dark font-heading">{t('telli.accessories')}</h2>
            <div className="h-1 w-8 bg-secondary rounded-full mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {accs.map((a, i) => (
              <motion.div key={i} className="bg-white rounded-lg p-3 text-center border border-secondary/10 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <p className="text-[10px] font-medium text-gray-700">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO GALLERY ═══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {['/images/trellis-system.jpg', '/images/orchard-netting.jpg', '/images/wooden-posts.jpg', '/images/hero-bg.jpg'].map((src, i) => (
            <motion.div key={i} className="rounded-xl overflow-hidden shadow group" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <img src={src} alt="" className="w-full h-36 sm:h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 relative overflow-hidden">
        <img src="/images/trellis-system.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/90 to-primary-dark/90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t('telli.ctaTitle')}</h2>
            <p className="text-sm text-white/80 mb-6 max-w-xl mx-auto">{t('telli.ctaDesc')}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="px-8 py-3 bg-white text-secondary-dark rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                {t('telli.ctaButton')}
              </Link>
              <a href="tel:+905454790585" className="px-8 py-3 border-2 border-white text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                0545 479 05 85
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
