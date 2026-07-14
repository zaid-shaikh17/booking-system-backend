import express from 'express';
import { list, create } from '../controllers/resourceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();
router.get('/', authMiddleware, list);
router.post('/', authMiddleware, adminMiddleware, create);

export default router;