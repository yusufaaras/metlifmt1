import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'metli-fmt-secret-key-2024';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }
    
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      console.log('Invalid password provided');
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }
    
    console.log('Login successful');
    const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
  } catch (err) { 
    console.error('Login error:', err);
    res.status(500).json({ error: err.message }); 
  }
};

export const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, name, created_at FROM admin_users');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createAdmin = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute('INSERT INTO admin_users (username, password, name) VALUES (?, ?, ?)', [username, hash, name]);
    res.json({ id: result.insertId, username, name });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hash, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteAdmin = async (req, res) => {
  try {
    await pool.execute('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
