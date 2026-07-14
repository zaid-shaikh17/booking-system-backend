import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('EMAIL_EXISTS');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  const user = await User.create({ name, email, password });
  return generateToken(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('INVALID_CREDENTIALS');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  return generateToken(user);
}

function generateToken(user) {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}