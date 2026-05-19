import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as api from '@/services/api';

export interface Multilang {
  tr: string;
  en: string;
  es: string;
  ru: string;
}

export interface Product {
  id: string;
  title: string | Multilang;
  titleKey?: string;
  description: string | Multilang;
  descKey?: string;
  category: string | Multilang;
  specs: string[] | { tr: string[], en: string[], es: string[], ru: string[] };
  specsKeys?: string[];
  icon: string;
  images?: string[];
}

export interface BlogPost {
  id: string;
  title: string | Multilang;
  titleKey?: string;
  content: string | Multilang;
  contentKey?: string;
  excerpt: string | Multilang;
  excerptKey?: string;
  date: string;
  category: string | Multilang;
  categoryKey?: string;
  images?: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
}

const defaultProducts: Product[] = [
  { id: '1', titleKey: 'p1.title', descKey: 'p1.desc', title: 'Dikenli Tel (Ters Büküm)', description: '', category: 'wire', specs: [], specsKeys: ['p1.s1','p1.s2','p1.s3','p1.s4'], icon: '🔗' },
  { id: '2', titleKey: 'p2.title', descKey: 'p2.desc', title: 'Helezon (Fens) Çit Teli', description: '', category: 'fence', specs: [], specsKeys: ['p2.s1','p2.s2','p2.s3','p2.s4'], icon: '🏗️' },
  { id: '3', titleKey: 'p3.title', descKey: 'p3.desc', title: 'Emprenyeli Ahşap Direkler', description: '', category: 'wood', specs: [], specsKeys: ['p3.s1','p3.s2','p3.s3','p3.s4'], icon: '🪵' },
  { id: '4', titleKey: 'p4.title', descKey: 'p4.desc', title: 'L Profil ve Kazık', description: '', category: 'fence', specs: [], specsKeys: ['p4.s1','p4.s2','p4.s3','p4.s4'], icon: '📐' },
  { id: '5', titleKey: 'p5.title', descKey: 'p5.desc', title: 'Jiletli Tel', description: '', category: 'wire', specs: [], specsKeys: ['p5.s1','p5.s2','p5.s3','p5.s4'], icon: '⚔️' },
  { id: '6', titleKey: 'p6.title', descKey: 'p6.desc', title: 'Kafes Tel', description: '', category: 'wire', specs: [], specsKeys: ['p6.s1','p6.s2','p6.s3','p6.s4'], icon: '🔲' },
  { id: '7', titleKey: 'p7.title', descKey: 'p7.desc', title: 'Altıgen Örgü Çit Teli', description: '', category: 'fence', specs: [], specsKeys: ['p7.s1','p7.s2','p7.s3','p7.s4'], icon: '⬡' },
  { id: '8', titleKey: 'p8.title', descKey: 'p8.desc', title: 'Kümes Teli', description: '', category: 'fence', specs: [], specsKeys: ['p8.s1','p8.s2','p8.s3','p8.s4'], icon: '🐔' },
  { id: '9', titleKey: 'p9.title', descKey: 'p9.desc', title: 'Bağ Teli', description: '', category: 'agriculture', specs: [], specsKeys: ['p9.s1','p9.s2','p9.s3','p9.s4'], icon: '🍇' },
  { id: '10', titleKey: 'p10.title', descKey: 'p10.desc', title: 'Telli Terbiye File Sistemi', description: '', category: 'agriculture', specs: [], specsKeys: ['p10.s1','p10.s2','p10.s3','p10.s4'], icon: '🌳' },
  { id: '11', titleKey: 'p11.title', descKey: 'p11.desc', title: 'Galvanizli Boru Direk', description: '', category: 'fence', specs: [], specsKeys: ['p11.s1','p11.s2','p11.s3','p11.s4'], icon: '🔩' },
  { id: '12', titleKey: 'p12.title', descKey: 'p12.desc', title: 'Demir Direk', description: '', category: 'fence', specs: [], specsKeys: ['p12.s1','p12.s2','p12.s3','p12.s4'], icon: '🏛️' },
  { id: '13', titleKey: 'p13.title', descKey: 'p13.desc', title: 'Gölgeleme ve Dolu Filesi', description: '', category: 'accessories', specs: [], specsKeys: ['p13.s1','p13.s2','p13.s3','p13.s4'], icon: '☀️' },
  { id: '14', titleKey: 'p14.title', descKey: 'p14.desc', title: 'Kova Tipi Ahşap Direk Şapkası', description: '', category: 'accessories', specs: [], specsKeys: ['p14.s1','p14.s2','p14.s3','p14.s4'], icon: '🎩' },
  { id: '15', titleKey: 'p15.title', descKey: 'p15.desc', title: 'Tel Gerdirme Aparatı', description: '', category: 'accessories', specs: [], specsKeys: ['p15.s1','p15.s2','p15.s3','p15.s4'], icon: '🔧' },
];

const defaultBlogPosts: BlogPost[] = [
  { id: '1', titleKey: 'blog1.title', contentKey: 'blog1.content', excerptKey: 'blog1.excerpt', categoryKey: 'blog1.cat', title: '', content: '', excerpt: '', date: '2024-12-15', category: '' },
  { id: '2', titleKey: 'blog2.title', contentKey: 'blog2.content', excerptKey: 'blog2.excerpt', categoryKey: 'blog2.cat', title: '', content: '', excerpt: '', date: '2024-11-20', category: '' },
  { id: '3', titleKey: 'blog3.title', contentKey: 'blog3.content', excerptKey: 'blog3.excerpt', categoryKey: 'blog3.cat', title: '', content: '', excerpt: '', date: '2024-10-05', category: '' },
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

const DATA_VERSION = '2';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    // If data version changed, clear old data and use fresh defaults
    const storedVersion = localStorage.getItem('metli-data-version');
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem('metli-products');
      localStorage.removeItem('metli-blog');
      localStorage.setItem('metli-data-version', DATA_VERSION);
      return fallback;
    }
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('metli-auth') || !!sessionStorage.getItem('metli-token'));
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = sessionStorage.getItem('metli-user');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiProducts, apiBlogs] = await Promise.all([
          api.getProducts(),
          api.getBlogPosts()
        ]);
        if (apiProducts) setProducts(apiProducts.map(p => ({ ...p, id: String(p.id) })));
        if (apiBlogs) setBlogPosts(apiBlogs.map(b => ({ ...b, id: String(b.id) })));
      } catch (err) {
        console.log('Using local data (API not available)');
      }
    };
    fetchData();

    const hasAuth = !!sessionStorage.getItem('metli-auth') || !!sessionStorage.getItem('metli-token');
    if (hasAuth !== isLoggedIn) setIsLoggedIn(hasAuth);
  }, []);

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
    // Note: In real production, this login logic is handled by the backend API via src/services/api.ts
    // This local logic remains for the frontend-only preview mode
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
