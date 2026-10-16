import { useData, type Product, type BlogPost } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations, type Language } from '@/i18n/translations';
import { productTranslations } from '@/i18n/productTranslations';

/**
 * Robust multilingual resolver for strings, JSON strings, double-encoded JSON, or multilingual objects.
 * Supports optional fallbackKey to retrieve default translation from translations dictionary.
 */
export function resolveLocalizedText(val: any, lang: string = 'tr', fallbackKey?: string): string {
  if (val === null || val === undefined) {
    if (fallbackKey) {
      const fb = translations[lang as Language]?.[fallbackKey] || translations['tr']?.[fallbackKey];
      if (fb) return fb;
    }
    return '';
  }

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
    // If it has a nested name, title, text, desc, or description property
    if (current.name !== undefined) {
      return resolveLocalizedText(current.name, lang, fallbackKey);
    }
    if (current.title !== undefined) {
      return resolveLocalizedText(current.title, lang, fallbackKey);
    }
    if (current.text !== undefined) {
      return resolveLocalizedText(current.text, lang, fallbackKey);
    }
    if (current.desc !== undefined) {
      return resolveLocalizedText(current.desc, lang, fallbackKey);
    }
    if (current.description !== undefined) {
      return resolveLocalizedText(current.description, lang, fallbackKey);
    }

    // Direct language check
    if (typeof current[lang] === 'string' && current[lang].trim() !== '') {
      return current[lang].trim();
    }

    // If active language is not available in object, check if fallbackKey has translation in target lang
    if (fallbackKey && lang !== 'tr') {
      const fb = translations[lang as Language]?.[fallbackKey];
      if (fb && fb.trim() !== '') return fb.trim();
    }

    // Fallbacks in order: tr, en, es, ru
    if (typeof current['tr'] === 'string' && current['tr'].trim() !== '') {
      return current['tr'].trim();
    }
    if (typeof current['en'] === 'string' && current['en'].trim() !== '') {
      return current['en'].trim();
    }
    if (typeof current['es'] === 'string' && current['es'].trim() !== '') {
      return current['es'].trim();
    }
    if (typeof current['ru'] === 'string' && current['ru'].trim() !== '') {
      return current['ru'].trim();
    }
    for (const [k, v] of Object.entries(current)) {
      if (k !== 'icon' && typeof v === 'string' && v.trim() !== '') {
        return v.trim();
      }
    }

    if (fallbackKey) {
      const fb = translations['tr']?.[fallbackKey];
      if (fb) return fb;
    }
    return '';
  }

  const str = String(current).trim();
  if (fallbackKey && (!str || str === '')) {
    return translations[lang as Language]?.[fallbackKey] || translations['tr']?.[fallbackKey] || '';
  }
  return str;
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

  return products.map(p => {
    const keyPrefix = `p${p.id}`;
    const pTranslations = (productTranslations as any)[language] || {};
    const fallbackTitle = (language !== 'tr' && pTranslations[`${keyPrefix}.title`]) || '';
    const fallbackDesc = (language !== 'tr' && pTranslations[`${keyPrefix}.desc`]) || '';

    let resolvedTitle = p.titleKey ? t(p.titleKey) : resolveLocalizedText(p.title, language);
    const trTitle = resolveLocalizedText(p.title, 'tr');
    if ((!resolvedTitle || resolvedTitle === trTitle) && fallbackTitle) {
      resolvedTitle = fallbackTitle;
    }

    let resolvedDesc = p.descKey ? t(p.descKey) : resolveLocalizedText(p.description, language);
    const trDesc = resolveLocalizedText(p.description, 'tr');
    if ((!resolvedDesc || resolvedDesc === trDesc) && fallbackDesc) {
      resolvedDesc = fallbackDesc;
    }

    let resolvedSpecs: string[] = [];
    if (p.specsKeys && p.specsKeys.length > 0) {
      resolvedSpecs = p.specsKeys.map(k => t(k));
    } else {
      resolvedSpecs = resolveLocalizedSpecs(p.specs, language);
      if (language !== 'tr') {
        const trSpecs = resolveLocalizedSpecs(p.specs, 'tr');
        if (!resolvedSpecs.length || JSON.stringify(resolvedSpecs) === JSON.stringify(trSpecs)) {
          const fallbacks: string[] = [];
          for (let sIdx = 1; sIdx <= 8; sIdx++) {
            const specText = pTranslations[`${keyPrefix}.s${sIdx}`];
            if (specText) fallbacks.push(specText);
            else break;
          }
          if (fallbacks.length > 0) {
            resolvedSpecs = fallbacks;
          }
        }
      }
    }

    return {
      ...p,
      title: resolvedTitle,
      description: resolvedDesc,
      category: resolveLocalizedText(p.category, language),
      specs: resolvedSpecs,
    };
  }) as unknown as TranslatedProduct[];
}

export function useTranslatedBlogPosts(): TranslatedBlogPost[] {
  const { blogPosts } = useData();
  const { language, t } = useLanguage();

  return blogPosts.map(p => {
    const keyPrefix = `blog${p.id}`;
    const bTranslations = (productTranslations as any)[language] || {};
    const fallbackTitle = (language !== 'tr' && bTranslations[`${keyPrefix}.title`]) || '';
    const fallbackContent = (language !== 'tr' && bTranslations[`${keyPrefix}.content`]) || '';
    const fallbackExcerpt = (language !== 'tr' && bTranslations[`${keyPrefix}.excerpt`]) || '';
    const fallbackCategory = (language !== 'tr' && bTranslations[`${keyPrefix}.cat`]) || '';

    let resolvedTitle = p.titleKey ? t(p.titleKey) : resolveLocalizedText(p.title, language);
    const trTitle = resolveLocalizedText(p.title, 'tr');
    if ((!resolvedTitle || resolvedTitle === trTitle) && fallbackTitle) {
      resolvedTitle = fallbackTitle;
    }

    let resolvedContent = p.contentKey ? t(p.contentKey) : resolveLocalizedText(p.content, language);
    const trContent = resolveLocalizedText(p.content, 'tr');
    if ((!resolvedContent || resolvedContent === trContent) && fallbackContent) {
      resolvedContent = fallbackContent;
    }

    let resolvedExcerpt = p.excerptKey ? t(p.excerptKey) : resolveLocalizedText(p.excerpt, language);
    const trExcerpt = resolveLocalizedText(p.excerpt, 'tr');
    if ((!resolvedExcerpt || resolvedExcerpt === trExcerpt) && fallbackExcerpt) {
      resolvedExcerpt = fallbackExcerpt;
    }

    let resolvedCat = p.categoryKey ? t(p.categoryKey) : resolveLocalizedText(p.category, language);
    const trCat = resolveLocalizedText(p.category, 'tr');
    if ((!resolvedCat || resolvedCat === trCat) && fallbackCategory) {
      resolvedCat = fallbackCategory;
    }

    return {
      ...p,
      title: resolvedTitle,
      content: resolvedContent,
      excerpt: resolvedExcerpt,
      category: resolvedCat,
    };
  }) as unknown as TranslatedBlogPost[];
}
