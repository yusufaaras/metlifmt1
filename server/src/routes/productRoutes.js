import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

export const createProductController = async (req, res) => {
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

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images'), createProduct);
router.put('/:id', upload.array('images'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
