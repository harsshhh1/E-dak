import pool from './db.js';
import bcrypt from 'bcryptjs';

export async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

export async function createUser({ username, password, role, department_id, division_id, name, phone }) {
  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash, role, department_id, division_id, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, password_hash, role, department_id, division_id, name, phone]
  );
  return result.insertId;
}

export async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password_hash);
} 