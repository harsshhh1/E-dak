import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="nwr-header">
        <h2>North Western Railway | ई डाक</h2>
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<div className="container mt-5">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App; 