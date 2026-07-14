import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },         // e.g. "Meeting Room A"
  type: { type: String, enum: ['desk', 'room'], required: true },
  capacity: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;