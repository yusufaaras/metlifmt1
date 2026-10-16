function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      if (envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
        return envUrl;
      }
      return 'http://localhost:3001';
    }
  }
  return envUrl || 'https://metliapi.yusufaras.online';
}

const API_BASE: string = getApiBaseUrl();

function getToken(): string | null {
  return sessionStorage.getItem('metli-token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { ...options?.headers, ...authHeaders() },
  });
  if (!res.ok) {
    if (res.status === 401) {
      sessionStorage.removeItem('metli-token');
      sessionStorage.removeItem('metli-user');
      sessionStorage.removeItem('metli-auth');
    }
    const err = await res.json().catch(() => ({ error: 'İşlem başarısız' }));
    throw new Error(err.error || 'İşlem başarısız');
  }
  return res.json();
}

// ═══ Auth ═══
export async function login(username: string, password: string) {
  const data = await request<{ token: string; user: { id: number; username: string; name: string } }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!data || !data.token) {
    throw new Error('Token alınamadı, giriş başarısız.');
  }
  localStorage.clear(); // Giriş yaparken eski kalıntıları temizle
  sessionStorage.clear();
  sessionStorage.setItem('metli-token', data.token);
  sessionStorage.setItem('metli-user', JSON.stringify(data.user));
  return data;
}

export async function verifyToken(): Promise<{ id: number; username: string; name: string } | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const data = await request<{ user: { id: number; username: string; name: string } }>('/api/auth/me');
    if (data && data.user) {
      sessionStorage.setItem('metli-user', JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch {
    sessionStorage.removeItem('metli-token');
    sessionStorage.removeItem('metli-user');
    sessionStorage.removeItem('metli-auth');
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem('metli-token');
  sessionStorage.removeItem('metli-user');
  sessionStorage.removeItem('metli-auth');
  sessionStorage.clear();
  localStorage.clear(); // Ne olur ne olmaz her yeri temizlesin
  window.location.href = '/admin'; // Admin sayfasına yönlendir (login durumunda kalır)
}

export function getCurrentUser() {
  const u = sessionStorage.getItem('metli-user');
  return u ? JSON.parse(u) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

// ═══ Products ═══
export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  specs: string[];
  images: string[];
  is_featured?: number;
  sort_order?: number;
}

export const getProducts = () => request<ApiProduct[]>('/api/products');
export const getProduct = (id: number) => request<ApiProduct>(`/api/products/${id}`);

export async function createProduct(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/products`, { method: 'POST', headers: authHeaders(), body: formData });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: number, formData: FormData) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'PUT', headers: authHeaders(), body: formData });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export const deleteProduct = (id: number) => request(`/api/products/${id}`, { method: 'DELETE' });

// ═══ Site Sections / Settings ═══
export const getSections = () => request<Record<string, any>>('/api/sections');
export const getSection = <T = any>(key: string) => request<T>(`/api/sections/${key}`);
export const updateSection = <T = any>(key: string, data: T) =>
  request<{ success: boolean; key: string; data: T }>(`/api/sections/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

// ═══ Blog ═══
export interface ApiBlog {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  images: string[];
  date: string;
}

export const getBlogPosts = () => request<ApiBlog[]>('/api/blog');
export const getBlogPost = (id: number) => request<ApiBlog>(`/api/blog/${id}`);

export async function createBlogPost(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/blog`, { method: 'POST', headers: authHeaders(), body: formData });
  if (!res.ok) throw new Error('Failed to create blog post');
  return res.json();
}

export async function updateBlogPost(id: number, formData: FormData) {
  const res = await fetch(`${API_BASE}/api/blog/${id}`, { method: 'PUT', headers: authHeaders(), body: formData });
  if (!res.ok) throw new Error('Failed to update blog post');
  return res.json();
}

export const deleteBlogPost = (id: number) => request(`/api/blog/${id}`, { method: 'DELETE' });

// ═══ Upload Files (Images & Videos) ═══
export async function uploadMediaFiles(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const formData = new FormData();
  for (const f of files) {
    formData.append('files', f);
  }
  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Dosya yükleme hatası' }));
    throw new Error(errorData.error || `Dosya yüklenemedi (${res.status})`);
  }
  const data = await res.json();
  return data.urls || [];
}

// ═══ Admin Users ═══
export interface ApiAdmin {
  id: number;
  username: string;
  name: string;
}

export const getAdminUsers = () => request<ApiAdmin[]>('/api/admin/users');

export const createAdminUser = (data: { username: string; password: string; name: string }) =>
  request('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export const changePassword = (id: number, password: string) =>
  request(`/api/admin/users/${id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });

export const deleteAdminUser = (id: number) => request(`/api/admin/users/${id}`, { method: 'DELETE' });

// ═══ Utility ═══
export function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/images/')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  if (path.startsWith('uploads/')) return `${API_BASE}/${path}`;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function checkBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

