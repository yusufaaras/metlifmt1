import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api';

export default function TelliTerbiye() {
  const { language, t } = useLanguage();
  const { getSection } = useData();

  const telli = getSection('telli_terbiye_page', {
    heroTitle: { tr: 'Telli Terbiye File Sistemleri' },
    heroSubtitle: { tr: 'Modern meyve bahçeleri için yüksek verimli, dolu ve güneş korumalı profesyonel kurulum çözümleri' },
    desc: { tr: 'Telli terbiye sistemleri; modern bodur ve yarı bodur meyve bahçelerinde fidanların düzgün gelişmesini, erken ve bol verime yatmasını sağlayan, dolu ve aşırı güneşten koruyan profesyonel altyapı sistemidir. FMT Makina olarak emprenyeli ahşap direk, galvanizli çelik halat, ankraj ve koruyucu file dahil anahtar teslim kurulum hizmeti sunuyoruz.' },
    benefits: [
      { icon: '🌱', text: { tr: 'Erken ve Yüksek Verim' } },
      { icon: '🛡️', text: { tr: 'Dolu ve Güneş Koruması' } },
      { icon: '✂️', text: { tr: 'Kolay Budama ve Hasat' } },
      { icon: '📊', text: { tr: 'Homojen Meyve Kalitesi' } },
      { icon: '🍎', text: { tr: 'Maksimum Işık Dağılımı' } }
    ],
    components: [
      { title: { tr: 'Emprenyeli Ahşap Direk' }, desc: { tr: 'Kestane ve çam ağaçlarından üretilen, WBC basınçlı emprenye ile çürümeye karşı 20+ yıl dayanıklı direkler.' }, img: '/images/wooden-posts.jpg' },
      { title: { tr: 'Galvanizli Çelik Halat & Tel' }, desc: { tr: 'Yüksek çekme mukavemetli sıcak daldırma galvanizli taşıyıcı halat ve gergi telleri.' }, img: '/images/barbed-wire.jpg' },
      { title: { tr: 'Dolu ve Gölgeleme Filesi' }, desc: { tr: 'UV katkılı, yırtılmaya dayanıklı monofilament dolu koruma ve gölgeleme fileleri.' }, img: '/images/orchard-netting.jpg' },
      { title: { tr: 'L Profil & Ankraj Kazıkları' }, desc: { tr: 'Sistemi yere sağlam bağlayan galvanizli L profil ve tek/çift T ankraj kazıkları.' }, img: '/images/l-profile.jpg' }
    ],
    applications: [
      { icon: '🍏', text: { tr: 'Elma Bahçeleri' } },
      { icon: '🍐', text: { tr: 'Armut Bahçeleri' } },
      { icon: '🍒', text: { tr: 'Kiraz Bahçeleri' } },
      { icon: '🍑', text: { tr: 'Şeftali & Nektarin' } },
      { icon: '🍇', text: { tr: 'Bağ Sistemleri' } },
      { icon: '📅', text: { tr: 'Hurma & Narenciye' } }
    ],
    woodSpecs: {
      title: { tr: 'Emprenyeli Ahşap Direk Özellikleri' },
      materials: [
        { tr: 'Kestane, Kızılçam, Sarıçam ağaçları' },
        { tr: 'WBC Vakum-Basınç yöntemiyle emprenye işlemi' },
        { tr: 'Toprak altı ve üstü çürümelere karşı 20+ yıl dayanım' }
      ],
      dimensions: [
        { tr: 'Kalınlık: Q6 - Q8 - Q10 - Q12' },
        { tr: 'Uzunluk: 2.50 mt - 3.00 mt - 3.50 mt - 4.00 mt - 4.50 mt' },
        { tr: 'Tepelik kova tipi şapka ve tel tutturma kanalları' }
      ],
      image: '/images/wooden-posts.jpg'
    },
    accessories: [
      { name: { tr: 'Direk Şapkası (Kova Tipi)' }, img: '/images/wooden-posts.jpg' },
      { name: { tr: 'Tel Gerdirme Aparatı (Gripple)' }, img: '/images/l-profile.jpg' },
      { name: { tr: 'File Birleştirme Klipsi' }, img: '/images/orchard-netting.jpg' },
      { name: { tr: 'Tel Klipsi & Çivisi' }, img: '/images/barbed-wire.jpg' },
      { name: { tr: 'Ankraj Vidası & Kazığı' }, img: '/images/l-profile.jpg' },
      { name: { tr: 'Bambu & Kamış Destek Çubuğu' }, img: '/images/wooden-posts.jpg' },
      { name: { tr: 'Elastik Fidan Bağlama İpi' }, img: '/images/trellis-system.jpg' },
      { name: { tr: 'Gergi Çıkrığı' }, img: '/images/fence-wire.jpg' },
      { name: { tr: 'Dolu Filesi Taşıyıcı Plakası' }, img: '/images/orchard-netting.jpg' },
      { name: { tr: 'Ağaç Gövde Koruyucu' }, img: '/images/factory.jpg' }
    ],
    gallery: [
      '/images/trellis-system.jpg',
      '/images/orchard-netting.jpg',
      '/images/wooden-posts.jpg',
      '/images/hero-bg.jpg'
    ]
  });

  const heroTitle = resolveLocalizedText(telli.heroTitle, language) || t('telli.title');
  const heroSubtitle = resolveLocalizedText(telli.heroSubtitle, language) || t('telli.subtitle');
  const desc = resolveLocalizedText(telli.desc, language) || t('telli.desc');

  const benefits = Array.isArray(telli.benefits) ? telli.benefits.map((b: any) => ({
    icon: b.icon || '🌱',
    text: resolveLocalizedText(b.text, language)
  })) : [];

  const comps = Array.isArray(telli.components) ? telli.components.map((c: any) => ({
    title: resolveLocalizedText(c.title, language),
    desc: resolveLocalizedText(c.desc, language),
    img: getImageUrl(c.img)
  })) : [];

  const apps = Array.isArray(telli.applications) ? telli.applications.map((a: any) => ({
    icon: a.icon || '🍏',
    text: resolveLocalizedText(a.text, language)
  })) : [];

  const woodSpecs = telli.woodSpecs || {};
  const woodMaterials = Array.isArray(woodSpecs.materials) ? woodSpecs.materials.map((m: any) => resolveLocalizedText(m, language)) : [];
  const woodDimensions = Array.isArray(woodSpecs.dimensions) ? woodSpecs.dimensions.map((d: any) => resolveLocalizedText(d, language)) : [];

  const accessories = Array.isArray(telli.accessories) ? telli.accessories.map((acc: any) => ({
    name: resolveLocalizedText(acc.name || acc, language),
    img: acc.img ? getImageUrl(acc.img) : '/images/wooden-posts.jpg'
  })) : [];

  const galleryImages = Array.isArray(telli.gallery) ? telli.gallery.map((img: string) => getImageUrl(img)) : ['/images/trellis-system.jpg', '/images/orchard-netting.jpg', '/images/wooden-posts.jpg', '/images/hero-bg.jpg'];

  const heroImage = telli.heroImage ? getImageUrl(telli.heroImage) : '/images/trellis-system.jpg';
  const mainDesc2 = resolveLocalizedText(telli.mainDesc2 || telli.desc2, language);
  const mainTitle = resolveLocalizedText(telli.mainTitle, language) || heroTitle;
  const ctaTitle = resolveLocalizedText(telli.ctaTitle, language) || t('telli.ctaTitle');
  const ctaDesc = resolveLocalizedText(telli.ctaDesc, language) || t('telli.ctaDesc');
  const ctaButtonText = resolveLocalizedText(telli.ctaButtonText, language) || t('telli.ctaButton');
  const ctaPhone = telli.ctaPhone || telli.phone || '0545 479 05 85';

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white mb-5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {t('nav.telli')}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight mb-4">
              {heroTitle}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm md:text-base text-white/80 leading-relaxed mb-6 max-w-md">
              {heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
              <Link to="/contact" className="px-6 py-2.5 bg-white text-secondary-dark rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                {ctaButtonText}
              </Link>
              <a href={`tel:${ctaPhone.replace(/\s+/g, '')}`} className="px-6 py-2.5 border-2 border-white/60 text-white rounded-full text-sm font-semibold hover:bg-white/10 transition-all">
                {ctaPhone}
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
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading mb-4">{mainTitle}</h2>
              <div className="h-1 w-12 bg-secondary rounded-full mb-5" />
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
              {mainDesc2 && <p className="text-sm text-gray-600 leading-relaxed mb-6">{mainDesc2}</p>}
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: `${apps.length}+`, l: t('telli.applications') },
                  { n: `${accessories.length}+`, l: t('telli.accessories') },
                  { n: `${comps.length}`, l: t('telli.components') },
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
      {benefits.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.benefits')}</h2>
              <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {benefits.map((b: any, i: number) => (
                <motion.div key={i} className="bg-white rounded-xl p-5 shadow border border-gray-100 text-center hover:-translate-y-1 hover:shadow-md transition-all" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <span className="text-3xl block mb-3">{b.icon}</span>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ COMPONENTS ═══ */}
      {comps.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.components')}</h2>
              <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comps.map((c: any, i: number) => (
                <motion.div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-gray-100">
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
      )}

      {/* ═══ APPLICATIONS ═══ */}
      {apps.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark font-heading">{t('telli.applications')}</h2>
              <div className="h-1 w-10 bg-secondary rounded-full mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {apps.map((a: any, i: number) => (
                <motion.div key={i} className="bg-white rounded-xl p-5 shadow border border-gray-100 text-center hover:-translate-y-1 hover:shadow-md transition-all" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <span className="text-3xl block mb-2">{a.icon}</span>
                  <p className="text-xs font-medium text-gray-700">{a.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ WOOD SPECS ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={getImageUrl(woodSpecs.image || '/images/wooden-posts.jpg')} alt="" className="w-full h-56 md:h-full object-cover" />
              <div className="p-6 md:p-8 bg-white">
                <h3 className="text-base font-bold text-secondary-dark font-heading mb-5">
                  {resolveLocalizedText(woodSpecs.title, language) || t('telli.woodSpecsTitle')}
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">{t('telli.material')}</h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {woodMaterials.map((m: string, i: number) => (
                        <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">{t('telli.dimensions')}</h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {woodDimensions.map((d: string, i: number) => (
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

      {/* ═══ ACCESSORIES (KÜÇÜK FOTOĞRAFLI KARTLAR) ═══ */}
      {accessories.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-secondary-dark font-heading">{t('telli.accessories')}</h2>
              <div className="h-1 w-8 bg-secondary rounded-full mx-auto mt-2" />
            </div>
            {/* Küçük Fotoğraflı Kompakt Aksesuar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {accessories.map((a: any, i: number) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="h-24 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={a.img}
                      alt={a.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-2.5 text-center flex-1 flex items-center justify-center">
                    <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                      {a.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PHOTO GALLERY ═══ */}
      {galleryImages.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((src: string, i: number) => (
              <motion.div key={i} className="rounded-xl overflow-hidden shadow group" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <img src={src} alt="" className="w-full h-36 sm:h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-16 relative overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/90 to-primary-dark/90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">{ctaTitle}</h2>
            <p className="text-sm text-white/80 mb-6 max-w-xl mx-auto">{ctaDesc}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="px-8 py-3 bg-white text-secondary-dark rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                {ctaButtonText}
              </Link>
              <a href={`tel:${ctaPhone.replace(/\s+/g, '')}`} className="px-8 py-3 border-2 border-white text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">
                {ctaPhone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
