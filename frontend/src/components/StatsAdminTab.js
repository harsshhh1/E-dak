import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function StatsAdminTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/stats', { headers: { Authorization: 'Bearer ' + token } });
        setStats(res.data);
      } catch {
        setError('Failed to load stats.');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const pieData = stats ? {
    labels: ['Read', 'Unread', 'Replied', 'Not Replied'],
    datasets: [
      {
        data: [stats.read_count, stats.unread_count, stats.replied_count, stats.not_replied_count],
        backgroundColor: [
          '#28a745', // green
          '#dc3545', // red
          '#007bff', // blue
          '#ffc107', // yellow
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div>
      <h5>System Stats</h5>
      {loading ? <div>Loading stats...</div> : error ? <div className="alert alert-danger">{error}</div> : stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card card-body text-center">
                <h6>Users</h6>
                <div className="display-6">{stats.user_count}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-body text-center">
                <h6>Departments</h6>
                <div className="display-6">{stats.dept_count}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-body text-center">
                <h6>Divisions</h6>
                <div className="display-6">{stats.div_count}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-body text-center">
                <h6>Letters</h6>
                <div className="display-6">{stats.letter_count}</div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card card-body">
                <h6 className="text-center">Letter Status Distribution</h6>
                <div style={{ height: 300 }}>
                  {pieData && <Pie data={pieData} />}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsAdminTab; 