import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersAdminTab from '../components/UsersAdminTab';
import DepartmentsAdminTab from '../components/DepartmentsAdminTab';
import DivisionsAdminTab from '../components/DivisionsAdminTab';
import LogsAdminTab from '../components/LogsAdminTab';
import StatsAdminTab from '../components/StatsAdminTab';

const tabNames = [
  'Users',
  'Departments',
  'Divisions',
  'Logs',
  'Stats'
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  if (role !== 'admin') {
    return <div className="container mt-5 text-center">Access denied. Admins only.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <div className="d-flex align-items-center gap-3">
          <div>
            <b>Admin:</b> {name}
          </div>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <ul className="nav nav-tabs">
        {tabNames.map((tab, idx) => (
          <li className="nav-item" key={tab}>
            <button className={`nav-link${activeTab === idx ? ' active' : ''}`} onClick={() => setActiveTab(idx)}>{tab}</button>
          </li>
        ))}
      </ul>
      <div className="tab-content p-3 border border-top-0">
        {activeTab === 0 && <UsersAdminTab />}
        {activeTab === 1 && <DepartmentsAdminTab />}
        {activeTab === 2 && <DivisionsAdminTab />}
        {activeTab === 3 && <LogsAdminTab />}
        {activeTab === 4 && <StatsAdminTab />}
      </div>
    </div>
  );
}

export default AdminDashboard; 