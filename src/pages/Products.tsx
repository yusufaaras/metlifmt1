import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData, type Product } from '@/context/DataContext';

const productImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg',
  '2': '/images/fence-wire.jpg',
  '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg',
  '5': '/images/razor-wire.jpg',
  '6': '/images/fence-wire.jpg',
  '7': '/images/fence-wire.jpg',
  '8': '/images/fence-wire.jpg',
  '9': '/images/trellis-system.jpg',
  '10': '/images/trellis-system.jpg',
  '11': '/images/l-profile.jpg',
  '12': '/images/l-profile.jpg',
  '13': '/images/orchard-netting.jpg',
  '14': '/images/wooden-posts.jpg',
  '15': '/images/l-profile.jpg',
};

export default function Products() {
  const { t } = useLanguage();
  const { products } = useData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { key: 'all', label: t('products.all') },
    { key: 'wire', label: t('products.wire') },
    { key: 'fence', label: t('products.fence') },
    { key: 'wood', label: t('products.wood') },
    { key: 'agriculture', label: t('products.agriculture') },
    { key: 'accessories', label: t('products.accessories') },
  ];

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  const getCategoryLabel = (key: string) => categories.find(c => c.key === key)?.label || key;

  return (
    <div className="pt-20">
      {/* Hero with Image */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src="/images/barbed-wire.jpg" alt={t('products.title')} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {t('products.title')}
          </motion.h1>
          <motion.p className="text-lg text-white/80 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t('products.subtitle')}
          </motion.p>
          <div className="mt-6 h-1 w-20 bg-white/50 mx-auto rounded-full" />
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 sticky top-16 md:top-20 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid with Images */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="card-hover bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group"
                  onClick={() => setSelectedProduct(product)}
                  role="button"
                >
                  <div className="h-48 relative overflow-hidden">
                    {productImages[product.id] ? (
                      <img src={productImages[product.id]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-6xl group-hover:scale-125 transition-transform duration-500">{product.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-primary text-xs rounded-full font-medium shadow-sm">
                      {getCategoryLabel(product.category)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-secondary-dark mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <button className="inline-flex items-center gap-1 mt-3 text-primary text-sm font-semibold hover:gap-2 transition-all">
                      {t('products.details')}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Product Detail Modal with Image */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-56 relative overflow-hidden rounded-t-2xl">
                {productImages[selectedProduct.id] ? (
                  <img src={productImages[selectedProduct.id]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-7xl">{selectedProduct.icon}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-primary text-xs rounded-full font-medium shadow-sm">{getCategoryLabel(selectedProduct.category)}</span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary-dark mb-3">{selectedProduct.title}</h2>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                {selectedProduct.specs.length > 0 && (
                  <>
                    <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-3">{t('products.specs')}</h3>
                    <ul className="space-y-2">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
