const API_BASE: string = (import.meta as any).env.VITE_API_URL || 'https://metliapi.yusufaras.online';

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
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
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
  localStorage.clear(); // Giriş yaparken eski kalıntıları temizle
  sessionStorage.clear();
  sessionStorage.setItem('metli-token', data.token);
  sessionStorage.setItem('metli-user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  sessionStorage.removeItem('metli-token');
  sessionStorage.removeItem('metli-user');
  sessionStorage.clear();
  localStorage.clear(); // Ne olur ne olmaz her yeri temizlesin
  window.location.href = '/'; // Sayfayı kökten sıfırlayarak yönlendir
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
  if (path.startsWith('http') || path.startsWith('/images/')) return path;
  return `${API_BASE}${path}`;
}

export async function checkBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
