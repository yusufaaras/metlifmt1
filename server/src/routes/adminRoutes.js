import express from 'express';
import { login, getAdmins, createAdmin, updatePassword, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.get('/users', getAdmins);
router.post('/users', createAdmin);
router.put('/users/:id/password', updatePassword);
router.delete('/users/:id', deleteAdmin);

export default router;
