import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  specs: string[];
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
}

const defaultProducts: Product[] = [
  { id: '1', title: 'Dikenli Tel (Ters Büküm)', description: 'Sıcak daldırma galvanizli telden üretilen ters bükümlü dikenli tel. TSE EN 10223-1:2012 ve ISO 9001:2015 standartlarında.', category: 'wire', specs: ['Halat teli çapı: 1.30 - 2.50 mm', 'Diken teli çapı: 1.30 - 2.00 mm', 'Dikenler arası: 75 - 110 mm', 'TSE EN 10223-1:2012'], icon: '🔗' },
  { id: '2', title: 'Helezon (Fens) Çit Teli', description: 'Galvanizli veya PVC kaplı helezon çit teli. Farklı göz aralığı ve rulo genişliği seçenekleri.', category: 'fence', specs: ['Tel çapı: 1.8 - 4 mm', 'Göz aralığı: 1.5x1.5 - 7x7 cm', 'Rulo genişliği: 1 - 6 mt', 'Galvanizli veya PVC kaplı'], icon: '🏗️' },
  { id: '3', title: 'Emprenyeli Ahşap Direkler', description: 'Kestane, kızılçam, sarıçam ağaçlarından üretilen, WBC ile basınç altında emprenye edilmiş direkler.', category: 'wood', specs: ['Kalınlık: Q6 - Q12', 'Uzunluk: 100 - 200 cm', 'Çap: 8-10 cm', 'WBC emprenye'], icon: '🪵' },
  { id: '4', title: 'L Profil ve Kazık', description: 'Çeşitli ölçülerde L profil ve kazık çeşitleri. Tek ve çift T seçenekleri mevcuttur.', category: 'fence', specs: ['40x40x4 mm (70-200 cm)', '25x25x3 mm (70-90 cm)', '40x40x5 mm (200-225 cm)', 'Tek/Çift T seçenekleri'], icon: '📐' },
  { id: '5', title: 'Jiletli Tel', description: 'Yüksek güvenlikli alanlar için jiletli tel çözümleri. Galvanizli çelik malzemeden üretim.', category: 'wire', specs: ['Yüksek güvenlik', 'Galvanizli çelik', 'Farklı çap seçenekleri', 'Uzun ömürlü'], icon: '⚔️' },
  { id: '6', title: 'Kafes Tel', description: 'Çeşitli amaçlarla kullanılabilen galvanizli kafes tel ürünleri.', category: 'wire', specs: ['Galvanizli', 'Farklı göz aralıkları', 'Çeşitli genişlikler', 'Dayanıklı yapı'], icon: '🔲' },
  { id: '7', title: 'Altıgen Örgü Çit Teli', description: 'Tavuk teli olarak da bilinen altıgen örgü çit teli. Bahçe ve kümes uygulamaları için ideal.', category: 'fence', specs: ['Altıgen örgü', 'Galvanizli', 'Farklı göz boyutları', 'Hafif ve dayanıklı'], icon: '⬡' },
  { id: '8', title: 'Kümes Teli', description: 'Kümes ve bahçe çitleme uygulamaları için özel üretim kümes teli.', category: 'fence', specs: ['Galvanizli', 'Korozyona dayanıklı', 'Kolay uygulama', 'Ekonomik'], icon: '🐔' },
  { id: '9', title: 'Bağ Teli', description: 'Bağ ve bahçelerde kullanılan özel üretim bağ teli.', category: 'agriculture', specs: ['Galvanizli', 'Yüksek mukavemet', 'UV dayanıklı', 'Uzun ömürlü'], icon: '🍇' },
  { id: '10', title: 'Telli Terbiye File Sistemi', description: 'Modern meyve bahçeleri için emprenyeli ahşap direk, galvanizli çelik halat ve koruyucu filelerden oluşan profesyonel sistem.', category: 'agriculture', specs: ['Emprenyeli ahşap direk', 'Galvanizli çelik halat', 'Koruyucu file', 'Profesyonel kurulum'], icon: '🌳' },
  { id: '11', title: 'Galvanizli Boru Direk', description: 'Çit ve çevre güvenliği uygulamalarında kullanılan galvanizli boru direkler.', category: 'fence', specs: ['Galvanizli', 'Farklı çap seçenekleri', 'Farklı uzunluklar', 'Korozyona dayanıklı'], icon: '🔩' },
  { id: '12', title: 'Demir Direk', description: 'Çit ve çevre güvenliği için sağlam demir direk çeşitleri.', category: 'fence', specs: ['Yüksek mukavemet', 'Farklı profiller', 'Boyalı veya ham', 'Uzun ömürlü'], icon: '🏛️' },
  { id: '13', title: 'Gölgeleme ve Dolu Filesi', description: 'Güneş yanığını ve meyve çatlamasını önleyen koruyucu fileler.', category: 'accessories', specs: ['UV dayanıklı', 'Farklı gölgeleme oranları', 'Dolu koruması', 'Uzun ömürlü'], icon: '☀️' },
  { id: '14', title: 'Kova Tipi Ahşap Direk Şapkası', description: 'Direği su ve nemden koruyarak ömrünü uzatan ahşap direk şapkası.', category: 'accessories', specs: ['Su geçirmez', 'Kolay montaj', 'Dayanıklı malzeme', 'Direk koruma'], icon: '🎩' },
  { id: '15', title: 'Tel Gerdirme Aparatı', description: 'Sistemin zamanla gevşemesini önleyerek gergin tutan tel gerdirme aparatı.', category: 'accessories', specs: ['Galvanizli çelik', 'Kolay kullanım', 'Ayarlanabilir', 'Uzun ömürlü'], icon: '🔧' },
];

const defaultBlogPosts: BlogPost[] = [
  { id: '1', title: 'Telli Terbiye Sistemlerinde Yeni Dönem', content: 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır. FMT Makina olarak bu alanda sunduğumuz yenilikçi çözümlerle müşterilerimizin verimliliklerini artırıyoruz. Sistemlerimiz, emprenyeli ahşap direkler, galvanizli çelik halatlar ve özel koruyucu filelerden oluşmaktadır. Bu sistem sayesinde ağaçların gelişimi desteklenir, budama ve hasat işlemleri kolaylaşır, birim alandan maksimum verim elde edilir.', excerpt: 'Modern tarım uygulamalarında telli terbiye file sistemleri gün geçtikçe daha fazla önem kazanmaktadır.', date: '2024-12-15', category: 'Projeler' },
  { id: '2', title: 'ISO 9001:2015 Sertifikamızı Yeniledik', content: 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz. ISO 9001:2015 sertifikamızı başarıyla yeniledik. Bu sertifika, üretim süreçlerimizin uluslararası kalite standartlarına uygunluğunu teyit etmektedir. Müşterilerimize her zaman en yüksek kalitede ürün ve hizmet sunma taahhüdümüzü sürdürüyoruz.', excerpt: 'FMT Makina Mühendislik olarak kalite standartlarımızı sürekli yükseltiyoruz.', date: '2024-11-20', category: 'Haberler' },
  { id: '3', title: 'Kozan OSB\'deki Üretim Tesisimiz Genişliyor', content: 'Artan üretim kapasitesi ve büyüyen müşteri talepleri doğrultusunda Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz. Yeni üretim hatlarımız ile tel ürünleri ve çit sistemleri üretim kapasitemizi önemli ölçüde artıracağız. Modern teknoloji ile donatılmış yeni tesisimiz, daha hızlı ve daha kaliteli üretim yapmamızı sağlayacaktır.', excerpt: 'Adana Kozan OSB\'deki üretim tesisimizi genişletiyoruz.', date: '2024-10-05', category: 'Haberler' },
];

const defaultAdminUsers: AdminUser[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Yönetici' },
];

interface DataContextType {
  products: Product[];
  blogPosts: BlogPost[];
  adminUsers: AdminUser[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  deleteAdminUser: (id: string) => void;
  isLoggedIn: boolean;
  currentUser: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('metli-products', defaultProducts));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('metli-blog', defaultBlogPosts));
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => loadFromStorage('metli-admins', defaultAdminUsers));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('metli-auth'));
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('metli-user');
    return saved ? JSON.parse(saved) : null;
  });

  const saveProducts = (p: Product[]) => { setProducts(p); localStorage.setItem('metli-products', JSON.stringify(p)); };
  const saveBlog = (b: BlogPost[]) => { setBlogPosts(b); localStorage.setItem('metli-blog', JSON.stringify(b)); };
  const saveAdmins = (a: AdminUser[]) => { setAdminUsers(a); localStorage.setItem('metli-admins', JSON.stringify(a)); };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    saveProducts([...products, newProduct]);
  };
  const updateProduct = (product: Product) => {
    saveProducts(products.map(p => p.id === product.id ? product : p));
  };
  const deleteProduct = (id: string) => saveProducts(products.filter(p => p.id !== id));

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: Date.now().toString() };
    saveBlog([newPost, ...blogPosts]);
  };
  const updateBlogPost = (post: BlogPost) => {
    saveBlog(blogPosts.map(p => p.id === post.id ? post : p));
  };
  const deleteBlogPost = (id: string) => saveBlog(blogPosts.filter(p => p.id !== id));

  const addAdminUser = (user: Omit<AdminUser, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    saveAdmins([...adminUsers, newUser]);
  };
  const deleteAdminUser = (id: string) => saveAdmins(adminUsers.filter(u => u.id !== id));

  const login = (username: string, password: string): boolean => {
    const user = adminUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      sessionStorage.setItem('metli-auth', 'true');
      sessionStorage.setItem('metli-user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('metli-auth');
    sessionStorage.removeItem('metli-user');
  };

  return (
    <DataContext.Provider value={{
      products, blogPosts, adminUsers,
      addProduct, updateProduct, deleteProduct,
      addBlogPost, updateBlogPost, deleteBlogPost,
      addAdminUser, deleteAdminUser,
      isLoggedIn, currentUser, login, logout,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
