import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DispatchLetterForm from '../components/DispatchLetterForm';
import ReceivedLettersTable from '../components/ReceivedLettersTable';
import SentLettersTable from '../components/SentLettersTable';
import LettersSearchPanel from '../components/LettersSearchPanel';
import NoticeBoardPanel from '../components/NoticeBoardPanel';

const tabNames = [
  'Dispatch Letters',
  'Received Letters',
  'Sent Letters',
  'Search',
  'Notice Board'
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [loginTime] = useState(new Date().toLocaleString());
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-3">
        <img src="/indian-railways-logo.jpeg" alt="Indian Railways Logo" style={{ width: 80, height: 80 }} />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <b>User:</b> {name} ({role})
        </div>
        <div className="d-flex align-items-center gap-3">
          <div>
            <b>Login Time:</b> {loginTime}
          </div>
          {role === 'admin' && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleAdminPanel}
            >
              Admin Panel
            </button>
          )}
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
        {activeTab === 0 && <DispatchLetterForm />}
        {activeTab === 1 && <ReceivedLettersTable />}
        {activeTab === 2 && <SentLettersTable />}
        {activeTab === 3 && <LettersSearchPanel />}
        {activeTab === 4 && <NoticeBoardPanel />}
      </div>
    </div>
  );
}

export default Dashboard; 