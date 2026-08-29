import { useData, type Product, type BlogPost } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Robust multilingual resolver for strings, JSON strings, double-encoded JSON, or multilingual objects.
 */
export function resolveLocalizedText(val: any, lang: string = 'tr'): string {
  if (val === null || val === undefined) return '';

  let current = val;

  if (typeof current === 'string') {
    const trimmed = current.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('"{') && trimmed.endsWith('}"')) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          try {
            const innerParsed = JSON.parse(parsed);
            if (innerParsed && typeof innerParsed === 'object') {
              parsed = innerParsed;
            }
          } catch {}
        }
        if (parsed && typeof parsed === 'object') {
          current = parsed;
        }
      } catch {
        try {
          const sanitized = trimmed.replace(/\r?\n/g, '\\n');
          let parsed = JSON.parse(sanitized);
          if (parsed && typeof parsed === 'object') {
            current = parsed;
          }
        } catch {}
      }
    }
  }

  if (current && typeof current === 'object' && !Array.isArray(current)) {
    if (typeof current[lang] === 'string' && current[lang].trim() !== '') {
      return current[lang];
    }
    if (typeof current['tr'] === 'string' && current['tr'].trim() !== '') {
      return current['tr'];
    }
    if (typeof current['en'] === 'string' && current['en'].trim() !== '') {
      return current['en'];
    }
    if (typeof current['es'] === 'string' && current['es'].trim() !== '') {
      return current['es'];
    }
    if (typeof current['ru'] === 'string' && current['ru'].trim() !== '') {
      return current['ru'];
    }
    for (const v of Object.values(current)) {
      if (typeof v === 'string' && v.trim() !== '') {
        return v;
      }
    }
    return '';
  }

  return String(current);
}

/**
 * Robust specs resolver for arrays, JSON strings, or multilingual spec objects.
 */
export function resolveLocalizedSpecs(val: any, lang: string = 'tr'): string[] {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val.map(v => typeof v === 'string' ? resolveLocalizedText(v, lang) : String(v)).filter(Boolean);
  }

  let current = val;
  if (typeof current === 'string') {
    const trimmed = current.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) {
      try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch {}
        }
        current = parsed;
      } catch {
        try {
          const sanitized = trimmed.replace(/\r?\n/g, '\\n');
          current = JSON.parse(sanitized);
        } catch {}
      }
    }
  }

  if (Array.isArray(current)) {
    return current.map(v => typeof v === 'string' ? resolveLocalizedText(v, lang) : String(v)).filter(Boolean);
  }

  if (current && typeof current === 'object') {
    const specList = current[lang] || current['tr'] || current['en'] || current['es'] || current['ru'] || Object.values(current)[0] || [];
    if (Array.isArray(specList)) {
      return specList.map(String).filter(Boolean);
    }
    if (typeof specList === 'string') {
      return specList.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }

  if (typeof current === 'string') {
    return current.split('\n').map(s => s.trim()).filter(Boolean);
  }

  return [];
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
    title: p.titleKey ? t(p.titleKey) : resolveLocalizedText(p.title, language),
    description: p.descKey ? t(p.descKey) : resolveLocalizedText(p.description, language),
    category: resolveLocalizedText(p.category, language),
    specs: (p.specsKeys && p.specsKeys.length > 0) 
      ? p.specsKeys.map(k => t(k)) 
      : resolveLocalizedSpecs(p.specs, language),
  })) as unknown as TranslatedProduct[];
}

export function useTranslatedBlogPosts(): TranslatedBlogPost[] {
  const { blogPosts } = useData();
  const { language, t } = useLanguage();

  return blogPosts.map(p => ({
    ...p,
    title: p.titleKey ? t(p.titleKey) : resolveLocalizedText(p.title, language),
    content: p.contentKey ? t(p.contentKey) : resolveLocalizedText(p.content, language),
    excerpt: p.excerptKey ? t(p.excerptKey) : resolveLocalizedText(p.excerpt, language),
    category: p.categoryKey ? t(p.categoryKey) : resolveLocalizedText(p.category, language),
  })) as unknown as TranslatedBlogPost[];
}
