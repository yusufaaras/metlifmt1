import express from 'express';
import multer from 'multer';
import path from 'path';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/blogController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', upload.array('images'), createPost);
router.put('/:id', upload.array('images'), updatePost);
router.delete('/:id', deletePost);

export default router;
