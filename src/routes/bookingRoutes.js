import express from 'express';
import { create, cancel, getAvailability, joinWaitlist, getMyBookings } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', authMiddleware, create);
router.delete('/:id', authMiddleware, cancel);
router.get('/availability', authMiddleware, getAvailability);
router.post('/waitlist', authMiddleware, joinWaitlist);
router.get('/my-bookings', authMiddleware, getMyBookings);

export default router;