import { createBooking, cancelBooking } from '../services/bookingService.js';

export async function create(req, res) {
  try {
    const booking = await createBooking({ ...req.body, userId: req.user.id });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'SLOT_TAKEN') return res.status(409).json({ error: 'Slot already booked' });
    res.status(500).json({ error: 'Server error' });
  }
}

export async function cancel(req, res) {
  try {
    const booking = await cancelBooking(req.params.id);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}