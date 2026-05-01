import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function TelliTerbiye() {
  const { t } = useLanguage();

  const benefits = [
    { icon: '🌱', text: t('telli.benefit1') },
    { icon: '🛡️', text: t('telli.benefit2') },
    { icon: '✂️', text: t('telli.benefit3') },
    { icon: '📊', text: t('telli.benefit4') },
    { icon: '🍎', text: t('telli.benefit5') },
  ];

  const applications = [
    { icon: '🍏', text: t('telli.app1') },
    { icon: '🍐', text: t('telli.app2') },
    { icon: '🍒', text: t('telli.app3') },
    { icon: '🍑', text: t('telli.app4') },
    { icon: '🍇', text: t('telli.app5') },
    { icon: '📅', text: t('telli.app6') },
  ];

  const components = [
    { title: t('telli.comp1'), desc: t('telli.comp1Desc'), icon: '🪵', img: '/images/wooden-posts.jpg' },
    { title: t('telli.comp2'), desc: t('telli.comp2Desc'), icon: '🔗', img: '/images/barbed-wire.jpg' },
    { title: t('telli.comp3'), desc: t('telli.comp3Desc'), icon: '🥅', img: '/images/orchard-netting.jpg' },
    { title: t('telli.comp4'), desc: t('telli.comp4Desc'), icon: '🔧', img: '/images/l-profile.jpg' },
  ];

  const accessories = [
    t('telli.acc1'), t('telli.acc2'), t('telli.acc3'), t('telli.acc4'), t('telli.acc5'),
    t('telli.acc6'), t('telli.acc7'), t('telli.acc8'), t('telli.acc9'), t('telli.acc10'),
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <img src="/images/trellis-system.jpg" alt={t('telli.title')} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full animate-float" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-6xl mb-6 block">🌳</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">{t('telli.title')}</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">{t('telli.subtitle')}</p>
            <div className="mt-6 h-1 w-24 bg-white/50 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Description with Image */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-lg text-gray-600 leading-relaxed">{t('telli.desc')}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/orchard-netting.jpg" alt={t('telli.comp3')} className="w-full h-72 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-dark font-heading mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('telli.benefits')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {benefits.map((item, i) => (
              <motion.div key={i} className="card-hover bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <span className="text-4xl block mb-4">{item.icon}</span>
                <p className="text-sm font-medium text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Components with Images */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-dark font-heading mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('telli.components')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {components.map((comp, i) => (
              <motion.div key={i} className="card-hover bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden" initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <img src={comp.img} alt={comp.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="sm:w-3/5 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{comp.icon}</span>
                      <h3 className="font-bold text-lg text-secondary-dark">{comp.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{comp.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-dark font-heading mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('telli.applications')}
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {applications.map((app, i) => (
              <motion.div key={i} className="card-hover bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className="text-4xl block mb-3">{app.icon}</span>
                <p className="text-xs font-medium text-gray-700">{app.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Strip */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {['/images/trellis-system.jpg', '/images/wooden-posts.jpg', '/images/orchard-netting.jpg'].map((src, i) => (
              <motion.div key={i} className="rounded-xl overflow-hidden shadow-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <img src={src} alt="" className="w-full h-40 md:h-56 object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl font-bold text-center text-secondary-dark font-heading mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('telli.accessories')}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {accessories.map((acc, i) => (
              <motion.div key={i} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 text-center border border-primary/10" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <p className="text-xs font-medium text-gray-700">{acc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wooden Post Specs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <img src="/images/wooden-posts.jpg" alt={t('telli.woodSpecsTitle')} className="w-full h-56 object-cover" />
            <div className="p-8">
              <h3 className="text-2xl font-bold text-secondary-dark font-heading mb-6">{t('telli.woodSpecsTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary mb-3">{t('telli.material')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.mat1')}</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.mat2')}</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.mat3')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-3">{t('telli.dimensions')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.dim1')}</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.dim2')}</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full" />{t('telli.dim3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <img src="/images/trellis-system.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">{t('telli.ctaTitle')}</h2>
            <p className="text-lg text-white/80 mb-8">{t('telli.ctaDesc')}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg">
                {t('telli.ctaButton')}
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
