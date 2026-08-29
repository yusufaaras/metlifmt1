import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslatedProducts, resolveLocalizedText } from '@/hooks/useTranslatedData';
import { getImageUrl } from '@/services/api';
import { useData, type Product, type BlogPost, type Multilang } from '@/context/DataContext';

// EKSİK OLAN VE EKLEMENİZ GEREKEN SATIR:
import * as api from '@/services/api';

const fallbackProductImages: Record<string, string> = {
  '1': '/images/barbed-wire.jpg', '2': '/images/fence-wire.jpg', '3': '/images/wooden-posts.jpg',
  '4': '/images/l-profile.jpg', '5': '/images/razor-wire.jpg', '6': '/images/fence-wire.jpg',
  '7': '/images/fence-wire.jpg', '8': '/images/fence-wire.jpg', '9': '/images/trellis-system.jpg',
  '10': '/images/trellis-system.jpg', '11': '/images/l-profile.jpg', '12': '/images/l-profile.jpg',
  '13': '/images/orchard-netting.jpg', '14': '/images/wooden-posts.jpg', '15': '/images/l-profile.jpg',
};

// Çoklu dil JSON string yapısını güvenli bir şekilde çözen yardımcı fonksiyon
const getLocalizedText = (textValue: any, currentLang: string = 'tr'): string => {
  return resolveLocalizedText(textValue, currentLang);
};

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
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">MT</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-dark">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">METLİ Ticaret & FMT Makina</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50">
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

  // Kategori çoklu dilden çıkartıldı, düz string key yapıldı.
  const [category, setCategory] = useState<string>(() => {
    if (!product?.category) return 'wire';
    return getLocalizedText(product.category, 'tr'); // Eğer eski verilerden JSON kaldıysa temiz string'e indirger
  });

  const [icon, setIcon] = useState(product?.icon || '🔗');

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
    formData.append('category', category); // Veritabanına düz string gider
    formData.append('icon', icon);

    const formattedSpecs: any = {};
    LANGUAGES.forEach(l => {
      formattedSpecs[l.code] = specs[l.code].split('\n').filter(s => s.trim());
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
      {/* Language Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeLang === l.code ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>{l.flag}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        ))}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İkon (Emoji)</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yeni Görseller Ekle</label>
          <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
        </div>
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yüklü Görseller (İlki kapak görselidir)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary shadow-md' : 'border-gray-100'}`}>
                <img src={getImageUrl(img)} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  {i !== 0 && (
                    <button type="button" onClick={() => {
                      const copy = [...existingImages];
                      const [sel] = copy.splice(i, 1);
                      setExistingImages([sel, ...copy]);
                    }} className="p-1 bg-primary text-white rounded text-[8px] font-bold">Kapak Yap</button>
                  )}
                  <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))} className="p-1 bg-red-500 text-white rounded text-[8px] font-bold">Sil</button>
                </div>
                {i === 0 && <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1 rounded font-bold">KAPAK</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Kaydet</button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">İptal</button>
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
      {/* Language Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeLang === l.code ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>{l.flag}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        ))}
      </div>

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
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yeni Görseller Ekle</label>
        <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yüklü Görseller (İlki kapak görselidir)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className={`relative rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary shadow-md' : 'border-gray-100'}`}>
                <img src={getImageUrl(img)} alt="" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  {i !== 0 && (
                    <button type="button" onClick={() => {
                      const copy = [...existingImages];
                      const [sel] = copy.splice(i, 1);
                      setExistingImages([sel, ...copy]);
                    }} className="p-1 bg-primary text-white rounded text-[8px] font-bold">Kapak Yap</button>
                  )}
                  <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))} className="p-1 bg-red-500 text-white rounded text-[8px] font-bold">Sil</button>
                </div>
                {i === 0 && <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1 rounded font-bold">KAPAK</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Kaydet</button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">İptal</button>
      </div>
    </form>
  );
}

// ===== MAIN ADMIN =====
type AdminTab = 'dashboard' | 'products' | 'blog' | 'users';

export default function Admin() {
  const data = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingUserPass, setEditingUserPass] = useState<{ id: string, name: string } | null>(null);
  const [newPass, setNewPass] = useState('');

  if (!data.isLoggedIn) {
    return <AdminLogin onLogin={data.login} />;
  }

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'products', label: 'Ürünler', icon: '📦' },
    { key: 'blog', label: 'Blog', icon: '📝' },
    { key: 'users', label: 'Kullanıcılar', icon: '👥' },
  ];

  const handleSaveProduct = async (formData: FormData) => {
    try {
      const id = formData.get('id') as string;
      if (id) {
        // api.api... karmaşasını önlemek için doğrudan servis metodunu çağırıyoruz
        await api.updateProduct(Number(id), formData);
      } else {
        await api.createProduct(formData);
      }
      window.location.reload();
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
      window.location.reload();
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
        window.location.reload();
      } catch (err) { alert('Hata oluştu'); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-secondary-dark text-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <div>
              <p className="font-bold text-sm">Admin Panel</p>
              <p className="text-xs text-gray-400">{data.currentUser?.name}</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => {
              // Önce Context içerisindeki logout state'ini tetikle
              if (data.logout) data.logout();

              // Tarayıcı belleğindeki jwt token ve kullanıcı verilerini temizle
              localStorage.removeItem('token');
              localStorage.removeItem('user'); // Varsa kullanıcı verisi
              sessionStorage.clear(); // Session storage kullanılıyorsa temizle

              // Sayfayı yönlendirerek state'lerin ve hafızanın sıfırlanmasını sağla
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all"
          >
            <span>🚪</span> Çıkış Yap
          </button>
          <a href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 transition-all mt-1">
            <span>🌐</span> Siteye Dön
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-lg font-bold text-secondary-dark">{tabs.find(t => t.key === activeTab)?.label}</h1>
          </div>
          <div className="text-sm text-gray-500">Hoş geldiniz, {data.currentUser?.name}</div>
        </header>

        <div className="p-4 md:p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Toplam Ürün', value: data.products.length, icon: '📦', color: 'from-primary to-primary-dark' },
                  { label: 'Blog Yazısı', value: data.blogPosts.length, icon: '📝', color: 'from-blue-500 to-blue-700' },
                  { label: 'Admin Kullanıcı', value: data.adminUsers.length, icon: '👥', color: 'from-purple-500 to-purple-700' },
                  { label: 'Yıllık Tecrübe', value: '50+', icon: '🏆', color: 'from-accent to-accent-light' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <span className="text-4xl opacity-50">{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS TABLO LİSTESİ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{data.products.length} ürün</p>
                <button
                  onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Yeni Ürün
                </button>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-secondary-dark mb-4">{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                  <ProductForm product={editingProduct || undefined} onSave={handleSaveProduct} onCancel={() => { setShowProductForm(false); setEditingProduct(null); }} />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Ürün</th>
                        <th className="px-4 py-3 text-left">Kategori Key</th>
                        <th className="px-4 py-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{product.icon}</span>
                              <div>
                                <p className="font-medium text-secondary-dark">{getLocalizedText(product.title, 'tr')}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{getLocalizedText(product.description, 'tr')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-mono">{getLocalizedText(product.category, 'tr')}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingProduct(product); setShowProductForm(true); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Düzenle</button>
                              <button onClick={async () => { if (confirm('Silmek istediğinize emin misiniz?')) { try { await api.deleteProduct(Number(product.id)); window.location.reload(); } catch (e) { alert('Hata'); } } }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
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

          {/* BLOG TABLO LİSTESİ */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{data.blogPosts.length} yazı</p>
                <button
                  onClick={() => { setShowBlogForm(true); setEditingPost(null); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Yeni Yazı
                </button>
              </div>

              {showBlogForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-secondary-dark mb-4">{editingPost ? 'Yazı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                  <BlogForm post={editingPost || undefined} onSave={handleSavePost} onCancel={() => { setShowBlogForm(false); setEditingPost(null); }} />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Başlık</th>
                        <th className="px-4 py-3 text-left">Kategori</th>
                        <th className="px-4 py-3 text-left">Tarih</th>
                        <th className="px-4 py-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-secondary-dark">{getLocalizedText(post.title, 'tr')}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{getLocalizedText(post.excerpt, 'tr')}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{getLocalizedText(post.category, 'tr')}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{post.date}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingPost(post); setShowBlogForm(true); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Düzenle</button>
                              <button onClick={async () => { if (confirm('Silmek istediğinize emin misiniz?')) { try { await api.deleteBlogPost(Number(post.id)); window.location.reload(); } catch (e) { alert('Hata'); } } }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
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

          {/* USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-secondary-dark mb-4">Yeni Admin Ekle</h3>
                <form onSubmit={handleAddUser} className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ad Soyad</label>
                    <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kullanıcı Adı</label>
                    <input type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Şifre</label>
                    <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Ekle</button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Ad Soyad</th>
                      <th className="px-4 py-3 text-left">Kullanıcı Adı</th>
                      <th className="px-4 py-3 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-secondary-dark">{user.name}</td>
                        <td className="px-4 py-3 text-gray-500">{user.username}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setEditingUserPass(user); setNewPass(''); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Şifre Değiştir</button>
                            {data.adminUsers.length > 1 && (
                              <button onClick={async () => { if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) { try { await api.deleteAdminUser(Number(user.id)); window.location.reload(); } catch (e) { alert('Hata'); } } }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editingUserPass.name} - Şifre Değiştir</h3>
            <input
              type="password"
              placeholder="Yeni Şifre"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 mb-4 focus:border-primary outline-none"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium"
                onClick={async () => {
                  if (newPass) {
                    try {
                      // En güvenli ve orijinal servis metodunu tetikliyoruz
                      await api.changePassword(Number(editingUserPass.id), newPass);
                      setEditingUserPass(null);
                      setNewPass('');
                      alert('Şifre başarıyla güncellendi');
                    } catch (err) {
                      console.error('Şifre değiştirme hatası:', err);
                      alert('Şifre değiştirilemedi. Detay için konsolu kontrol edin.');
                    }
                  }
                }}
              >Güncelle</button>
              <button
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
                onClick={() => { setEditingUserPass(null); setNewPass(''); }}
              >İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}