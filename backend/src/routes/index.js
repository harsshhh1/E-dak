import express from 'express';
import authRouter from './auth.js';
import lettersRouter from './letters.js';
import adminRouter from './admin.js';
import pool from '../models/db.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/letters', lettersRouter);
router.use('/admin', adminRouter);

// Notices CRUD
router.get('/notices', authenticateToken, async (req, res) => {
  const [notices] = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
  res.json(notices);
});

router.post('/notices', authenticateToken, isAdmin, async (req, res) => {
  const { title, content, visible_to } = req.body;
  await pool.query('INSERT INTO notices (title, content, visible_to) VALUES (?, ?, ?)', [title, content, visible_to || 'all']);
  res.json({ message: 'Notice created' });
});

router.put('/notices/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content, visible_to } = req.body;
  await pool.query('UPDATE notices SET title=?, content=?, visible_to=? WHERE id=?', [title, content, visible_to || 'all', id]);
  res.json({ message: 'Notice updated' });
});

router.delete('/notices/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM notices WHERE id=?', [id]);
  res.json({ message: 'Notice deleted' });
});

export default router; 