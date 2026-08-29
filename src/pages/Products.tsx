import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedProducts, resolveLocalizedText } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api';

const fallbackProductImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg', '2': '/images/fence-wire.jpg', '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg', '5': '/images/razor-wire.jpg', '6': '/images/fence-wire.jpg',
  '7': '/images/fence-wire.jpg', '8': '/images/fence-wire.jpg', '9': '/images/trellis-system.jpg',
  '10': '/images/trellis-system.jpg', '11': '/images/l-profile.jpg', '12': '/images/l-profile.jpg',
  '13': '/images/orchard-netting.jpg', '14': '/images/wooden-posts.jpg', '15': '/images/l-profile.jpg',
};

const getLocalizedText = (textValue: any, currentLang: string = 'tr'): string => {
  return resolveLocalizedText(textValue, currentLang);
};

export default function Products() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const products = useTranslatedProducts();
  const [tab, setTab] = useState('all');

  const cats = [
    { key: 'all', label: t('products.all') },
    { key: 'wire', label: t('products.wire') },
    { key: 'fence', label: t('products.fence') },
    { key: 'wood', label: t('products.wood') },
    { key: 'agriculture', label: t('products.agriculture') },
    { key: 'accessories', label: t('products.accessories') },
  ];

  // Kategori string ya da JSON gelse bile güvenle filtreleme yapar
  const filtered = tab === 'all' 
    ? products 
    : products.filter(p => getLocalizedText(p.category, 'tr') === tab);

  const catLabel = (k: string) => cats.find(c => c.key === k)?.label || k;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img src="/images/barbed-wire.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/85 to-secondary-dark/85" />
        <div className="relative z-10 text-center text-white px-4 pt-16">
          <motion.h1 className="text-3xl md:text-4xl font-bold font-heading mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{t('products.title')}</motion.h1>
          <motion.p className="text-sm text-white/70 max-w-lg mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{t('products.subtitle')}</motion.p>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-3 scrollbar-none">
          {cats.map(c => (
            <button key={c.key} onClick={() => setTab(c.key)} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${tab === c.key ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => {
                const hasUploadedImg = p.images && p.images.length > 0;
                const coverImage = hasUploadedImg ? getImageUrl(p.images[0]) : fallbackProductImages[p.id];

                const localizedTitle = getLocalizedText(p.title, language);
                const localizedDescription = getLocalizedText(p.description, language);
                const cleanCategoryKey = getLocalizedText(p.category, 'tr');

                return (
                  <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate(`/product/${p.id}`)} role="button">
                    <div className="h-44 sm:h-52 relative overflow-hidden">
                      {coverImage ? (
                        <img src={coverImage} alt={localizedTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-5xl">{p.icon}</span></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-primary text-[10px] rounded-full font-semibold shadow-sm">{catLabel(cleanCategoryKey)}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-secondary-dark mb-1 group-hover:text-primary transition-colors">{localizedTitle}</h3>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{localizedDescription}</p>
                      <div className="mt-4 flex items-center text-primary text-[10px] font-bold uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                        {t('blog.readMore') || 'Detayları Gör'} <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}