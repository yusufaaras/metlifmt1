import { pool } from '../config/db.js';

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY id ASC');
    res.json(rows.map(r => ({
      ...r,
      specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || []),
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const r = rows[0];
    res.json({
      ...r,
      specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || []),
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, category, icon, specs } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const [result] = await pool.execute(
      'INSERT INTO products (title, description, category, icon, specs, images) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, category, icon, specs, JSON.stringify(images)]
    );
    res.json({ id: result.insertId, title });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, category, icon, specs } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    
    await pool.execute(
      'UPDATE products SET title=?, description=?, category=?, icon=?, specs=?, images=? WHERE id=?',
      [title, description, category, icon, specs, JSON.stringify(allImages), req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

