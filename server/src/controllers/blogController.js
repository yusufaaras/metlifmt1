import { pool } from '../config/db.js';

export const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts ORDER BY date DESC, id DESC');
    res.json(rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPostById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    const r = rows[0];
    res.json({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || [])
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const [result] = await pool.execute(
      'INSERT INTO blog_posts (title, content, excerpt, category, date, images) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt, category, date, JSON.stringify(images)]
    );
    res.json({ id: result.insertId, title });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, category, date } = req.body;
    const newImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const allImages = [...existingImages, ...newImages];
    
    await pool.execute(
      'UPDATE blog_posts SET title=?, content=?, excerpt=?, category=?, date=?, images=? WHERE id=?',
      [title, content, excerpt, category, date, JSON.stringify(allImages), req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deletePost = async (req, res) => {
  try {
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
