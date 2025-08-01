import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LogsAdminTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/logs', { headers: { Authorization: 'Bearer ' + token } });
        setLogs(res.data);
      } catch {
        setError('Failed to load logs.');
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h5>Logs</h5>
      {loading ? <div>Loading logs...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Action</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user_id}</td>
                  <td>{log.action}</td>
                  <td>{log.details}</td>
                  <td>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LogsAdminTab; 