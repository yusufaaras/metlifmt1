import { useData, type Product, type BlogPost } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

function resolve(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val[lang]) return val[lang];
  if (typeof val === 'object' && val['tr']) return val['tr']; // Fallback to TR
  return String(val);
}

export interface TranslatedProduct extends Omit<Product, 'title' | 'description' | 'category' | 'specs'> {
  title: string;
  description: string;
  category: string;
  specs: string[];
}

export interface TranslatedBlogPost extends Omit<BlogPost, 'title' | 'content' | 'excerpt' | 'category'> {
  title: string;
  content: string;
  excerpt: string;
  category: string;
}

export function useTranslatedProducts(): TranslatedProduct[] {
  const { products } = useData();
  const { language, t } = useLanguage();

  return products.map(p => ({
    ...p,
    title: p.titleKey ? t(p.titleKey) : resolve(p.title, language),
    description: p.descKey ? t(p.descKey) : resolve(p.description, language),
    category: resolve(p.category, language),
    specs: (p.specsKeys && p.specsKeys.length > 0) 
      ? p.specsKeys.map(k => t(k)) 
      : (Array.isArray(p.specs) ? p.specs : (p.specs as any)?.[language] || (p.specs as any)?.tr || []),
  })) as unknown as TranslatedProduct[];
}

export function useTranslatedBlogPosts(): TranslatedBlogPost[] {
  const { blogPosts } = useData();
  const { language, t } = useLanguage();

  return blogPosts.map(p => ({
    ...p,
    title: p.titleKey ? t(p.titleKey) : resolve(p.title, language),
    content: p.contentKey ? t(p.contentKey) : resolve(p.content, language),
    excerpt: p.excerptKey ? t(p.excerptKey) : resolve(p.excerpt, language),
    category: resolve(p.category, language),
  })) as unknown as TranslatedBlogPost[];
}
