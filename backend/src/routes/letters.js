import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import pool from '../models/db.js';
const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

function generateStaticId() {
  return 'ST' + Date.now() + Math.floor(Math.random() * 1000);
}

// Dispatch letter
router.post('/dispatch', authenticateToken, upload.array('files'), async (req, res) => {
  const { letter_no, letter_type, subject, body, reply_requested, reply_by_date, recipients } = req.body;
  const static_id = generateStaticId();
  const sender_id = req.user.id;
  const sender_dept_id = req.user.department_id;
  const sender_div_id = req.user.division_id;
  const [result] = await pool.query(
    'INSERT INTO letters (static_id, letter_no, letter_type, subject, body, sender_id, sender_dept_id, sender_div_id, reply_requested, reply_by_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [static_id, letter_no, letter_type, subject, body, sender_id, sender_dept_id, sender_div_id, reply_requested === 'true', reply_by_date, 'dispatched']
  );
  const letter_id = result.insertId;
  // Recipients: array of {recipient_user_id, recipient_dept_id, recipient_div_id}
  const recips = JSON.parse(recipients);
  for (const r of recips) {
    await pool.query('INSERT INTO letter_recipients (letter_id, recipient_user_id, recipient_dept_id, recipient_div_id) VALUES (?, ?, ?, ?)', [letter_id, r.recipient_user_id, r.recipient_dept_id, r.recipient_div_id]);
    // Mock SMS
    console.log(`SMS to user ${r.recipient_user_id || ''} dept ${r.recipient_dept_id || ''} div ${r.recipient_div_id || ''}: New letter received.`);
  }
  // Files
  for (const file of req.files) {
    const uniqueName = static_id + '_' + crypto.randomBytes(4).toString('hex') + path.extname(file.originalname);
    const fs = await import('fs/promises');
    await fs.rename(file.path, path.join('uploads', uniqueName));
    await pool.query('INSERT INTO files (letter_id, file_path, original_name) VALUES (?, ?, ?)', [letter_id, uniqueName, file.originalname]);
  }
  res.json({ message: 'Letter dispatched', static_id });
});

// Received letters
router.get('/received', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const [rows] = await pool.query(
    `SELECT l.*, lr.read_status, lr.id as lr_id, u.name as sender_name FROM letter_recipients lr
     JOIN letters l ON lr.letter_id = l.id
     JOIN users u ON l.sender_id = u.id
     WHERE lr.recipient_user_id = ? ORDER BY l.created_at DESC LIMIT 100`,
    [user_id]
  );
  // Fetch files for each letter
  for (const letter of rows) {
    const [files] = await pool.query('SELECT id, file_path, original_name FROM files WHERE letter_id = ?', [letter.id]);
    letter.files = files;
  }
  res.json(rows);
});

// Sent letters
router.get('/sent', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const [rows] = await pool.query(
    `SELECT l.*, COUNT(lr.id) as recipient_count FROM letters l
     LEFT JOIN letter_recipients lr ON l.id = lr.letter_id
     WHERE l.sender_id = ? GROUP BY l.id ORDER BY l.created_at DESC LIMIT 100`,
    [user_id]
  );
  res.json(rows);
});

// Advanced Search letters
router.get('/search', authenticateToken, async (req, res) => {
  const {
    searchIn = 'received',
    status = 'both',
    staticId = '',
    letterNo = '',
    letterDateFrom = '',
    letterDateTo = '',
    subject = '',
    dispatchDateFrom = '',
    dispatchDateTo = '',
    senderUnit = '', // Not implemented in schema, placeholder
    senderDepartment = ''
  } = req.query;
  const user_id = req.user.id;
  let sql = '';
  let params = [];
  if (searchIn === 'received') {
    sql = `SELECT l.*, lr.read_status, lr.id as lr_id, u.name as sender_name FROM letter_recipients lr
      JOIN letters l ON lr.letter_id = l.id
      JOIN users u ON l.sender_id = u.id
      WHERE lr.recipient_user_id = ?`;
    params.push(user_id);
    if (status !== 'both') {
      sql += ' AND lr.read_status = ?';
      params.push(status);
    }
  } else {
    sql = `SELECT l.*, u.name as sender_name FROM letters l
      JOIN users u ON l.sender_id = u.id
      WHERE l.sender_id = ?`;
    params.push(user_id);
  }
  if (staticId) {
    sql += ' AND l.static_id LIKE ?';
    params.push(`%${staticId}%`);
  }
  if (letterNo) {
    sql += ' AND l.letter_no LIKE ?';
    params.push(`%${letterNo}%`);
  }
  if (letterDateFrom && letterDateTo) {
    sql += ' AND DATE(l.created_at) BETWEEN ? AND ?';
    params.push(letterDateFrom, letterDateTo);
  }
  if (subject) {
    sql += ' AND l.subject LIKE ?';
    params.push(`%${subject}%`);
  }
  if (dispatchDateFrom && dispatchDateTo) {
    sql += ' AND DATE(l.created_at) BETWEEN ? AND ?';
    params.push(dispatchDateFrom, dispatchDateTo);
  }
  if (senderDepartment) {
    sql += ' AND l.sender_dept_id IN (SELECT id FROM departments WHERE name_en LIKE ?)';
    params.push(`%${senderDepartment}%`);
  }
  sql += ' ORDER BY l.created_at DESC LIMIT 100';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// Mark as read/unread
router.post('/mark-read', authenticateToken, async (req, res) => {
  const { lr_ids, status } = req.body; // status: 'read' or 'unread'
  if (!Array.isArray(lr_ids) || !['read','unread'].includes(status)) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  for (const lr_id of lr_ids) {
    await pool.query('UPDATE letter_recipients SET read_status = ? WHERE id = ? AND recipient_user_id = ?', [status, lr_id, req.user.id]);
  }
  res.json({ message: 'Status updated' });
});

// Forward letter
router.post('/forward', authenticateToken, async (req, res) => {
  const { letter_id, recipients } = req.body;
  if (!letter_id || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  for (const r of recipients) {
    await pool.query('INSERT INTO letter_recipients (letter_id, recipient_user_id, recipient_dept_id, recipient_div_id, forwarded_from_id) VALUES (?, ?, ?, ?, ?)', [letter_id, r.recipient_user_id, r.recipient_dept_id, r.recipient_div_id, req.user.id]);
    // Mock SMS
    console.log(`SMS to user ${r.recipient_user_id || ''} dept ${r.recipient_dept_id || ''} div ${r.recipient_div_id || ''}: Letter forwarded.`);
  }
  await pool.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [req.user.id, 'forward', `Forwarded letter ${letter_id}`]);
  res.json({ message: 'Letter forwarded' });
});

// Reply to letter
router.post('/reply', authenticateToken, upload.array('files'), async (req, res) => {
  const { parent_letter_id, subject, body, recipients } = req.body;
  if (!parent_letter_id || !subject || !recipients) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  const sender_id = req.user.id;
  const sender_dept_id = req.user.department_id;
  const sender_div_id = req.user.division_id;
  const static_id = generateStaticId();
  const [result] = await pool.query(
    'INSERT INTO letters (static_id, letter_type, subject, body, sender_id, sender_dept_id, sender_div_id, status, parent_letter_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [static_id, 'Reply', subject, body, sender_id, sender_dept_id, sender_div_id, 'dispatched', parent_letter_id]
  );
  const letter_id = result.insertId;
  const recips = JSON.parse(recipients);
  for (const r of recips) {
    await pool.query('INSERT INTO letter_recipients (letter_id, recipient_user_id, recipient_dept_id, recipient_div_id) VALUES (?, ?, ?, ?)', [letter_id, r.recipient_user_id, r.recipient_dept_id, r.recipient_div_id]);
    // Mock SMS
    console.log(`SMS to user ${r.recipient_user_id || ''} dept ${r.recipient_dept_id || ''} div ${r.recipient_div_id || ''}: Reply received.`);
  }
  for (const file of req.files) {
    const uniqueName = static_id + '_' + crypto.randomBytes(4).toString('hex') + path.extname(file.originalname);
    const fs = await import('fs/promises');
    await fs.rename(file.path, path.join('uploads', uniqueName));
    await pool.query('INSERT INTO files (letter_id, file_path, original_name) VALUES (?, ?, ?)', [letter_id, uniqueName, file.originalname]);
  }
  await pool.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [req.user.id, 'reply', `Replied to letter ${parent_letter_id}`]);
  res.json({ message: 'Reply sent', static_id });
});

export default router;