import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername, validatePassword } from '../models/user.js';
import pool from '../models/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await validatePassword(user, password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  // Log login
  await pool.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [user.id, 'login', 'User logged in']);
  res.json({ token, role: user.role, name: user.name });
});

router.post('/forgot-password', async (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  const user = await findUserByUsername(username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const password_hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash=? WHERE username=?', [password_hash, username]);
  res.json({ message: 'Password reset successful' });
});

// Request OTP for password reset
router.post('/request-otp', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Missing username' });
  const user = await findUserByUsername(username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await pool.query('UPDATE users SET otp_code=?, otp_expiry=? WHERE username=?', [otp, expiry, username]);
  console.log(`OTP for ${username}: ${otp}`); // Demo: log OTP instead of sending email
  res.json({ message: 'OTP sent to your registered email (demo: check backend console)' });
});

// Verify OTP and reset password
router.post('/verify-otp', async (req, res) => {
  const { username, otp, newPassword } = req.body;
  if (!username || !otp || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  const user = await findUserByUsername(username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.otp_code || !user.otp_expiry) return res.status(400).json({ message: 'No OTP requested' });
  if (user.otp_code !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  if (new Date() > new Date(user.otp_expiry)) return res.status(400).json({ message: 'OTP expired' });
  const password_hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash=?, otp_code=NULL, otp_expiry=NULL WHERE username=?', [password_hash, username]);
  res.json({ message: 'Password reset successful' });
});

export default router; 