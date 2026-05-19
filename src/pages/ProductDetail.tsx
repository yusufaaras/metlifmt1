import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedProducts } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api';

const LOCAL_MAP: Record<string, string> = {
  '1': 'barbed-wire.jpg', '2': 'fence-wire.jpg', '3': 'wooden-posts.jpg',
  '4': 'l-profile.jpg', '5': 'razor-wire.jpg', '6': 'fence-wire.jpg',
  '7': 'fence-wire.jpg', '8': 'fence-wire.jpg', '9': 'trellis-system.jpg',
  '10': 'trellis-system.jpg', '11': 'l-profile.jpg', '12': 'l-profile.jpg',
  '13': 'orchard-netting.jpg', '14': 'wooden-posts.jpg', '15': 'l-profile.jpg'
};

// Güvenli çoklu dil metin yakalama fonksiyonu
const getLocalizedText = (textValue: any, currentLang: string): string => {
  if (!textValue) return '';
  try {
    const parsed = typeof textValue === 'string' ? JSON.parse(textValue) : textValue;
    if (parsed && typeof parsed === 'object') {
      return parsed[currentLang] || parsed['tr'] || Object.values(parsed)[0] || '';
    }
  } catch (e) {}
  return String(textValue);
};

export default function ProductDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const products = useTranslatedProducts();
  const product = products.find(p => p.id === String(id));
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-secondary-dark">{t('products.all')}</h2>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">Ürünlere Dön</Link>
      </div>
    );
  }

  // Kategorilerin dil karşılıklarını tutan merkezi eşleme
  const cats: Record<string, string> = {
    all: t('products.all'),
    wire: t('products.wire'),
    fence: t('products.fence'),
    wood: t('products.wood'),
    agriculture: t('products.agriculture'),
    accessories: t('products.accessories'),
  };

  const rawCategory = getLocalizedText(product.category, language);
  const displayCategory = cats[rawCategory] || rawCategory;

  const localizedTitle = getLocalizedText(product.title, language);
  const localizedDescription = getLocalizedText(product.description, language);

  // Teknik özellikleri (specs) güvenli bir şekilde çözme ve dizi haline getirme
  const getLocalizedSpecs = (): string[] => {
    if (!product.specs) return [];
    try {
      const parsed = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
      if (typeof parsed === 'object' && parsed !== null) {
        const specList = parsed[language] || parsed['tr'] || [];
        return Array.isArray(specList) ? specList : [];
      }
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return Array.isArray(product.specs) ? product.specs : [];
  };

  const localizedSpecs = getLocalizedSpecs();
  const localImg = (id && LOCAL_MAP[id]) ? [`/images/${LOCAL_MAP[id]}`] : [];
  const images = (product as any).images && (product as any).images.length > 0 ? (product as any).images : localImg;

  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-primary font-bold text-xs uppercase tracking-widest mb-8 hover:gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          {t('products.all')}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <motion.div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-50 border border-gray-100 relative group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img key={activeImg} src={getImageUrl(images[activeImg])} alt={localizedTitle} className="w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">{product.icon}</div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary shadow-md scale-105' : 'border-transparent grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}`}>
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full font-bold uppercase tracking-widest border border-primary/20">
                  {displayCategory}
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-dark font-heading mb-6 leading-tight">{localizedTitle}</h1>
              <p className="text-base text-gray-500 leading-relaxed mb-8">{localizedDescription}</p>
              
              {localizedSpecs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {localizedSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all flex-1 text-center">{t('telli.ctaButton')}</Link>
                <a href="tel:+905454790585" className="p-4 bg-gray-50 text-secondary-dark rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}