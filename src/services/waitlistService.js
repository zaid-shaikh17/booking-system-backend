// services/waitlistService.js
import Waitlist from '../models/Waitlist.js';
import Booking from '../models/Booking.js';

export async function promoteFromWaitlist(resourceId, startTime) {
  const next = await Waitlist.findOneAndDelete(
    { resourceId, startTime },
    { sort: { createdAt: 1 } }
  );
  if (!next) return null;

  const booking = await Booking.create({
    resourceId,
    userId: next.userId,
    startTime,
    endTime: next.endTime,
    status: 'confirmed',
  });
  return booking;
}