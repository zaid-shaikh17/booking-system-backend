// scripts/loadTest.js
import 'dotenv/config';
import { createBooking } from '../src/services/bookingService.js';
import mongoose from 'mongoose';
import Resource from '../src/models/Resource.js';
import User from '../src/models/User.js';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  let resource = await Resource.findOne();
  if (!resource) resource = await Resource.create({ name: 'Test Room', type: 'room' });

  await mongoose.model('Booking').deleteMany({ resourceId: resource._id });

  const startTime = new Date(Date.now() + Math.random() * 1e10);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  // seed 20 real users once, reuse their real ObjectIds
  const users = [];
  for (let i = 0; i < 20; i++) {
    let user = await User.findOne({ email: `loadtest${i}@test.com` });
    if (!user) {
      user = await User.create({
        name: `Load Test User ${i}`,
        email: `loadtest${i}@test.com`,
        password: 'password123',
      });
    }
    users.push(user);
  }

  const payload = {
    resourceId: resource._id,
    startTime: new Date('2026-08-01T10:00:00Z'),
    endTime: new Date('2026-08-01T11:00:00Z'),
  };

  const attempts = users.map((user) =>
    createBooking({ ...payload, userId: user._id })
      .then(() => ({ ok: true }))
      .catch((err) => ({ ok: false, reason: err.code, message: err.message }))
  );

  const results = await Promise.all(attempts);
  const succeeded = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log(`Succeeded: ${succeeded.length}`);
  console.log(`Failed (correctly rejected): ${failed.length}`);
  console.log(failed.map(r => r.reason));

  await mongoose.disconnect();
}

run();