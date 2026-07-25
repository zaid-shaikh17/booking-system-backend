// services/bookingService.js
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { promoteFromWaitlist } from './waitlistService.js';

export async function createBooking(data, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const booking = await Booking.create([data], { session });
      await session.commitTransaction();
      return booking[0];
    } catch (err) {
      await session.abortTransaction();

      if (err.code === 11000) {
        const err2 = new Error('SLOT_TAKEN');
        err2.code = 'SLOT_TAKEN';
        throw err2;
      }

      const isTransient = err.hasOwnProperty('errorLabels') && err.errorLabels.includes('TransientTransactionError');
      if (isTransient && attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 20 * (attempt + 1)));
        continue;
      }

      throw err;
    } finally {
      session.endSession();
    }
  }
}

export async function cancelBooking(bookingId) {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) {
    const err = new Error('BOOKING_NOT_FOUND');
    err.code = 'BOOKING_NOT_FOUND';
    throw err;
  }
  await promoteFromWaitlist(booking.resourceId, booking.startTime);
  return booking;
}