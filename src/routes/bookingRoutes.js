import express from 'express';
import { create, cancel } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', authMiddleware, create);
router.delete('/:id', authMiddleware, cancel);

export default router;