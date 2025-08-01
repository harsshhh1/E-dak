import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SentLettersTable() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLetters = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/letters/sent', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        setLetters(res.data);
      } catch (err) {
        setError('Failed to load sent letters.');
      }
      setLoading(false);
    };
    fetchLetters();
  }, []);

  if (loading) return <div>Loading sent letters...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-sm align-middle">
        <thead className="table-danger">
          <tr>
            <th>Static ID</th>
            <th>Letter No. & Subject</th>
            <th>Recipients</th>
            <th>Dispatch Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {letters.map(l => (
            <tr key={l.id}>
              <td>{l.static_id}</td>
              <td>{l.letter_no}<br /><span className="text-muted">{l.subject}</span></td>
              <td>{l.recipient_count}</td>
              <td>{l.created_at && l.created_at.substring(0, 10)}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SentLettersTable; 