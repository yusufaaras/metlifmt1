import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { resolveLocalizedText } from '@/hooks/useTranslatedData';
import { getImageUrl, uploadMediaFiles } from '@/services/api';
import { useData, type Product, type BlogPost, type Multilang } from '@/context/DataContext';
import * as api from '@/services/api';

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
] as const;

type LangCode = typeof LANGUAGES[number]['code'];

function emptyMultilang(): Multilang {
  return { tr: '', en: '', es: '', ru: '' };
}

function ensureMultilang(val: any): Multilang {
  if (!val) return emptyMultilang();
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('"{')) {
      try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch {}
        }
        if (typeof parsed === 'object' && parsed !== null) return { ...emptyMultilang(), ...parsed };
      } catch (e) {}
    }
    return { tr: val, en: val, es: val, ru: val };
  }
  if (typeof val === 'object' && val !== null) return { ...emptyMultilang(), ...val };
  return emptyMultilang();
}

// Reusable Language Tab Selector
function LangSelector({ activeLang, onChange }: { activeLang: LangCode; onChange: (l: LangCode) => void }) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-3">
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeLang === l.code ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}

// ===== LOGIN =====
function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const result = await api.login(username, password);
      if (result) {
        window.location.href = '/admin';
        return;
      }
    } catch (err: any) {
      if (onLogin(username, password)) {
        window.location.href = '/admin';
        return;
      }
      setError('Hatalı kullanıcı adı veya şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl tracking-wider">METLİ</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-dark">Admin Yönetim Paneli</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">METLİ Ticaret & FMT Makina</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kullanıcı Adı</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Şifre</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===== PRODUCT FORM =====
function ProductForm({ product, onSave, onCancel }: { product?: Product; onSave: (formData: FormData) => void; onCancel: () => void }) {
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [titles, setTitles] = useState<Multilang>(ensureMultilang(product?.title));
  const [descriptions, setDescriptions] = useState<Multilang>(ensureMultilang(product?.description));
  const [category, setCategory] = useState<string>(product?.category ? resolveLocalizedText(product.category, 'tr') : 'wire');
  const [icon, setIcon] = useState(product?.icon || '🔗');
  const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(product?.is_featured));
  const [sortOrder, setSortOrder] = useState<number>(product?.sort_order || 0);

  const [specs, setSpecs] = useState<Record<string, string>>(() => {
    const s = product?.specs;
    const res: Record<string, string> = { tr: '', en: '', es: '', ru: '' };
    if (Array.isArray(s)) {
      res.tr = s.join('\n');
    } else if (typeof s === 'object' && s !== null) {
      Object.keys(s).forEach(k => {
        const val = (s as any)[k];
        res[k] = Array.isArray(val) ? val.join('\n') : String(val);
      });
    } else if (typeof s === 'string') {
      try {
        const parsed = JSON.parse(s);
        if (typeof parsed === 'object' && parsed !== null) {
          Object.keys(parsed).forEach(k => {
            const val = parsed[k];
            res[k] = Array.isArray(val) ? val.join('\n') : String(val);
          });
        }
      } catch (e) {
        res.tr = s;
      }
    }
    return res;
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (product?.id) formData.append('id', product.id);
    formData.append('title', JSON.stringify(titles));
    formData.append('description', JSON.stringify(descriptions));
    formData.append('category', category);
    formData.append('icon', icon);
    formData.append('is_featured', isFeatured ? '1' : '0');
    formData.append('sort_order', String(sortOrder));

    const formattedSpecs: any = {};
    LANGUAGES.forEach(l => {
      formattedSpecs[l.code] = (specs[l.code] || '').split('\n').filter(s => s.trim());
    });
    formData.append('specs', JSON.stringify(formattedSpecs));
    formData.append('existingImages', JSON.stringify(existingImages));

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ürün Adı ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={titles[activeLang]}
            onChange={e => setTitles({ ...titles, [activeLang]: e.target.value })}
            required={activeLang === 'tr'}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white h-[38px]"
          >
            <option value="wire">Tel Ürünleri (wire)</option>
            <option value="fence">Çit & Panel Sistemleri (fence)</option>
            <option value="wood">Ahşap Grupları (wood)</option>
            <option value="agriculture">Tarım & Tarımsal Çözümler (agriculture)</option>
            <option value="accessories">Aksesuarlar & Gerdirme (accessories)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Açıklama ({activeLang.toUpperCase()})</label>
        <textarea
          value={descriptions[activeLang]}
          onChange={e => setDescriptions({ ...descriptions, [activeLang]: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teknik Özellikler ({activeLang.toUpperCase()}) - Her satıra bir özellik</label>
        <textarea
          value={specs[activeLang]}
          onChange={e => setSpecs({ ...specs, [activeLang]: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İkon (Emoji)</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sıralama (Küçükten Büyüğe)</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <div className="pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            <span className="text-sm font-semibold text-gray-700">Ana Sayfada Öne Çıkar</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yeni Görseller Ekle</label>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yüklü Görseller (İlki kapak görselidir)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary shadow-md' : 'border-gray-100'}`}>
                <img src={getImageUrl(img)} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  {i !== 0 && (
                    <button type="button" onClick={() => {
                      const copy = [...existingImages];
                      const [sel] = copy.splice(i, 1);
                      setExistingImages([sel, ...copy]);
                    }} className="p-1 bg-primary text-white rounded text-[9px] font-bold">Kapak Yap</button>
                  )}
                  <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))} className="p-1 bg-red-500 text-white rounded text-[9px] font-bold">Sil</button>
                </div>
                {i === 0 && <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-bold">KAPAK</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">Kaydet</button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">İptal</button>
      </div>
    </form>
  );
}

// ===== BLOG FORM =====
function BlogForm({ post, onSave, onCancel }: { post?: BlogPost; onSave: (formData: FormData) => void; onCancel: () => void }) {
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [titles, setTitles] = useState<Multilang>(ensureMultilang(post?.title));
  const [contents, setContents] = useState<Multilang>(ensureMultilang(post?.content));
  const [excerpts, setExcerpts] = useState<Multilang>(ensureMultilang(post?.excerpt));
  const [categories, setCategories] = useState<Multilang>(ensureMultilang(post?.category));
  const [date, setDate] = useState(post?.date || new Date().toISOString().split('T')[0]);

  const [files, setFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(post?.images || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (post?.id) formData.append('id', post.id);
    formData.append('title', JSON.stringify(titles));
    formData.append('content', JSON.stringify(contents));
    formData.append('excerpt', JSON.stringify(excerpts));
    formData.append('category', JSON.stringify(categories));
    formData.append('date', date);
    formData.append('existingImages', JSON.stringify(existingImages));

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={titles[activeLang]}
            onChange={e => setTitles({ ...titles, [activeLang]: e.target.value })}
            required={activeLang === 'tr'}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={categories[activeLang]}
              onChange={e => setCategories({ ...categories, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Özet ({activeLang.toUpperCase()})</label>
        <textarea
          value={excerpts[activeLang]}
          onChange={e => setExcerpts({ ...excerpts, [activeLang]: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İçerik ({activeLang.toUpperCase()})</label>
        <textarea
          value={contents[activeLang]}
          onChange={e => setContents({ ...contents, [activeLang]: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-mono text-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yeni Görseller Ekle</label>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yüklü Görseller (Kapak görselini veya sıralamayı değiştirebilirsiniz)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden border-2 group ${i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}>
                <img src={getImageUrl(img)} alt="" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...existingImages];
                        const [sel] = copy.splice(i, 1);
                        setExistingImages([sel, ...copy]);
                      }}
                      className="px-2 py-1 bg-primary text-white rounded text-[10px] font-bold w-full text-center"
                    >
                      🌟 Kapak Yap
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                    className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold w-full text-center"
                  >
                    🗑️ Fotoğrafı Kaldır
                  </button>
                </div>
                {i === 0 && <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-md">KAPAK</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">Kaydet</button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">İptal</button>
      </div>
    </form>
  );
}

// =========================================================================
// SECTION EDITORS (HOME, GALLERY, ABOUT, TELLI, SERVICES, FOOTER)
// =========================================================================

// 1. HOME SECTION EDITOR
function HomeEditor() {
  const { getSection, updateSectionData, products } = useData();
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // Hero State
  const heroData = getSection('home_hero') || {};
  const [experienceBadge, setExperienceBadge] = useState(heroData.experienceBadge || '50+ Yıllık Tecrübe');
  const [heroTitle, setHeroTitle] = useState<Multilang>(ensureMultilang(heroData.title));
  const [heroSubtitle, setHeroSubtitle] = useState<Multilang>(ensureMultilang(heroData.subtitle));
  const [heroSlogan, setHeroSlogan] = useState<Multilang>(ensureMultilang(heroData.slogan));
  const [ctaPrimaryText, setCtaPrimaryText] = useState<Multilang>(ensureMultilang(heroData.ctaPrimaryText));
  const [ctaPrimaryLink, setCtaPrimaryLink] = useState(heroData.ctaPrimaryLink || '/products');
  const [ctaSecondaryText, setCtaSecondaryText] = useState<Multilang>(ensureMultilang(heroData.ctaSecondaryText));
  const [ctaSecondaryLink, setCtaSecondaryLink] = useState(heroData.ctaSecondaryLink || '/contact');
  const [videos, setVideos] = useState<string[]>(Array.isArray(heroData.videos) ? heroData.videos : ['/images/hero1.mp4']);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Stats State
  const statsData = getSection('home_stats') || [];
  const [stats, setStats] = useState<any[]>(Array.isArray(statsData) ? statsData : []);

  // Why Us State
  const whyUsData = getSection('home_why_us') || [];
  const [whyUs, setWhyUs] = useState<any[]>(Array.isArray(whyUsData) ? whyUsData : []);

  // CTA State
  const ctaData = getSection('home_cta') || {};
  const [ctaTitle, setCtaTitle] = useState<Multilang>(ensureMultilang(ctaData.title));
  const [ctaDesc, setCtaDesc] = useState<Multilang>(ensureMultilang(ctaData.description));
  const [ctaButtonText, setCtaButtonText] = useState<Multilang>(ensureMultilang(ctaData.buttonText));
  const [ctaButtonLink, setCtaButtonLink] = useState(ctaData.buttonLink || '/contact');

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingVideo(true);
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        setVideos([...videos, ...urls]);
      }
    } catch (err) {
      alert('Video yüklenirken hata oluştu');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSectionData('home_hero', {
        experienceBadge,
        title: heroTitle,
        subtitle: heroSubtitle,
        slogan: heroSlogan,
        ctaPrimaryText,
        ctaPrimaryLink,
        ctaSecondaryText,
        ctaSecondaryLink,
        videos,
      });

      await updateSectionData('home_stats', stats);
      await updateSectionData('home_why_us', whyUs);
      await updateSectionData('home_cta', {
        title: ctaTitle,
        description: ctaDesc,
        buttonText: ctaButtonText,
        buttonLink: ctaButtonLink,
      });

      setSavedMsg('Ana sayfa ayarları başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">Ana Sayfa Yönetimi</h2>
          <p className="text-xs text-gray-500 mt-1">Hero videosu, başlıklar, istatistikler ve neden biz bölümlerini düzenleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      {/* 1. HERO BÖLÜMÜ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2 border-b pb-3">
          <span>🎬</span> 1. Hero (Giriş) Bölümü & Video Arka Planı
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deneyim Rozeti</label>
            <input
              type="text"
              value={experienceBadge}
              onChange={e => setExperienceBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slogan ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={heroSlogan[activeLang]}
              onChange={e => setHeroSlogan({ ...heroSlogan, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Ana Başlık ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={heroTitle[activeLang]}
            onChange={e => setHeroTitle({ ...heroTitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Alt Açıklama ({activeLang.toUpperCase()})</label>
          <textarea
            value={heroSubtitle[activeLang]}
            onChange={e => setHeroSubtitle({ ...heroSubtitle, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birincil Buton Metni ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={ctaPrimaryText[activeLang]}
              onChange={e => setCtaPrimaryText({ ...ctaPrimaryText, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birincil Buton Linki</label>
            <input
              type="text"
              value={ctaPrimaryLink}
              onChange={e => setCtaPrimaryLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Video Oynatma Listesi & Video Yükleme */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <label className="block text-xs font-bold text-gray-700 uppercase">
            Arka Plan Videoları (Sırayla Otomatik Oynatılır)
          </label>
          <div className="space-y-2">
            {videos.map((vid, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                <input
                  type="text"
                  value={vid}
                  onChange={e => {
                    const copy = [...videos];
                    copy[idx] = e.target.value;
                    setVideos(copy);
                  }}
                  className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                  className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Örn: /images/hero1.mp4 veya URL"
                value={newVideoUrl}
                onChange={e => setNewVideoUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newVideoUrl.trim()) {
                    setVideos([...videos, newVideoUrl.trim()]);
                    setNewVideoUrl('');
                  }
                }}
                className="px-4 py-2 bg-secondary-dark text-white rounded-lg text-xs font-semibold hover:bg-secondary"
              >
                URL Ekle
              </button>
            </div>
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-all">
                <span>{uploadingVideo ? 'Yükleniyor...' : '📤 Bilgisayardan Video Yükle (.mp4)'}</span>
                <input type="file" accept="video/mp4,video/webm,video/mov" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. İSTATİSTİKLER (STATS) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
            <span>📊</span> 2. Sayısal Başarılar (İstatistikler)
          </h3>
          <button
            type="button"
            onClick={() => setStats([...stats, { num: '100+', label: emptyMultilang() }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni İstatistik Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((st, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">İstatistik #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => setStats(stats.filter((_, i) => i !== idx))}
                  className="text-xs text-red-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Rakam</label>
                  <input
                    type="text"
                    value={st.num || ''}
                    onChange={e => {
                      const copy = [...stats];
                      copy[idx] = { ...copy[idx], num: e.target.value };
                      setStats(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm font-bold bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Başlık ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={st.label?.[activeLang] || (typeof st.label === 'string' ? st.label : '')}
                    onChange={e => {
                      const copy = [...stats];
                      const curLabel = ensureMultilang(copy[idx].label);
                      copy[idx] = { ...copy[idx], label: { ...curLabel, [activeLang]: e.target.value } };
                      setStats(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. NEDEN BİZ (WHY US) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
            <span>💎</span> 3. Neden Biz? (Özellikler)
          </h3>
          <button
            type="button"
            onClick={() => setWhyUs([...whyUs, { icon: '⭐', title: emptyMultilang(), desc: emptyMultilang(), img: '/images/factory.jpg' }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni Özellik Ekle
          </button>
        </div>

        <div className="space-y-4">
          {whyUs.map((card, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Kart #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => setWhyUs(whyUs.filter((_, i) => i !== idx))}
                  className="text-xs text-red-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">İkon (Emoji)</label>
                  <input
                    type="text"
                    value={card.icon || ''}
                    onChange={e => {
                      const copy = [...whyUs];
                      copy[idx] = { ...copy[idx], icon: e.target.value };
                      setWhyUs(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Başlık ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={card.title?.[activeLang] || (typeof card.title === 'string' ? card.title : '')}
                    onChange={e => {
                      const copy = [...whyUs];
                      const curTitle = ensureMultilang(copy[idx].title);
                      copy[idx] = { ...copy[idx], title: { ...curTitle, [activeLang]: e.target.value } };
                      setWhyUs(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm bg-white font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Açıklama ({activeLang.toUpperCase()})</label>
                <textarea
                  value={card.desc?.[activeLang] || (typeof card.desc === 'string' ? card.desc : '')}
                  onChange={e => {
                    const copy = [...whyUs];
                    const curDesc = ensureMultilang(copy[idx].desc);
                    copy[idx] = { ...copy[idx], desc: { ...curDesc, [activeLang]: e.target.value } };
                    setWhyUs(copy);
                  }}
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Görsel Yolu</label>
                <input
                  type="text"
                  value={card.img || ''}
                  onChange={e => {
                    const copy = [...whyUs];
                    copy[idx] = { ...copy[idx], img: e.target.value };
                    setWhyUs(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-xs font-mono bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CTA BÖLÜMÜ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2 border-b pb-3">
          <span>📢</span> 4. Alt Çağrı (CTA) Bölümü
        </h3>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Başlık ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={ctaTitle[activeLang]}
            onChange={e => setCtaTitle({ ...ctaTitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Açıklama ({activeLang.toUpperCase()})</label>
          <textarea
            value={ctaDesc[activeLang]}
            onChange={e => setCtaDesc({ ...ctaDesc, [activeLang]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buton Metni ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={ctaButtonText[activeLang]}
              onChange={e => setCtaButtonText({ ...ctaButtonText, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buton Linki</label>
            <input
              type="text"
              value={ctaButtonLink}
              onChange={e => setCtaButtonLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. GALLERY SECTION EDITOR (Üretim ve Projelerimizden Kareler)
function GalleryEditor() {
  const { getSection, updateSectionData } = useData();
  const galleryData = getSection('home_gallery') || [];
  const [items, setItems] = useState<any[]>(Array.isArray(galleryData) ? galleryData : []);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        const newItems = urls.map(u => ({ src: u, alt: 'Üretim ve Proje Görseli' }));
        setItems([...items, ...newItems]);
      }
    } catch (err) {
      alert('Fotoğraf yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSectionData('home_gallery', items);
      setSavedMsg('Galeri başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">Üretim ve Projelerimizden Kareler (Galeri)</h2>
          <p className="text-xs text-gray-500 mt-1">Ana sayfada yer alan fotoğraf galerisini yönetin. Görselleri ekleyip kaldırabilirsiniz.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Galeriyi Kaydet'}
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-sm text-secondary-dark uppercase tracking-wider">Yeni Fotoğraflar Ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all text-center">
              <span className="text-3xl mb-1">📸</span>
              <span className="text-xs font-bold text-primary">{uploading ? 'Yükleniyor...' : 'Bilgisayardan Fotoğraf Seç & Yükle'}</span>
              <span className="text-[10px] text-gray-400 mt-1">Birden fazla görsel seçebilirsiniz (.jpg, .png, .webp)</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div className="flex flex-col justify-between space-y-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">veya Görsel URL'si ile Ekle</label>
              <input
                type="text"
                placeholder="Görsel URL'si (örn: /images/factory.jpg)"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Açıklama (Alt Metin)"
                value={newAlt}
                onChange={e => setNewAlt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (newUrl.trim()) {
                  setItems([...items, { src: newUrl.trim(), alt: newAlt.trim() || 'Galeri Fotoğrafı' }]);
                  setNewUrl('');
                  setNewAlt('');
                }
              }}
              className="w-full py-2 bg-secondary-dark text-white rounded-lg text-xs font-bold hover:bg-secondary transition-all"
            >
              + Listeye Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Current Gallery Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-secondary-dark uppercase tracking-wider">Galerideki Fotoğraflar ({items.length})</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
              <img src={getImageUrl(item.src)} alt={item.alt} className="w-full aspect-[4/3] object-cover" />
              <div className="p-2 space-y-1 bg-white">
                <input
                  type="text"
                  value={item.alt || ''}
                  onChange={e => {
                    const copy = [...items];
                    copy[idx] = { ...copy[idx], alt: e.target.value };
                    setItems(copy);
                  }}
                  placeholder="Fotoğraf Açıklaması"
                  className="w-full text-[11px] px-2 py-1 rounded border border-gray-200 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-md opacity-90 hover:opacity-100 hover:scale-105 transition-all text-xs"
                title="Kaldır"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. ABOUT SECTION EDITOR (Hakkımızda)
function AboutEditor() {
  const { getSection, updateSectionData } = useData();
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const aboutData = getSection('about_page') || {};
  const [heroTitle, setHeroTitle] = useState<Multilang>(ensureMultilang(aboutData.heroTitle));
  const [heroSubtitle, setHeroSubtitle] = useState<Multilang>(ensureMultilang(aboutData.heroSubtitle));
  const [historyBadge, setHistoryBadge] = useState<Multilang>(ensureMultilang(aboutData.historyBadge));
  const [historyTitle, setHistoryTitle] = useState<Multilang>(ensureMultilang(aboutData.historyTitle));
  const [historyP1, setHistoryP1] = useState<Multilang>(ensureMultilang(aboutData.historyP1));
  const [historyP2, setHistoryP2] = useState<Multilang>(ensureMultilang(aboutData.historyP2));
  const [factoryTitle, setFactoryTitle] = useState<Multilang>(ensureMultilang(aboutData.factoryTitle));
  const [factoryDesc, setFactoryDesc] = useState<Multilang>(ensureMultilang(aboutData.factoryDesc));
  const [factoryLocation, setFactoryLocation] = useState<Multilang>(ensureMultilang(aboutData.factoryLocation));
  const [factoryImage, setFactoryImage] = useState(aboutData.factoryImage || '/images/factory.jpg');
  const [visionTitle, setVisionTitle] = useState<Multilang>(ensureMultilang(aboutData.visionTitle));
  const [visionQuote, setVisionQuote] = useState<Multilang>(ensureMultilang(aboutData.visionQuote));
  const [bottomQuote, setBottomQuote] = useState<Multilang>(ensureMultilang(aboutData.bottomQuote));

  const [milestones, setMilestones] = useState<any[]>(Array.isArray(aboutData.milestones) ? aboutData.milestones : []);
  const [certificates, setCertificates] = useState<any[]>(Array.isArray(aboutData.certificates) ? aboutData.certificates : []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSectionData('about_page', {
        heroTitle,
        heroSubtitle,
        historyBadge,
        historyTitle,
        historyP1,
        historyP2,
        factoryTitle,
        factoryDesc,
        factoryLocation,
        factoryImage,
        visionTitle,
        visionQuote,
        bottomQuote,
        milestones,
        certificates,
      });
      setSavedMsg('Hakkımızda sayfası başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">Hakkımızda Sayfası Yönetimi</h2>
          <p className="text-xs text-gray-500 mt-1">Tarihçe, vizyon, fabrika bilgileri, zaman çizelgesi ve sertifikaları düzenleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      {/* Hero & Başlıklar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3">📖 Giriş ve Tarihçe Metinleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Başlık ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={heroTitle[activeLang]}
              onChange={e => setHeroTitle({ ...heroTitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarihçe Rozeti ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={historyBadge[activeLang]}
              onChange={e => setHistoryBadge({ ...historyBadge, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Alt Başlık ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={heroSubtitle[activeLang]}
            onChange={e => setHeroSubtitle({ ...heroSubtitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarihçe Ana Başlık ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={historyTitle[activeLang]}
            onChange={e => setHistoryTitle({ ...historyTitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarihçe Paragraf 1 ({activeLang.toUpperCase()})</label>
          <textarea
            value={historyP1[activeLang]}
            onChange={e => setHistoryP1({ ...historyP1, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarihçe Paragraf 2 ({activeLang.toUpperCase()})</label>
          <textarea
            value={historyP2[activeLang]}
            onChange={e => setHistoryP2({ ...historyP2, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Fabrika & Tesis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3">🏭 Fabrika ve Üretim Tesisi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fabrika Başlığı ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={factoryTitle[activeLang]}
              onChange={e => setFactoryTitle({ ...factoryTitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Konum / Lokasyon ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={factoryLocation[activeLang]}
              onChange={e => setFactoryLocation({ ...factoryLocation, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fabrika Açıklaması ({activeLang.toUpperCase()})</label>
          <textarea
            value={factoryDesc[activeLang]}
            onChange={e => setFactoryDesc({ ...factoryDesc, [activeLang]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fabrika Görsel Yolu</label>
          <input
            type="text"
            value={factoryImage}
            onChange={e => setFactoryImage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono outline-none"
          />
        </div>
      </div>

      {/* Vizyon & Sözler */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3">💡 Vizyon ve Vurgu Sözleri</h3>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vizyon Başlığı ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={visionTitle[activeLang]}
            onChange={e => setVisionTitle({ ...visionTitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vizyon Metni ({activeLang.toUpperCase()})</label>
          <textarea
            value={visionQuote[activeLang]}
            onChange={e => setVisionQuote({ ...visionQuote, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sayfa Altı Vurgu Sözü ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={bottomQuote[activeLang]}
            onChange={e => setBottomQuote({ ...bottomQuote, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm italic outline-none"
          />
        </div>
      </div>

      {/* Zaman Çizelgesi (Milestones) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark">⏳ Zaman Çizelgesi (Kilometre Taşları)</h3>
          <button
            type="button"
            onClick={() => setMilestones([...milestones, { year: '2024', title: emptyMultilang(), desc: emptyMultilang() }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni Dönüm Noktası Ekle
          </button>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Dönüm Noktası #{idx + 1}</span>
                <button type="button" onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))} className="text-xs text-red-600 hover:underline">Kaldır</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="Yıl (örn: 1974)"
                    value={m.year || ''}
                    onChange={e => {
                      const copy = [...milestones];
                      copy[idx] = { ...copy[idx], year: e.target.value };
                      setMilestones(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-xs font-bold bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder={`Başlık (${activeLang.toUpperCase()})`}
                    value={m.title?.[activeLang] || (typeof m.title === 'string' ? m.title : '')}
                    onChange={e => {
                      const copy = [...milestones];
                      const cur = ensureMultilang(copy[idx].title);
                      copy[idx] = { ...copy[idx], title: { ...cur, [activeLang]: e.target.value } };
                      setMilestones(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-xs bg-white font-semibold"
                  />
                </div>
              </div>
              <textarea
                placeholder={`Açıklama (${activeLang.toUpperCase()})`}
                value={m.desc?.[activeLang] || (typeof m.desc === 'string' ? m.desc : '')}
                onChange={e => {
                  const copy = [...milestones];
                  const cur = ensureMultilang(copy[idx].desc);
                  copy[idx] = { ...copy[idx], desc: { ...cur, [activeLang]: e.target.value } };
                  setMilestones(copy);
                }}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-xs bg-white resize-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. TELLI TERBIYE SECTION EDITOR
function TelliEditor() {
  const { getSection, updateSectionData } = useData();
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingWood, setUploadingWood] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const telliData = getSection('telli_terbiye_page') || {};
  const [heroTitle, setHeroTitle] = useState<Multilang>(ensureMultilang(telliData.heroTitle));
  const [heroSubtitle, setHeroSubtitle] = useState<Multilang>(ensureMultilang(telliData.heroSubtitle));
  const [heroImage, setHeroImage] = useState(telliData.heroImage || '/images/trellis-system.jpg');
  const [mainTitle, setMainTitle] = useState<Multilang>(ensureMultilang(telliData.mainTitle));
  const [mainDesc, setMainDesc] = useState<Multilang>(ensureMultilang(telliData.desc || telliData.mainDesc));
  const [mainDesc2, setMainDesc2] = useState<Multilang>(ensureMultilang(telliData.mainDesc2 || telliData.desc2));

  // Bileşenler (Büyük Görselli Kartlar)
  const [components, setComponents] = useState<any[]>(() => {
    const list = Array.isArray(telliData.components) ? telliData.components : [];
    return list.map(c => ({
      title: ensureMultilang(c.title),
      desc: ensureMultilang(c.desc),
      img: c.img || '/images/wooden-posts.jpg',
    }));
  });

  // Faydalar / Avantajlar
  const [benefits, setBenefits] = useState<any[]>(() => {
    const list = Array.isArray(telliData.benefits) ? telliData.benefits : [];
    return list.map(b => ({
      icon: b.icon || '🌱',
      text: ensureMultilang(b.text),
    }));
  });

  // Uygulama Alanları
  const [applications, setApplications] = useState<any[]>(() => {
    const list = Array.isArray(telliData.applications) ? telliData.applications : [];
    return list.map(a => ({
      icon: a.icon || '🍏',
      text: ensureMultilang(a.text || a.title),
    }));
  });

  // Ahşap Direk Özellikleri
  const woodInit = telliData.woodSpecs || {};
  const [woodTitle, setWoodTitle] = useState<Multilang>(ensureMultilang(woodInit.title));
  const [woodImage, setWoodImage] = useState(woodInit.image || '/images/wooden-posts.jpg');
  const [woodMaterials, setWoodMaterials] = useState<Record<string, string>>(() => {
    const res: Record<string, string> = { tr: '', en: '', es: '', ru: '' };
    LANGUAGES.forEach(l => {
      const arr = woodInit.materials?.map((m: any) => resolveLocalizedText(m, l.code)) || [];
      res[l.code] = arr.join('\n');
    });
    return res;
  });
  const [woodDimensions, setWoodDimensions] = useState<Record<string, string>>(() => {
    const res: Record<string, string> = { tr: '', en: '', es: '', ru: '' };
    LANGUAGES.forEach(l => {
      const arr = woodInit.dimensions?.map((d: any) => resolveLocalizedText(d, l.code)) || [];
      res[l.code] = arr.join('\n');
    });
    return res;
  });

  // Aksesuarlar (Küçük Fotoğraflı Kartlar)
  const [accessories, setAccessories] = useState<any[]>(() => {
    const list = Array.isArray(telliData.accessories) ? telliData.accessories : [];
    return list.map(a => ({
      name: ensureMultilang(a.name || a.title || a),
      img: a.img || '/images/wooden-posts.jpg',
    }));
  });

  // Galeri
  const [gallery, setGallery] = useState<string[]>(Array.isArray(telliData.gallery) ? telliData.gallery : [
    '/images/trellis-system.jpg',
    '/images/orchard-netting.jpg',
    '/images/wooden-posts.jpg',
    '/images/hero-bg.jpg',
  ]);

  // CTA
  const [ctaTitle, setCtaTitle] = useState<Multilang>(ensureMultilang(telliData.ctaTitle));
  const [ctaDesc, setCtaDesc] = useState<Multilang>(ensureMultilang(telliData.ctaDesc));
  const [ctaButtonText, setCtaButtonText] = useState<Multilang>(ensureMultilang(telliData.ctaButtonText));
  const [ctaPhone, setCtaPhone] = useState(telliData.ctaPhone || telliData.phone || '0545 479 05 85');

  // Component Modal State
  const [compModal, setCompModal] = useState<{
    isOpen: boolean;
    editIndex: number | null;
    title: Multilang;
    desc: Multilang;
    img: string;
    tabLang: LangCode;
    uploading: boolean;
  }>({
    isOpen: false,
    editIndex: null,
    title: emptyMultilang(),
    desc: emptyMultilang(),
    img: '/images/wooden-posts.jpg',
    tabLang: 'tr',
    uploading: false,
  });

  const openNewComponentModal = () => {
    setCompModal({
      isOpen: true,
      editIndex: null,
      title: emptyMultilang(),
      desc: emptyMultilang(),
      img: '/images/wooden-posts.jpg',
      tabLang: activeLang,
      uploading: false,
    });
  };

  const openEditComponentModal = (index: number) => {
    const target = components[index];
    if (!target) return;
    setCompModal({
      isOpen: true,
      editIndex: index,
      title: ensureMultilang(target.title),
      desc: ensureMultilang(target.desc),
      img: target.img || '/images/wooden-posts.jpg',
      tabLang: activeLang,
      uploading: false,
    });
  };

  const handleSaveComponentModal = () => {
    const hasAnyTitle = Boolean(
      compModal.title.tr?.trim() ||
      compModal.title.en?.trim() ||
      compModal.title.es?.trim() ||
      compModal.title.ru?.trim()
    );
    if (!hasAnyTitle) {
      alert('Lütfen en az bir dilde bileşen başlığı giriniz.');
      return;
    }
    const newComp = {
      title: compModal.title,
      desc: compModal.desc,
      img: compModal.img || '/images/wooden-posts.jpg',
    };

    if (compModal.editIndex !== null) {
      const copy = [...components];
      copy[compModal.editIndex] = newComp;
      setComponents(copy);
    } else {
      setComponents([...components, newComp]);
    }
    setCompModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setCompModal(prev => ({ ...prev, uploading: true }));
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        setCompModal(prev => ({ ...prev, img: urls[0] }));
      }
    } catch (err: any) {
      alert(err.message || 'Görsel yüklenemedi');
    } finally {
      setCompModal(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleComponentImgUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        const copy = [...components];
        copy[index].img = urls[0];
        setComponents(copy);
      }
    } catch (err) {
      alert('Görsel yüklenemedi');
    }
  };

  const handleAccessoryImgUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        const copy = [...accessories];
        copy[index].img = urls[0];
        setAccessories(copy);
      }
    } catch (err) {
      alert('Görsel yüklenemedi');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await uploadMediaFiles(Array.from(files));
      if (urls.length > 0) {
        setGallery([...gallery, ...urls]);
      }
    } catch (err) {
      alert('Görsel yüklenemedi');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Wood specs array parsing
      const formattedMaterials: any[] = [];
      const linesMat = (woodMaterials[activeLang] || woodMaterials.tr || '').split('\n').filter(s => s.trim());
      linesMat.forEach((_, lineIdx) => {
        const itemObj: any = {};
        LANGUAGES.forEach(l => {
          const lLines = (woodMaterials[l.code] || '').split('\n').filter(s => s.trim());
          itemObj[l.code] = lLines[lineIdx] || lLines[0] || '';
        });
        formattedMaterials.push(itemObj);
      });

      const formattedDims: any[] = [];
      const linesDims = (woodDimensions[activeLang] || woodDimensions.tr || '').split('\n').filter(s => s.trim());
      linesDims.forEach((_, lineIdx) => {
        const itemObj: any = {};
        LANGUAGES.forEach(l => {
          const lLines = (woodDimensions[l.code] || '').split('\n').filter(s => s.trim());
          itemObj[l.code] = lLines[lineIdx] || lLines[0] || '';
        });
        formattedDims.push(itemObj);
      });

      await updateSectionData('telli_terbiye_page', {
        heroTitle,
        heroSubtitle,
        heroImage,
        mainTitle,
        desc: mainDesc,
        mainDesc,
        mainDesc2,
        benefits,
        components,
        applications,
        woodSpecs: {
          title: woodTitle,
          image: woodImage,
          materials: formattedMaterials.length > 0 ? formattedMaterials : linesMat.map(m => ({ tr: m })),
          dimensions: formattedDims.length > 0 ? formattedDims : linesDims.map(d => ({ tr: d })),
        },
        accessories,
        gallery,
        ctaTitle,
        ctaDesc,
        ctaButtonText,
        ctaPhone,
        phone: ctaPhone,
      });
      setSavedMsg('Telli Terbiye Sistemi başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">🌱 Telli Terbiye Sistemi Yönetimi</h2>
          <p className="text-xs text-gray-500 mt-1">Sistem açıklamaları, büyük bileşen kartları, aksesuarlar, ahşap özellikleri ve galeriyi yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      {/* 1. HERO & GENEL BİLGİLER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3 flex items-center gap-2">
          <span>🎬</span> 1. Hero (Giriş) ve Genel Başlıklar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Başlık ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={heroTitle[activeLang]}
              onChange={e => setHeroTitle({ ...heroTitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Alt Başlık ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={heroSubtitle[activeLang]}
              onChange={e => setHeroSubtitle({ ...heroSubtitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Arka Plan Görseli</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={heroImage}
              onChange={e => setHeroImage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono outline-none"
            />
            <label className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-all shrink-0">
              <span>{uploadingHero ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={async e => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  setUploadingHero(true);
                  try {
                    const urls = await uploadMediaFiles(Array.from(files));
                    if (urls.length > 0) setHeroImage(urls[0]);
                  } catch (err) { alert('Hata'); }
                  finally { setUploadingHero(false); }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Açıklama Başlığı ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={mainTitle[activeLang]}
            onChange={e => setMainTitle({ ...mainTitle, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ana Açıklama Paragraf 1 ({activeLang.toUpperCase()})</label>
          <textarea
            value={mainDesc[activeLang]}
            onChange={e => setMainDesc({ ...mainDesc, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ana Açıklama Paragraf 2 (Opsiyonel) ({activeLang.toUpperCase()})</label>
          <textarea
            value={mainDesc2[activeLang]}
            onChange={e => setMainDesc2({ ...mainDesc2, [activeLang]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none focus:border-primary"
          />
        </div>
      </div>

      {/* 2. SİSTEM BİLEŞENLERİ (BÜYÜK GÖRSELLİ KARTLAR) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
              <span>🏗️</span> 2. Sistem Bileşenleri Kartları ({components.length} Kart)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Emprenyeli ahşap direk, çelik halat, dolu filesi, L profil gibi ana bileşen kartları.</p>
          </div>
          <button
            type="button"
            onClick={openNewComponentModal}
            className="text-xs bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Yeni Bileşen Ekle</span>
          </button>
        </div>

        {components.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500 mb-3">Henüz eklenmiş bir bileşen kartı bulunmuyor.</p>
            <button
              type="button"
              onClick={openNewComponentModal}
              className="text-xs bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-all"
            >
              + İlk Bileşeni Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((comp, idx) => (
              <div key={idx} className="p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-secondary-dark">
                      {resolveLocalizedText(comp.title, activeLang) || 'İsimsiz Bileşen'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditComponentModal(idx)}
                      className="text-xs text-primary hover:text-primary-dark font-bold px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all flex items-center gap-1"
                    >
                      <span>✏️</span> Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Bu bileşeni kaldırmak istediğinize emin misiniz?')) {
                          setComponents(components.filter((_, i) => i !== idx));
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-all"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>

                {/* Görsel ve Bilgi Özeti */}
                <div className="flex gap-3 items-center">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 relative shadow-2xs">
                    <img src={getImageUrl(comp.img)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {resolveLocalizedText(comp.title, activeLang) || '—'}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-snug">
                      {resolveLocalizedText(comp.desc, activeLang) || 'Açıklama belirtilmemiş'}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <label className="text-[11px] text-primary font-semibold hover:underline cursor-pointer">
                        Fotoğraf Değiştir
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleComponentImgUpload(idx, e)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => openEditComponentModal(idx)}
                        className="text-[11px] text-gray-500 hover:text-secondary-dark font-medium"
                      >
                        Tüm Dilleri Düzenle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. FAYDALAR / AVANTAJLAR (İKONLU KARTLAR) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
            <span>🛡️</span> 3. Sistemin Faydaları & Avantajları ({benefits.length} Fayda)
          </h3>
          <button
            type="button"
            onClick={() => setBenefits([...benefits, { icon: '✨', text: emptyMultilang() }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni Fayda Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {benefits.map((b, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-2 items-center">
              <input
                type="text"
                value={b.icon || '🌱'}
                onChange={e => {
                  const copy = [...benefits];
                  copy[idx].icon = e.target.value;
                  setBenefits(copy);
                }}
                className="w-10 px-1 py-1 text-center bg-white rounded border border-gray-200 text-base"
                title="İkon (Emoji)"
              />
              <input
                type="text"
                value={b.text?.[activeLang] || ''}
                onChange={e => {
                  const copy = [...benefits];
                  const cur = ensureMultilang(copy[idx].text);
                  copy[idx].text = { ...cur, [activeLang]: e.target.value };
                  setBenefits(copy);
                }}
                placeholder={`Fayda Metni (${activeLang.toUpperCase()})`}
                className="flex-1 px-2.5 py-1 text-xs font-medium bg-white rounded border border-gray-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-1.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. UYGULAMA ALANLARI */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
            <span>🍏</span> 4. Uygulama Alanları & Meyve Grupları ({applications.length} Alan)
          </h3>
          <button
            type="button"
            onClick={() => setApplications([...applications, { icon: '🍎', text: emptyMultilang() }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni Alan Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {applications.map((app, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-2 items-center">
              <input
                type="text"
                value={app.icon || '🍏'}
                onChange={e => {
                  const copy = [...applications];
                  copy[idx].icon = e.target.value;
                  setApplications(copy);
                }}
                className="w-10 px-1 py-1 text-center bg-white rounded border border-gray-200 text-base"
                title="İkon (Emoji)"
              />
              <input
                type="text"
                value={app.text?.[activeLang] || ''}
                onChange={e => {
                  const copy = [...applications];
                  const cur = ensureMultilang(copy[idx].text);
                  copy[idx].text = { ...cur, [activeLang]: e.target.value };
                  setApplications(copy);
                }}
                placeholder={`Uygulama Alanı (${activeLang.toUpperCase()})`}
                className="flex-1 px-2.5 py-1 text-xs font-semibold bg-white rounded border border-gray-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setApplications(applications.filter((_, i) => i !== idx))}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-1.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AHŞAP DİREK ÖZELLİKLERİ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3 flex items-center gap-2">
          <span>🪵</span> 5. Emprenyeli Ahşap Direk Teknik Özellikleri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bölüm Başlığı ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={woodTitle[activeLang]}
              onChange={e => setWoodTitle({ ...woodTitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Görsel Yolu & Yükleme</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={woodImage}
                onChange={e => setWoodImage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono outline-none"
              />
              <label className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-all shrink-0">
                <span>{uploadingWood ? '...' : 'Fotoğraf Seç'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async e => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    setUploadingWood(true);
                    try {
                      const urls = await uploadMediaFiles(Array.from(files));
                      if (urls.length > 0) setWoodImage(urls[0]);
                    } catch (err) { alert('Hata'); }
                    finally { setUploadingWood(false); }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Malzeme & İşlem Özellikleri (Her satıra bir özellik) ({activeLang.toUpperCase()})</label>
            <textarea
              value={woodMaterials[activeLang] || ''}
              onChange={e => setWoodMaterials({ ...woodMaterials, [activeLang]: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none resize-none font-sans"
              placeholder="Örn: Kestane, Kızılçam, Sarıçam ağaçları&#10;WBC Vakum-Basınç yöntemiyle emprenye&#10;Toprak altı 20+ yıl dayanım"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ölçü ve Ebatlar (Her satıra bir özellik) ({activeLang.toUpperCase()})</label>
            <textarea
              value={woodDimensions[activeLang] || ''}
              onChange={e => setWoodDimensions({ ...woodDimensions, [activeLang]: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none resize-none font-sans"
              placeholder="Örn: Kalınlık: Q6 - Q8 - Q10 - Q12&#10;Uzunluk: 2.50 mt - 4.50 mt&#10;Tepelik kova tipi şapka kanalları"
            />
          </div>
        </div>
      </div>

      {/* 6. AKSESUARLAR (KÜÇÜK FOTOĞRAFLI KARTLAR) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
              <span>🔩</span> 6. Telli Terbiye Aksesuarları ({accessories.length} Adet Mini Kart)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Sitede kompakt ve şık küçük fotoğraflı mini kartlar olarak sergilenir.</p>
          </div>
          <button
            type="button"
            onClick={() => setAccessories([...accessories, {
              name: emptyMultilang(),
              img: '/images/wooden-posts.jpg',
            }])}
            className="text-xs bg-primary text-white px-3.5 py-1.5 rounded-lg font-bold hover:bg-primary-dark transition-all shadow-sm"
          >
            + Yeni Aksesuar Kartı Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {accessories.map((acc, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 items-center relative group">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 relative">
                <img src={getImageUrl(acc.img)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  placeholder={`Aksesuar Adı (${activeLang.toUpperCase()})`}
                  value={acc.name?.[activeLang] || ''}
                  onChange={e => {
                    const copy = [...accessories];
                    const cur = ensureMultilang(copy[idx].name);
                    copy[idx].name = { ...cur, [activeLang]: e.target.value };
                    setAccessories(copy);
                  }}
                  className="w-full px-2.5 py-1 rounded border border-gray-200 text-xs font-bold bg-white outline-none focus:border-primary"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Görsel URL"
                    value={acc.img || ''}
                    onChange={e => {
                      const copy = [...accessories];
                      copy[idx].img = e.target.value;
                      setAccessories(copy);
                    }}
                    className="flex-1 px-2 py-0.5 rounded border border-gray-200 text-[10px] font-mono bg-white text-gray-500"
                  />
                  <label className="p-1 bg-white border border-gray-300 rounded text-[10px] font-bold text-gray-700 cursor-pointer hover:bg-gray-100 shrink-0" title="Fotoğraf Yükle">
                    <span>📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleAccessoryImgUpload(idx, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAccessories(accessories.filter((_, i) => i !== idx))}
                className="text-xs text-red-500 hover:text-red-700 font-bold p-1"
                title="Kaldır"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PROJE FOTOĞRAF GALERİSİ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark flex items-center gap-2">
            <span>📸</span> 7. Telli Terbiye Proje Fotoğraf Galerisi ({gallery.length} Fotoğraf)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gallery.map((imgUrl, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 aspect-video">
              <img src={getImageUrl(imgUrl)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full text-xs opacity-80 hover:opacity-100 shadow-md"
                title="Kaldır"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni görsel URL'si ekle (örn: /images/trellis.jpg)"
              value={newGalleryUrl}
              onChange={e => setNewGalleryUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (newGalleryUrl.trim()) {
                  setGallery([...gallery, newGalleryUrl.trim()]);
                  setNewGalleryUrl('');
                }
              }}
              className="px-4 py-2 bg-secondary-dark text-white rounded-lg text-xs font-semibold hover:bg-secondary"
            >
              URL Ekle
            </button>
          </div>
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-all">
            <span>{uploadingGallery ? 'Yükleniyor...' : '📤 Bilgisayardan Fotoğraf Yükle'}</span>
            <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" disabled={uploadingGallery} />
          </label>
        </div>
      </div>

      {/* 8. ALT ÇAĞRI (CTA) BÖLÜMÜ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3 flex items-center gap-2">
          <span>📢</span> 8. Sayfa Altı İletişim / Teklif Çağrısı (CTA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Başlık ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={ctaTitle[activeLang]}
              onChange={e => setCtaTitle({ ...ctaTitle, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon Numarası</label>
            <input
              type="text"
              value={ctaPhone}
              onChange={e => setCtaPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Açıklama ({activeLang.toUpperCase()})</label>
          <textarea
            value={ctaDesc[activeLang]}
            onChange={e => setCtaDesc({ ...ctaDesc, [activeLang]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buton Metni ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={ctaButtonText[activeLang]}
            onChange={e => setCtaButtonText({ ...ctaButtonText, [activeLang]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
          />
        </div>
      </div>

      {/* COMPONENT ADD / EDIT MODAL */}
      {compModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-xs">
                  🏗️
                </div>
                <div>
                  <h3 className="text-base font-bold text-secondary-dark">
                    {compModal.editIndex !== null ? 'Bileşen Kartını Düzenle' : 'Yeni Bileşen Kartı Ekle'}
                  </h3>
                  <p className="text-xs text-gray-500">Telli Terbiye sistemine ait donanım ve bileşen bilgilerini girin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompModal(prev => ({ ...prev, isOpen: false }))}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Görsel Yükleme Bölümü */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Bileşen Fotoğrafı</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="w-32 h-28 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 relative shadow-sm">
                    <img src={getImageUrl(compModal.img)} alt="" className="w-full h-full object-cover" />
                    {compModal.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                        <span className="animate-spin text-base">⏳</span>
                        <span>Yükleniyor...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex flex-wrap gap-2">
                      <label className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-primary-dark transition-all shadow-sm flex items-center gap-1.5">
                        <span>📷 Fotoğraf Seç & Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalImgUpload}
                          className="hidden"
                          disabled={compModal.uploading}
                        />
                      </label>
                      {compModal.img && compModal.img !== '/images/wooden-posts.jpg' && (
                        <button
                          type="button"
                          onClick={() => setCompModal(prev => ({ ...prev, img: '/images/wooden-posts.jpg' }))}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all"
                        >
                          Varsayılan Görsel
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Veya Görsel URL / Yolu:</label>
                      <input
                        type="text"
                        value={compModal.img}
                        onChange={e => setCompModal(prev => ({ ...prev, img: e.target.value }))}
                        placeholder="/images/wooden-posts.jpg veya https://..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-mono outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Çoklu Dil Başlık ve Açıklama */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-600 uppercase">İçerik Dili ({compModal.tabLang.toUpperCase()})</label>
                  <div className="flex gap-1">
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setCompModal(prev => ({ ...prev, tabLang: l.code }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          compModal.tabLang === l.code
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Bileşen Başlığı ({compModal.tabLang.toUpperCase()}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={compModal.title[compModal.tabLang] || ''}
                      onChange={e =>
                        setCompModal(prev => ({
                          ...prev,
                          title: { ...prev.title, [prev.tabLang]: e.target.value },
                        }))
                      }
                      placeholder="Örn: Emprenyeli Ahşap Direk, Dolu Filesi, Çelik Halat..."
                      className="w-full px-3.5 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white outline-none focus:border-primary shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Bileşen Açıklaması ({compModal.tabLang.toUpperCase()})
                    </label>
                    <textarea
                      value={compModal.desc[compModal.tabLang] || ''}
                      onChange={e =>
                        setCompModal(prev => ({
                          ...prev,
                          desc: { ...prev.desc, [prev.tabLang]: e.target.value },
                        }))
                      }
                      rows={4}
                      placeholder="Bileşene ait teknik özellikler, malzeme tipi, montaj detayları ve dayanım bilgileri..."
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 bg-white outline-none resize-none focus:border-primary shadow-2xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCompModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveComponentModal}
                disabled={compModal.uploading}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>💾</span>
                <span>{compModal.editIndex !== null ? 'Değişikliği Kaydet' : 'Bileşeni Listeye Ekle'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. SERVICES MARQUEE SECTION EDITOR (Hizmet Alanları)
function ServicesEditor() {
  const { getSection, updateSectionData } = useData();
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const servicesData = getSection('services_marquee') || [];
  const [items, setItems] = useState<any[]>(Array.isArray(servicesData) ? servicesData : []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSectionData('services_marquee', items);
      setSavedMsg('Hizmet alanları başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">Hizmet Alanları & Kurumlar (Akan Bant)</h2>
          <p className="text-xs text-gray-500 mt-1">Ana sayfa ve sayfa altlarında akan logolar/kurumlar bandını düzenleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-sm text-secondary-dark uppercase tracking-wider">Kurum ve Alan Listesi</h3>
          <button
            type="button"
            onClick={() => setItems([...items, { icon: '🏛️', name: emptyMultilang() }])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Yeni Hizmet Alanı Ekle
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
              <input
                type="text"
                value={item.icon || '🏛️'}
                onChange={e => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], icon: e.target.value };
                  setItems(copy);
                }}
                className="w-12 px-2 py-1.5 text-center bg-white rounded-lg border border-gray-200 text-sm outline-none"
                placeholder="İkon"
              />
              <input
                type="text"
                value={item.name?.[activeLang] || (typeof item.name === 'string' ? item.name : '')}
                onChange={e => {
                  const copy = [...items];
                  const cur = ensureMultilang(copy[idx].name);
                  copy[idx] = { ...copy[idx], name: { ...cur, [activeLang]: e.target.value } };
                  setItems(copy);
                }}
                placeholder={`Kurum Adı (${activeLang.toUpperCase()}) - Örn: İl Tarım ve Orman Genel Müdürlüğü`}
                className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm font-semibold outline-none"
              />
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. FOOTER SECTION EDITOR (Altbilgi & İletişim)
function FooterEditor() {
  const { getSection, updateSectionData } = useData();
  const [activeLang, setActiveLang] = useState<LangCode>('tr');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const footerData = getSection('footer_settings') || {};
  const [aboutText, setAboutText] = useState<Multilang>(ensureMultilang(footerData.aboutText));
  const [address, setAddress] = useState<Multilang>(ensureMultilang(footerData.address));
  const [workingHours, setWorkingHours] = useState<Multilang>(ensureMultilang(footerData.workingHours));
  const [copyright, setCopyright] = useState<Multilang>(ensureMultilang(footerData.copyrightText || footerData.copyright));
  const [legalCompany, setLegalCompany] = useState(footerData.legalCompany || 'FMT Makina Mühendislik İth. İhr. San. Tic. Ltd. Şti.');

  // Normalize phones safely into array of { label, number }
  const [phones, setPhones] = useState<{ label: string; number: string }[]>(() => {
    const raw = footerData.phones;
    if (Array.isArray(raw)) {
      return raw.map((item: any) => {
        if (typeof item === 'string') {
          return { label: '', number: item };
        }
        if (typeof item === 'object' && item !== null) {
          return {
            label: item.label || '',
            number: item.number || item.tel || '',
          };
        }
        return { label: '', number: '' };
      });
    }
    return [
      { label: 'Bilal METLİ', number: '0545 479 05 85' },
      { label: 'Fatih METLİ', number: '0531 345 73 04' },
      { label: 'Abdullah METLİ', number: '0535 616 49 41' },
    ];
  });

  const [emails, setEmails] = useState<string[]>(Array.isArray(footerData.emails) ? footerData.emails : ['metliticaret@hotmail.com', 'fatihmakinamuhendislik@hotmail.com']);
  const [certificates, setCertificates] = useState<string[]>(Array.isArray(footerData.certificates) ? footerData.certificates : ['ISO 9001:2015', 'TSE EN 10223-1', 'TSE EN 10223-6']);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Format phones for clean storage
      const formattedPhones = phones
        .filter(p => p.number.trim())
        .map(p => ({
          label: p.label.trim(),
          number: p.number.trim(),
          tel: p.number.replace(/\s+/g, ''),
        }));

      await updateSectionData('footer_settings', {
        ...footerData,
        aboutText,
        address,
        workingHours,
        copyright,
        copyrightText: copyright.tr || 'METLİ Ticaret & FMT Makina Mühendislik. Tüm Hakları Saklıdır.',
        legalCompany,
        phones: formattedPhones,
        emails: emails.filter(e => e.trim()),
        certificates: certificates.filter(c => c.trim()),
      });
      setSavedMsg('Altbilgi ve iletişim ayarları başarıyla kaydedildi!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-secondary-dark">Altbilgi & İletişim Bilgileri (Footer)</h2>
          <p className="text-xs text-gray-500 mt-1">Telefon numaraları, isim etiketleri, e-postalar, adres, şirket tanıtımı ve sertifikaları düzenleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">{savedMsg}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <LangSelector activeLang={activeLang} onChange={setActiveLang} />

      {/* Şirket Tanıtım Metni & Telif */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3">🏢 Şirket Tanıtımı & Metinler</h3>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Footer Şirket Tanıtım Metni ({activeLang.toUpperCase()})</label>
          <textarea
            value={aboutText[activeLang]}
            onChange={e => setAboutText({ ...aboutText, [activeLang]: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adres Metni ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={address[activeLang]}
              onChange={e => setAddress({ ...address, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Çalışma Saatleri ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={workingHours[activeLang]}
              onChange={e => setWorkingHours({ ...workingHours, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telif Hakkı (Copyright) Metni ({activeLang.toUpperCase()})</label>
            <input
              type="text"
              value={copyright[activeLang]}
              onChange={e => setCopyright({ ...copyright, [activeLang]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Resmi Şirket Unvanı</label>
            <input
              type="text"
              value={legalCompany}
              onChange={e => setLegalCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary font-medium"
            />
          </div>
        </div>
      </div>

      {/* Telefon ve E-postalar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-base text-secondary-dark border-b pb-3">📞 İletişim Numaraları & E-postalar</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Telefonlar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase">Telefon Numaraları ({phones.length})</label>
              <button
                type="button"
                onClick={() => setPhones([...phones, { label: '', number: '' }])}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold hover:bg-primary/20"
              >
                + Yeni Telefon Ekle
              </button>
            </div>
            {phones.map((p, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Telefon #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setPhones(phones.filter((_, i) => i !== idx))}
                    className="text-xs text-red-600 hover:text-red-800 font-bold"
                  >
                    Sil
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="İsim / Birim (örn: Bilal METLİ)"
                      value={p.label || ''}
                      onChange={e => {
                        const copy = [...phones];
                        copy[idx].label = e.target.value;
                        setPhones(copy);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-primary font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Numara (örn: 0545 479 05 85)"
                      value={p.number || ''}
                      onChange={e => {
                        const copy = [...phones];
                        copy[idx].number = e.target.value;
                        setPhones(copy);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-primary font-mono font-bold text-secondary-dark"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* E-postalar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase">E-posta Adresleri ({emails.length})</label>
              <button
                type="button"
                onClick={() => setEmails([...emails, ''])}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold hover:bg-primary/20"
              >
                + Yeni E-posta Ekle
              </button>
            </div>
            {emails.map((m, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="email"
                  placeholder="örn: info@metliticaret.com"
                  value={m}
                  onChange={e => {
                    const copy = [...emails];
                    copy[idx] = e.target.value;
                    setEmails(copy);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none font-mono bg-white focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setEmails(emails.filter((_, i) => i !== idx))}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sertifika Rozetleri */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-secondary-dark">🛡️ Footer Sertifika Rozetleri</h3>
          <button
            type="button"
            onClick={() => setCertificates([...certificates, ''])}
            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20"
          >
            + Sertifika Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {certificates.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <input
                type="text"
                placeholder="Örn: ISO 9001:2015"
                value={cert}
                onChange={e => {
                  const copy = [...certificates];
                  copy[idx] = e.target.value;
                  setCertificates(copy);
                }}
                className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-bold outline-none focus:border-primary text-secondary-dark"
              />
              <button
                type="button"
                onClick={() => setCertificates(certificates.filter((_, i) => i !== idx))}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded bg-red-50 hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== MAIN ADMIN CONTAINER =====
type AdminTab =
  | 'dashboard'
  | 'homepage'
  | 'gallery'
  | 'about'
  | 'telli'
  | 'services'
  | 'footer'
  | 'products'
  | 'blog'
  | 'users';

export default function Admin() {
  const data = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingUserPass, setEditingUserPass] = useState<{ id: string; name: string } | null>(null);
  const [newPass, setNewPass] = useState('');

  if (!data.isLoggedIn) {
    return <AdminLogin onLogin={data.login} />;
  }

  const navSections = [
    {
      group: 'Ana Yapı & Sayfalar',
      items: [
        { key: 'dashboard' as AdminTab, label: 'Dashboard', icon: '📊' },
        { key: 'homepage' as AdminTab, label: 'Ana Sayfa (Hero & Video)', icon: '🏠' },
        { key: 'gallery' as AdminTab, label: 'Üretim & Galeri', icon: '📸' },
        { key: 'about' as AdminTab, label: 'Hakkımızda', icon: '🏢' },
        { key: 'telli' as AdminTab, label: 'Telli Terbiye Sistemi', icon: '🌱' },
        { key: 'services' as AdminTab, label: 'Hizmet Alanları (Bant)', icon: '🏛️' },
        { key: 'footer' as AdminTab, label: 'Altbilgi & İletişim', icon: '📞' },
      ],
    },
    {
      group: 'Katalog & İçerik',
      items: [
        { key: 'products' as AdminTab, label: 'Ürünler', icon: '📦' },
        { key: 'blog' as AdminTab, label: 'Blog & Projeler', icon: '📝' },
      ],
    },
    {
      group: 'Sistem',
      items: [{ key: 'users' as AdminTab, label: 'Admin Kullanıcılar', icon: '👥' }],
    },
  ];

  const handleSaveProduct = async (formData: FormData) => {
    try {
      const id = formData.get('id') as string;
      if (id) {
        await api.updateProduct(Number(id), formData);
      } else {
        await api.createProduct(formData);
      }
      await data.refreshAllData();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Ürün kaydedilirken hata oluştu:', err);
      alert('Ürün kaydedilemedi. Detay için konsolu kontrol edin.');
    }
  };

  const handleSavePost = async (formData: FormData) => {
    try {
      const id = formData.get('id') as string;
      if (id) {
        await api.updateBlogPost(Number(id), formData);
      } else {
        await api.createBlogPost(formData);
      }
      await data.refreshAllData();
      setShowBlogForm(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Blog yazısı kaydedilirken hata oluştu:', err);
      alert('Blog yazısı kaydedilemedi. Detay için konsolu kontrol edin.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.password && newUser.name) {
      try {
        await api.createAdminUser(newUser);
        setNewUser({ username: '', password: '', name: '' });
        alert('Yeni admin eklendi');
        await data.refreshAllData();
      } catch (err) {
        alert('Hata oluştu');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 w-72 bg-secondary-dark text-white flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        <div>
          {/* Logo Badge */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="font-black text-primary tracking-wider text-sm">METLİ</span>
                <span className="text-white/40 text-xs">|</span>
                <span className="font-black text-accent tracking-wider text-xs">FMT</span>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-white truncate">Yönetim Paneli</p>
                <p className="text-[11px] text-gray-400 truncate">{data.currentUser?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
            {navSections.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{group.group}</p>
                {group.items.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all"
          >
            <span>🌐</span> Siteyi Görüntüle
          </a>
          <button
            onClick={() => {
              if (data.logout) data.logout();
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              sessionStorage.clear();
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/20 transition-all"
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200/80 sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-secondary-dark capitalize">
                {navSections.flatMap(g => g.items).find(t => t.key === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-gray-400">Veritabanı MySQL senkronizasyonu aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MySQL Bağlantısı Canlı
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Admin: <span className="font-bold text-secondary-dark">{data.currentUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Toplam Ürün', value: data.products.length, icon: '📦', color: 'from-primary to-primary-dark', sub: 'Yayında' },
                  { label: 'Blog & Projeler', value: data.blogPosts.length, icon: '📝', color: 'from-blue-600 to-indigo-700', sub: 'Yayınlandı' },
                  { label: 'Yönetilebilir Bölüm', value: '7 Bölüm', icon: '⚙️', color: 'from-emerald-600 to-teal-700', sub: 'MySQL Tabanlı' },
                  { label: 'Sistem Yöneticisi', value: data.adminUsers.length, icon: '👥', color: 'from-purple-600 to-violet-800', sub: 'Aktif Kullanıcı' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs font-semibold text-white/80">{stat.label}</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
                        <p className="text-[10px] text-white/60 mt-1 font-medium">{stat.sub}</p>
                      </div>
                      <span className="text-4xl opacity-40">{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hızlı Erişim Kartları */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Hızlı Düzenleme Menüsü</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { tab: 'homepage' as AdminTab, title: 'Ana Sayfa & Hero Videosu', desc: 'Hero başlığı, video oynatma listesi ve istatistikler', icon: '🏠' },
                    { tab: 'gallery' as AdminTab, title: 'Üretim & Proje Galerisi', desc: 'Ana sayfa fotoğraf galerisini güncelle', icon: '📸' },
                    { tab: 'about' as AdminTab, title: 'Hakkımızda Sayfası', desc: 'Tarihçe, vizyon, fabrika bilgileri ve zaman çizelgesi', icon: '🏢' },
                    { tab: 'telli' as AdminTab, title: 'Telli Terbiye Sistemi', desc: 'Sistem avantajları, bileşenler ve küçük resimli aksesuarlar', icon: '🌱' },
                    { tab: 'services' as AdminTab, title: 'Hizmet Alanları (Bant)', desc: 'İl Tarım ve Orman Genel Müdürlüğü gibi kurumları yönet', icon: '🏛️' },
                    { tab: 'footer' as AdminTab, title: 'Altbilgi & İletişim', desc: 'Telefonlar, e-postalar, adres ve hızlı bağlantılar', icon: '📞' },
                    { tab: 'products' as AdminTab, title: 'Ürün Kataloğu', desc: 'Yeni ürünler ekle, teknik özellikleri ve fotoğrafları düzenle', icon: '📦' },
                    { tab: 'blog' as AdminTab, title: 'Blog & Projeler', desc: 'Yeni yazılar, çoklu fotoğraf yükleme ve kapak seçimi', icon: '📝' },
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(card.tab)}
                      className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-left flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                        {card.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-secondary-dark group-hover:text-primary transition-colors">{card.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. HOMEPAGE */}
          {activeTab === 'homepage' && <HomeEditor />}

          {/* 3. GALLERY */}
          {activeTab === 'gallery' && <GalleryEditor />}

          {/* 4. ABOUT */}
          {activeTab === 'about' && <AboutEditor />}

          {/* 5. TELLI TERBIYE */}
          {activeTab === 'telli' && <TelliEditor />}

          {/* 6. SERVICES */}
          {activeTab === 'services' && <ServicesEditor />}

          {/* 7. FOOTER */}
          {activeTab === 'footer' && <FooterEditor />}

          {/* 8. PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-secondary-dark">Ürün Kataloğu</h2>
                  <p className="text-xs text-gray-500 mt-1">{data.products.length} adet kayıtlı ürün listeleniyor.</p>
                </div>
                <button
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  <span>+</span> Yeni Ürün Ekle
                </button>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-secondary-dark mb-4">{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                  <ProductForm
                    product={editingProduct || undefined}
                    onSave={handleSaveProduct}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/75 text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Ürün</th>
                        <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Kategori</th>
                        <th className="px-5 py-3.5 text-center font-semibold text-xs uppercase tracking-wider">Öne Çıkan</th>
                        <th className="px-5 py-3.5 text-right font-semibold text-xs uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3.5">
                              <span className="text-2xl w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">{product.icon}</span>
                              <div>
                                <p className="font-bold text-secondary-dark">{resolveLocalizedText(product.title, 'tr')}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{resolveLocalizedText(product.description, 'tr')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">
                              {resolveLocalizedText(product.category, 'tr')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {product.is_featured ? (
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
                                ★ Evet
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowProductForm(true);
                                }}
                                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                                    try {
                                      await api.deleteProduct(Number(product.id));
                                      await data.refreshAllData();
                                    } catch (e) {
                                      alert('Silinirken hata oluştu');
                                    }
                                  }
                                }}
                                className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 9. BLOG & PROJELER */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-secondary-dark">Blog & Projeler Yönetimi</h2>
                  <p className="text-xs text-gray-500 mt-1">{data.blogPosts.length} adet yazı ve proje kaydı bulunuyor.</p>
                </div>
                <button
                  onClick={() => {
                    setShowBlogForm(true);
                    setEditingPost(null);
                  }}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  <span>+</span> Yeni Yazı / Proje Ekle
                </button>
              </div>

              {showBlogForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-secondary-dark mb-4">{editingPost ? 'Yazı Düzenle' : 'Yeni Blog Yazısı / Proje'}</h3>
                  <BlogForm
                    post={editingPost || undefined}
                    onSave={handleSavePost}
                    onCancel={() => {
                      setShowBlogForm(false);
                      setEditingPost(null);
                    }}
                  />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/75 text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Başlık</th>
                        <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Kategori</th>
                        <th className="px-5 py-3.5 text-center font-semibold text-xs uppercase tracking-wider">Fotoğraflar</th>
                        <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Tarih</th>
                        <th className="px-5 py-3.5 text-right font-semibold text-xs uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.blogPosts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-bold text-secondary-dark">{resolveLocalizedText(post.title, 'tr')}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{resolveLocalizedText(post.excerpt, 'tr')}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">
                              {resolveLocalizedText(post.category, 'tr')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                              📷 {post.images?.length || 0} adet
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-gray-500">{post.date}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setShowBlogForm(true);
                                }}
                                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Silmek istediğinize emin misiniz?')) {
                                    try {
                                      await api.deleteBlogPost(Number(post.id));
                                      await data.refreshAllData();
                                    } catch (e) {
                                      alert('Hata');
                                    }
                                  }
                                }}
                                className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-secondary-dark mb-4">Yeni Admin Ekle</h3>
                <form onSubmit={handleAddUser} className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Şifre</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Ekle
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Ad Soyad</th>
                      <th className="px-5 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">Kullanıcı Adı</th>
                      <th className="px-5 py-3.5 text-right font-semibold text-xs uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.adminUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-bold text-secondary-dark">{user.name}</td>
                        <td className="px-5 py-4 text-gray-500 font-mono text-xs">{user.username}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setEditingUserPass(user);
                                setNewPass('');
                              }}
                              className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                            >
                              Şifre Değiştir
                            </button>
                            {data.adminUsers.length > 1 && (
                              <button
                                onClick={async () => {
                                  if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
                                    try {
                                      await api.deleteAdminUser(Number(user.id));
                                      await data.refreshAllData();
                                    } catch (e) {
                                      alert('Hata');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Change Password Modal */}
      {editingUserPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-base font-bold text-secondary-dark">{editingUserPass.name} - Şifre Değiştir</h3>
            <input
              type="password"
              placeholder="Yeni Şifre"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-all"
                onClick={async () => {
                  if (newPass) {
                    try {
                      await api.changePassword(Number(editingUserPass.id), newPass);
                      setEditingUserPass(null);
                      setNewPass('');
                      alert('Şifre başarıyla güncellendi');
                    } catch (err) {
                      console.error('Şifre değiştirme hatası:', err);
                      alert('Şifre değiştirilemedi.');
                    }
                  }
                }}
              >
                Güncelle
              </button>
              <button
                className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-300 transition-all"
                onClick={() => {
                  setEditingUserPass(null);
                  setNewPass('');
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}