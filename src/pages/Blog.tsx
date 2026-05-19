import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedBlogPosts } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api'; // API URL dönüştürücü eklendi

const fallbackBlogImages = [
  '/images/trellis-system.jpg',
  '/images/factory.jpg',
  '/images/barbed-wire.jpg',
  '/images/orchard-netting.jpg',
  '/images/fence-wire.jpg'
];

export default function Blog() {
  const { t, language } = useLanguage(); // language nesnesi eklendi
  const navigate = useNavigate();
  const blogPosts = useTranslatedBlogPosts();

  // Çoklu dil JSON string yapısını güvenli bir şekilde çözen yardımcı fonksiyon
  const getLocalizedText = (textValue: any, currentLang: string): string => {
    if (!textValue) return '';
    try {
      // Eğer değer bir string ise ve JSON formatındaysa parse et
      const parsed = typeof textValue === 'string' ? JSON.parse(textValue) : textValue;
      if (parsed && typeof parsed === 'object') {
        return parsed[currentLang] || parsed['tr'] || Object.values(parsed)[0] || '';
      }
    } catch (e) {
      // JSON değilse düz metindir, doğrudan kendisini dön
    }
    return String(textValue);
  };

  return (
    <div>
      <section className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/85 to-secondary-dark/85" />
        <div className="relative z-10 text-center text-white px-4 pt-16">
          <motion.h1 className="text-3xl md:text-4xl font-bold font-heading mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{t('blog.title')}</motion.h1>
          <motion.p className="text-sm text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{t('blog.subtitle')}</motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16"><span className="text-5xl">📝</span><p className="text-gray-500 mt-2">{t('blog.noPosts')}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, i) => {
                // Eğer veritabanından gelen görsel varsa ilkini al ve getImageUrl ile sarmalla, yoksa lokal fallbacak resmini kullan
                const hasUploadedImg = post.images && post.images.length > 0;
                const coverImage = hasUploadedImg 
                  ? getImageUrl(post.images[0]) 
                  : fallbackBlogImages[i % fallbackBlogImages.length];

                const localizedTitle = getLocalizedText(post.title, language);
                const localizedExcerpt = getLocalizedText(post.excerpt, language);

                return (
                  <motion.article key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer group" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} onClick={() => navigate(`/blog/${post.id}`)}>
                    <div className="h-44 overflow-hidden relative">
                      <img src={coverImage} alt={localizedTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-[10px] rounded-full font-medium shadow-sm">{post.category}</span>
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        {new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h3 className="font-bold text-base text-secondary-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">{localizedTitle}</h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">{localizedExcerpt}</p>
                      <span className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('blog.readMore')} <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}