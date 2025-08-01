import express from 'express';
import pool from '../models/db.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Users CRUD
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  const [users] = await pool.query('SELECT * FROM users');
  res.json(users);
});

router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role, department_id, division_id, name, phone } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const password_hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password_hash, role, department_id, division_id, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, password_hash, role, department_id, division_id, name, phone]);
  res.json({ message: 'User created' });
});

router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, department_id, division_id, name, phone } = req.body;
  await pool.query('UPDATE users SET role=?, department_id=?, division_id=?, name=?, phone=? WHERE id=?', [role, department_id, division_id, name, phone, id]);
  res.json({ message: 'User updated' });
});

router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id=?', [id]);
  res.json({ message: 'User deleted' });
});

// Departments CRUD
router.get('/departments', authenticateToken, isAdmin, async (req, res) => {
  const [departments] = await pool.query('SELECT * FROM departments');
  res.json(departments);
});

router.post('/departments', authenticateToken, isAdmin, async (req, res) => {
  const { name_en, name_hi, type } = req.body;
  await pool.query('INSERT INTO departments (name_en, name_hi, type) VALUES (?, ?, ?)', [name_en, name_hi, type]);
  res.json({ message: 'Department created' });
});

router.put('/departments/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name_en, name_hi, type } = req.body;
  await pool.query('UPDATE departments SET name_en=?, name_hi=?, type=? WHERE id=?', [name_en, name_hi, type, id]);
  res.json({ message: 'Department updated' });
});

router.delete('/departments/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM departments WHERE id=?', [id]);
  res.json({ message: 'Department deleted' });
});

// Divisions CRUD
router.get('/divisions', authenticateToken, isAdmin, async (req, res) => {
  const [divisions] = await pool.query('SELECT * FROM divisions');
  res.json(divisions);
});

router.post('/divisions', authenticateToken, isAdmin, async (req, res) => {
  const { name_en, name_hi, department_id } = req.body;
  await pool.query('INSERT INTO divisions (name_en, name_hi, department_id) VALUES (?, ?, ?)', [name_en, name_hi, department_id]);
  res.json({ message: 'Division created' });
});

router.put('/divisions/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name_en, name_hi, department_id } = req.body;
  await pool.query('UPDATE divisions SET name_en=?, name_hi=?, department_id=? WHERE id=?', [name_en, name_hi, department_id, id]);
  res.json({ message: 'Division updated' });
});

router.delete('/divisions/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM divisions WHERE id=?', [id]);
  res.json({ message: 'Division deleted' });
});

// Logs
router.get('/logs', authenticateToken, isAdmin, async (req, res) => {
  const [logs] = await pool.query('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 500');
  res.json(logs);
});

// Stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  const [[{ user_count }]] = await pool.query('SELECT COUNT(*) as user_count FROM users');
  const [[{ letter_count }]] = await pool.query('SELECT COUNT(*) as letter_count FROM letters');
  const [[{ dept_count }]] = await pool.query('SELECT COUNT(*) as dept_count FROM departments');
  const [[{ div_count }]] = await pool.query('SELECT COUNT(*) as div_count FROM divisions');
  // Letter stats for pie chart
  const [[{ read_count }]] = await pool.query("SELECT COUNT(*) as read_count FROM letter_recipients WHERE read_status='read'");
  const [[{ unread_count }]] = await pool.query("SELECT COUNT(*) as unread_count FROM letter_recipients WHERE read_status='unread'");
  const [[{ replied_count }]] = await pool.query("SELECT COUNT(*) as replied_count FROM letters WHERE letter_type='Reply'");
  const [[{ not_replied_count }]] = await pool.query("SELECT COUNT(*) as not_replied_count FROM letters WHERE letter_type!='Reply'");
  res.json({ user_count, letter_count, dept_count, div_count, read_count, unread_count, replied_count, not_replied_count });
});

export default router; 