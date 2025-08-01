import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReceivedLettersTable() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchLetters();
    // eslint-disable-next-line
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/letters/received', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setLetters(res.data);
    } catch (err) {
      setError('Failed to load received letters.');
    }
    setLoading(false);
  };

  const handleSelect = (lr_id, checked) => {
    setSelected(checked ? [...selected, lr_id] : selected.filter(id => id !== lr_id));
  };

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelected(letters.map(l => l.lr_id));
    } else {
      setSelected([]);
    }
  };

  const markReadStatus = async status => {
    if (selected.length === 0) return;
    setActionMsg('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/letters/mark-read', { lr_ids: selected, status }, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setActionMsg(`Marked as ${status}.`);
      setSelected([]);
      fetchLetters();
    } catch {
      setActionMsg('Failed to update status.');
    }
  };

  if (loading) return <div>Loading received letters...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-3">
      <div className="mb-2 d-flex gap-2">
        <button className="btn btn-outline-success btn-sm" disabled={selected.length === 0} onClick={() => markReadStatus('read')}>Mark as Read</button>
        <button className="btn btn-outline-secondary btn-sm" disabled={selected.length === 0} onClick={() => markReadStatus('unread')}>Mark as Unread</button>
        {actionMsg && <span className="ms-2 text-success">{actionMsg}</span>}
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-danger">
            <tr>
              <th><input type="checkbox" checked={selected.length === letters.length && letters.length > 0} onChange={handleSelectAll} /></th>
              <th>Read</th>
              <th>Static ID</th>
              <th>Letter No. & Subject</th>
              <th>Sender</th>
              <th>Files</th>
              <th>Dispatch Date</th>
              <th>Reply by Date</th>
              <th>Forward</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {letters.map(l => (
              <tr key={l.id} className={l.read_status === 'unread' ? 'fw-bold' : ''}>
                <td><input type="checkbox" checked={selected.includes(l.lr_id)} onChange={e => handleSelect(l.lr_id, e.target.checked)} /></td>
                <td><input type="checkbox" checked={l.read_status === 'read'} readOnly /></td>
                <td>{l.static_id}</td>
                <td>{l.letter_no}<br /><span className="text-muted">{l.subject}</span></td>
                <td>{l.sender_name}</td>
                <td>{l.files && l.files.length > 0 ? l.files.map(f => <a key={f.id} href={`/uploads/${f.file_path}`} target="_blank" rel="noopener noreferrer">{f.original_name}</a>) : '-'}</td>
                <td>{l.created_at && l.created_at.substring(0, 10)}</td>
                <td>{l.reply_by_date || '-'}</td>
                <td><button className="btn btn-link btn-sm" disabled>Forward</button></td>
                <td><button className="btn btn-link btn-sm" disabled>Reply</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceivedLettersTable; 