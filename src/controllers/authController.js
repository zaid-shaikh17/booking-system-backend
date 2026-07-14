import { registerUser, loginUser } from '../services/authService.js';

export async function register(req, res) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'EMAIL_EXISTS') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'Invalid email or password' });
    res.status(500).json({ error: 'Server error' });
  }
}