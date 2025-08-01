-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','employee') NOT NULL,
  department_id INT,
  division_id INT,
  name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  type VARCHAR(50)
);

-- Divisions
CREATE TABLE divisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Letters
CREATE TABLE letters (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  static_id VARCHAR(30) NOT NULL UNIQUE,
  letter_no VARCHAR(50),
  letter_type VARCHAR(30),
  subject VARCHAR(255),
  body TEXT,
  sender_id INT,
  sender_dept_id INT,
  sender_div_id INT,
  reply_requested BOOLEAN DEFAULT FALSE,
  reply_by_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(30),
  parent_letter_id BIGINT,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);
CREATE INDEX idx_letter_no ON letters(letter_no);
CREATE INDEX idx_static_id ON letters(static_id);
CREATE INDEX idx_created_at ON letters(created_at);

-- Letter Recipients
CREATE TABLE letter_recipients (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  letter_id BIGINT,
  recipient_user_id INT,
  recipient_dept_id INT,
  recipient_div_id INT,
  read_status ENUM('unread','read') DEFAULT 'unread',
  forwarded_from_id INT,
  FOREIGN KEY (letter_id) REFERENCES letters(id)
);
CREATE INDEX idx_recipient_user_id ON letter_recipients(recipient_user_id);

-- Files
CREATE TABLE files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  letter_id BIGINT,
  file_path VARCHAR(255),
  original_name VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (letter_id) REFERENCES letters(id)
);

-- Logs
CREATE TABLE logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notices
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visible_to VARCHAR(100)
);

CREATE DATABASE edak;
EXIT; 