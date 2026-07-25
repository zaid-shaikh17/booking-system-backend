import 'dotenv/config';
import mongoose from 'mongoose';
import Resource from '../src/models/Resource.js';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Resource.create([
    { name: 'Meeting Room A', type: 'room', capacity: 6 },
    { name: 'Meeting Room B', type: 'room', capacity: 10 },
    { name: 'Desk 1', type: 'desk', capacity: 1 },
  ]);
  console.log('Seeded resources');
  await mongoose.disconnect();
}

seed();