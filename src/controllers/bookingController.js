import { createBooking, cancelBooking } from '../services/bookingService.js';
import Booking from '../models/Booking.js';
import Waitlist from '../models/Waitlist.js';

export async function create(req, res) {
  try {
    const booking = await createBooking({ ...req.body, userId: req.user.id });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'SLOT_TAKEN') return res.status(409).json({ error: 'Slot already booked' });
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAvailability(req, res) {
  const { resourceId, date } = req.query;
  const start = new Date(date); start.setHours(0,0,0,0);
  const end = new Date(date); end.setHours(23,59,59,999);

  const bookings = await Booking.find({
    resourceId, status: 'confirmed',
    startTime: { $gte: start, $lte: end },
  }).select('startTime endTime userId');

  res.json(bookings);
}

export async function joinWaitlist(req, res) {
  try {
    const { resourceId, startTime, endTime } = req.body;
    const entry = await Waitlist.create({
      resourceId, startTime, endTime, userId: req.user.id,
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('joinWaitlist error:', err)
    res.status(500).json({ error: 'Failed to join waitlist' });
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