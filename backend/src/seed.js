import pool from './models/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  // Departments
  const departments = [
    { name_en: 'Engineering', name_hi: 'अभियांत्रिकी', type: 'Technical' },
    { name_en: 'General Administration', name_hi: 'सामान्य प्रशासन', type: 'Administrative' },
    { name_en: 'Finance', name_hi: 'वित्त', type: 'Financial' },
    { name_en: 'Human Resources', name_hi: 'मानव संसाधन', type: 'HR' }
  ];
  for (const d of departments) {
    await pool.query('INSERT INTO departments (name_en, name_hi, type) VALUES (?, ?, ?)', [d.name_en, d.name_hi, d.type]);
  }

  // Users
  const users = [
    { username: 'arjun.sharma', password: 'password1', role: 'admin', department_id: 1, division_id: 1, name: 'Arjun Sharma', phone: '9876543210' },
    { username: 'priya.singh', password: 'password2', role: 'employee', department_id: 1, division_id: 2, name: 'Priya Singh', phone: '9876543211' },
    { username: 'rahul.verma', password: 'password3', role: 'employee', department_id: 2, division_id: 3, name: 'Rahul Verma', phone: '9876543212' },
    { username: 'ananya.jain', password: 'password4', role: 'employee', department_id: 2, division_id: 4, name: 'Ananya Jain', phone: '9876543213' },
    { username: 'vikas.patel', password: 'password5', role: 'employee', department_id: 3, division_id: 5, name: 'Vikas Patel', phone: '9876543214' },
    { username: 'sneha.kumar', password: 'password6', role: 'employee', department_id: 3, division_id: 6, name: 'Sneha Kumar', phone: '9876543215' },
    { username: 'amit.dubey', password: 'password7', role: 'employee', department_id: 4, division_id: 7, name: 'Amit Dubey', phone: '9876543216' },
    { username: 'isha.agarwal', password: 'password8', role: 'employee', department_id: 4, division_id: 8, name: 'Isha Agarwal', phone: '9876543217' },
    { username: 'deepak.mishra', password: 'password9', role: 'employee', department_id: 1, division_id: 1, name: 'Deepak Mishra', phone: '9876543218' },
    { username: 'kavita.rana', password: 'password10', role: 'employee', department_id: 2, division_id: 3, name: 'Kavita Rana', phone: '9876543219' },
    { username: 'manish.gupta', password: 'password11', role: 'employee', department_id: 3, division_id: 5, name: 'Manish Gupta', phone: '9876543220' },
    { username: 'pooja.seth', password: 'password12', role: 'employee', department_id: 4, division_id: 7, name: 'Pooja Seth', phone: '9876543221' },
    { username: 'saurabh.yadav', password: 'password13', role: 'employee', department_id: 1, division_id: 2, name: 'Saurabh Yadav', phone: '9876543222' },
    { username: 'neha.bansal', password: 'password14', role: 'employee', department_id: 2, division_id: 4, name: 'Neha Bansal', phone: '9876543223' },
    { username: 'rohit.singh', password: 'password15', role: 'employee', department_id: 3, division_id: 6, name: 'Rohit Singh', phone: '9876543224' },
    { username: 'meena.joshi', password: 'password16', role: 'employee', department_id: 4, division_id: 8, name: 'Meena Joshi', phone: '9876543225' },
    { username: 'gaurav.pandey', password: 'password17', role: 'employee', department_id: 1, division_id: 1, name: 'Gaurav Pandey', phone: '9876543226' },
    { username: 'swati.saxena', password: 'password18', role: 'employee', department_id: 2, division_id: 3, name: 'Swati Saxena', phone: '9876543227' },
    { username: 'nilesh.kapoor', password: 'password19', role: 'employee', department_id: 3, division_id: 5, name: 'Nilesh Kapoor', phone: '9876543228' },
    { username: 'tanya.mehta', password: 'password20', role: 'employee', department_id: 4, division_id: 7, name: 'Tanya Mehta', phone: '9876543229' },
  ];

  for (const u of users) {
    const password_hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      'INSERT INTO users (username, password_hash, role, department_id, division_id, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.username, password_hash, u.role, u.department_id, u.division_id, u.name, u.phone]
    );
  }

  // Letters (dispatched and received)
  const letters = [
    { letter_no: 'DL/2024/001', letter_type: 'Dispatch', subject: 'Project Update', body: 'Project A update attached.', sender_id: 1, sender_dept_id: 1, sender_div_id: 1, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/002', letter_type: 'Dispatch', subject: 'Meeting Notice', body: 'Meeting scheduled for next week.', sender_id: 2, sender_dept_id: 1, sender_div_id: 2, reply_requested: true, status: 'dispatched' },
    { letter_no: 'DL/2024/003', letter_type: 'Dispatch', subject: 'Budget Approval', body: 'Budget approval required.', sender_id: 3, sender_dept_id: 2, sender_div_id: 3, reply_requested: true, status: 'dispatched' },
    { letter_no: 'DL/2024/004', letter_type: 'Dispatch', subject: 'Leave Application', body: 'Leave application for 5 days.', sender_id: 4, sender_dept_id: 2, sender_div_id: 4, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/005', letter_type: 'Dispatch', subject: 'Asset Handover', body: 'Asset handover details.', sender_id: 5, sender_dept_id: 3, sender_div_id: 5, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/006', letter_type: 'Dispatch', subject: 'Policy Update', body: 'New policy update.', sender_id: 6, sender_dept_id: 3, sender_div_id: 6, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/007', letter_type: 'Dispatch', subject: 'Training Schedule', body: 'Training schedule for new employees.', sender_id: 7, sender_dept_id: 4, sender_div_id: 7, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/008', letter_type: 'Dispatch', subject: 'Performance Review', body: 'Performance review meeting.', sender_id: 8, sender_dept_id: 4, sender_div_id: 8, reply_requested: true, status: 'dispatched' },
    { letter_no: 'DL/2024/009', letter_type: 'Dispatch', subject: 'Security Alert', body: 'Security alert for all staff.', sender_id: 9, sender_dept_id: 1, sender_div_id: 1, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/010', letter_type: 'Dispatch', subject: 'Maintenance Notice', body: 'Maintenance work on 15th.', sender_id: 10, sender_dept_id: 2, sender_div_id: 3, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/011', letter_type: 'Dispatch', subject: 'Salary Slip', body: 'Salary slip for March.', sender_id: 11, sender_dept_id: 3, sender_div_id: 5, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/012', letter_type: 'Dispatch', subject: 'Holiday List', body: 'List of holidays for 2024.', sender_id: 12, sender_dept_id: 4, sender_div_id: 7, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/013', letter_type: 'Dispatch', subject: 'Circular', body: 'Important circular attached.', sender_id: 13, sender_dept_id: 1, sender_div_id: 2, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/014', letter_type: 'Dispatch', subject: 'Transfer Order', body: 'Transfer order for staff.', sender_id: 14, sender_dept_id: 2, sender_div_id: 4, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/015', letter_type: 'Dispatch', subject: 'Joining Report', body: 'Joining report for new employee.', sender_id: 15, sender_dept_id: 3, sender_div_id: 6, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/016', letter_type: 'Dispatch', subject: 'Appreciation Letter', body: 'Appreciation for excellent work.', sender_id: 16, sender_dept_id: 4, sender_div_id: 8, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/017', letter_type: 'Dispatch', subject: 'Warning Notice', body: 'Warning for late attendance.', sender_id: 17, sender_dept_id: 1, sender_div_id: 1, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/018', letter_type: 'Dispatch', subject: 'Promotion Letter', body: 'Promotion details enclosed.', sender_id: 18, sender_dept_id: 2, sender_div_id: 3, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/019', letter_type: 'Dispatch', subject: 'Resignation Acceptance', body: 'Resignation accepted.', sender_id: 19, sender_dept_id: 3, sender_div_id: 5, reply_requested: false, status: 'dispatched' },
    { letter_no: 'DL/2024/020', letter_type: 'Dispatch', subject: 'Conference Invite', body: 'Invitation to annual conference.', sender_id: 20, sender_dept_id: 4, sender_div_id: 7, reply_requested: false, status: 'dispatched' },
  ];

  for (const l of letters) {
    const static_id = 'ST' + Date.now() + Math.floor(Math.random() * 1000);
    const [result] = await pool.query(
      'INSERT INTO letters (static_id, letter_no, letter_type, subject, body, sender_id, sender_dept_id, sender_div_id, reply_requested, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [static_id, l.letter_no, l.letter_type, l.subject, l.body, l.sender_id, l.sender_dept_id, l.sender_div_id, l.reply_requested, l.status]
    );
    const letter_id = result.insertId;
    // Add recipients (for demo, send to next user)
    const recipient_id = l.sender_id % users.length + 1;
    await pool.query('INSERT INTO letter_recipients (letter_id, recipient_user_id, recipient_dept_id, recipient_div_id) VALUES (?, ?, ?, ?)', [letter_id, recipient_id, l.sender_dept_id, l.sender_div_id]);
  }

  // Logs
  const logs = [
    { user_id: 1, action: 'login', details: 'User logged in.' },
    { user_id: 2, action: 'dispatch', details: 'Dispatched letter DL/2024/002.' },
    { user_id: 3, action: 'receive', details: 'Received letter DL/2024/003.' },
    { user_id: 4, action: 'update', details: 'Updated profile.' },
    { user_id: 5, action: 'logout', details: 'User logged out.' },
    { user_id: 6, action: 'dispatch', details: 'Dispatched letter DL/2024/006.' },
    { user_id: 7, action: 'receive', details: 'Received letter DL/2024/007.' },
    { user_id: 8, action: 'login', details: 'User logged in.' },
    { user_id: 9, action: 'dispatch', details: 'Dispatched letter DL/2024/009.' },
    { user_id: 10, action: 'receive', details: 'Received letter DL/2024/010.' }
  ];
  for (const log of logs) {
    await pool.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [log.user_id, log.action, log.details]);
  }

  // Notices
  const notices = [
    { title: 'Holiday on 15th August', content: 'Office will remain closed on Independence Day.', visible_to: 'all' },
    { title: 'COVID-19 Guidelines', content: 'Follow the latest COVID-19 safety protocols.', visible_to: 'all' },
    { title: 'Maintenance Notice', content: 'Server maintenance on Sunday.', visible_to: 'all' },
    { title: 'New Policy Update', content: 'Please read the updated HR policy document.', visible_to: 'all' }
  ];
  for (const notice of notices) {
    await pool.query('INSERT INTO notices (title, content, visible_to) VALUES (?, ?, ?)', [notice.title, notice.content, notice.visible_to]);
  }

  console.log('Seeded users, departments, letters, logs, and notices.');
  process.exit(0);
}

seed(); 