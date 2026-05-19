import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedBlogPosts } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api';

const BLOG_LOCAL = ['/images/trellis-system.jpg', '/images/factory.jpg', '/images/barbed-wire.jpg', '/images/orchard-netting.jpg', '/images/fence-wire.jpg'];

export default function BlogDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const posts = useTranslatedBlogPosts();
  const post = posts.find(p => p.id === String(id));
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold">{t('blog.title')}</h2>
        <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">Bloga Dön</Link>
      </div>
    );
  }

  const postsIndex = posts.indexOf(post);
  const localImg = BLOG_LOCAL[postsIndex % BLOG_LOCAL.length] ? [BLOG_LOCAL[postsIndex % BLOG_LOCAL.length]] : [];
  const images = (post as any).images && (post as any).images.length > 0 ? (post as any).images : localImg;

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-primary font-bold text-xs uppercase tracking-widest mb-10 hover:gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          {t('blog.title')}
        </Link>

        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary/20">{post.category}</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-400 font-medium">{new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-dark font-heading mb-12 leading-tight">{post.title}</h1>

          {images.length > 0 && (
            <div className="space-y-6 mb-12">
              <motion.div className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-50 border border-gray-100 relative" layoutId="blog-main-img">
                <AnimatePresence mode="wait">
                  <motion.img key={activeImg} src={getImageUrl(images[activeImg])} alt="" className="w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
                </AnimatePresence>
              </motion.div>
              
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`relative flex-shrink-0 w-28 md:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-500 font-medium italic mb-8 border-l-4 border-primary/30 pl-6 leading-relaxed">{post.excerpt}</p>
            <div className="text-gray-700 leading-[1.8] text-base md:text-lg whitespace-pre-line space-y-6">{post.content}</div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
