import { useState } from 'react';
import { useData, type Product, type BlogPost } from '@/context/DataContext';

// ===== LOGIN =====
function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(username, password)) {
      setError('Hatalı kullanıcı adı veya şifre');
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
          <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all">Giriş Yap</button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Varsayılan: admin / admin123</p>
      </div>
    </div>
  );
}

// ===== PRODUCT FORM =====
function ProductForm({ product, onSave, onCancel }: { product?: Product; onSave: (p: Omit<Product, 'id'> & { id?: string }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || 'wire');
  const [icon, setIcon] = useState(product?.icon || '🔗');
  const [specs, setSpecs] = useState(product?.specs.join('\n') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: product?.id, title, description, category, icon, specs: specs.split('\n').filter(s => s.trim()) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
            <option value="wire">Tel Ürünleri</option>
            <option value="fence">Çit Sistemleri</option>
            <option value="wood">Ahşap Direkler</option>
            <option value="agriculture">Tarımsal Sistemler</option>
            <option value="accessories">Aksesuarlar</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">İkon (Emoji)</label>
        <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teknik Özellikler (her satır bir özellik)</label>
        <textarea value={specs} onChange={e => setSpecs(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">{product ? 'Güncelle' : 'Ekle'}</button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">İptal</button>
      </div>
    </form>
  );
}

// ===== BLOG FORM =====
function BlogForm({ post, onSave, onCancel }: { post?: BlogPost; onSave: (p: Omit<BlogPost, 'id'> & { id?: string }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [date, setDate] = useState(post?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(post?.category || 'Haberler');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: post?.id, title, content, excerpt: excerpt || content.slice(0, 150), date, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">{post ? 'Güncelle' : 'Ekle'}</button>
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

  if (!data.isLoggedIn) {
    return <AdminLogin onLogin={data.login} />;
  }

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'products', label: 'Ürünler', icon: '📦' },
    { key: 'blog', label: 'Blog', icon: '📝' },
    { key: 'users', label: 'Kullanıcılar', icon: '👥' },
  ];

  const handleSaveProduct = (p: Omit<Product, 'id'> & { id?: string }) => {
    if (p.id) {
      data.updateProduct(p as Product);
    } else {
      data.addProduct(p);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSavePost = (p: Omit<BlogPost, 'id'> & { id?: string }) => {
    if (p.id) {
      data.updateBlogPost(p as BlogPost);
    } else {
      data.addBlogPost(p);
    }
    setShowBlogForm(false);
    setEditingPost(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.password && newUser.name) {
      data.addAdminUser(newUser);
      setNewUser({ username: '', password: '', name: '' });
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={data.logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all">
            <span>🚪</span> Çıkış Yap
          </button>
          <a href="#/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 transition-all mt-1">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
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
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg text-secondary-dark mb-4">Hoş Geldiniz!</h2>
                <p className="text-sm text-gray-600">Bu admin paneli üzerinden ürünlerinizi, blog yazılarınızı yönetebilir ve yeni admin kullanıcıları ekleyebilirsiniz.</p>
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-sm text-primary font-medium">💡 Not: Veriler tarayıcı localStorage'da saklanmaktadır.</p>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{data.products.length} ürün</p>
                <button
                  onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
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
                        <th className="px-4 py-3 text-left">Kategori</th>
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
                                <p className="font-medium text-secondary-dark">{product.title}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{product.category}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingProduct(product); setShowProductForm(true); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Düzenle</button>
                              <button onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) data.deleteProduct(product.id); }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
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

          {/* BLOG */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{data.blogPosts.length} yazı</p>
                <button
                  onClick={() => { setShowBlogForm(true); setEditingPost(null); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
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
                            <p className="font-medium text-secondary-dark">{post.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{post.category}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{post.date}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingPost(post); setShowBlogForm(true); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Düzenle</button>
                              <button onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) data.deleteBlogPost(post.id); }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
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
                          {data.adminUsers.length > 1 && (
                            <button onClick={() => { if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) data.deleteAdminUser(user.id); }} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Sil</button>
                          )}
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
    </div>
  );
}
