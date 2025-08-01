import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NoticeBoardPanel() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', visible_to: 'all' });
  const [actionMsg, setActionMsg] = useState('');
  const role = localStorage.getItem('role');

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/notices', { headers: { Authorization: 'Bearer ' + token } });
      setNotices(res.data);
    } catch {
      setError('Failed to load notices.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleAdd = () => {
    setForm({ title: '', content: '', visible_to: 'all' });
    setShowAdd(true);
  };

  const handleEdit = notice => {
    setEditNotice(notice);
    setForm({ ...notice });
    setShowEdit(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notices/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      setActionMsg('Notice deleted.');
      fetchNotices();
    } catch {
      setActionMsg('Failed to delete notice.');
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/notices', form, { headers: { Authorization: 'Bearer ' + token } });
      setShowAdd(false);
      setActionMsg('Notice added.');
      fetchNotices();
    } catch {
      setActionMsg('Failed to add notice.');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notices/${editNotice.id}`, form, { headers: { Authorization: 'Bearer ' + token } });
      setShowEdit(false);
      setActionMsg('Notice updated.');
      fetchNotices();
    } catch {
      setActionMsg('Failed to update notice.');
    }
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <h5>Notice Board</h5>
        {role === 'admin' && <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add Notice</button>}
        {actionMsg && <span className="text-success ms-2">{actionMsg}</span>}
      </div>
      {loading ? <div>Loading notices...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Visible To</th>
                <th>Created At</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {notices.map(n => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.content}</td>
                  <td>{n.visible_to}</td>
                  <td>{n.created_at}</td>
                  {role === 'admin' && (
                    <td>
                      <button className="btn btn-link btn-sm" onClick={() => handleEdit(n)}>Edit</button>
                      <button className="btn btn-link btn-sm text-danger" onClick={() => handleDelete(n.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add Notice Modal */}
      {showAdd && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header"><h5 className="modal-title">Add Notice</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required />
                  <textarea className="form-control mb-2" name="content" placeholder="Content" value={form.content} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="visible_to" placeholder="Visible To (e.g. all, admin, employee)" value={form.visible_to} onChange={handleFormChange} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Notice Modal */}
      {showEdit && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header"><h5 className="modal-title">Edit Notice</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required />
                  <textarea className="form-control mb-2" name="content" placeholder="Content" value={form.content} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="visible_to" placeholder="Visible To (e.g. all, admin, employee)" value={form.visible_to} onChange={handleFormChange} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowEdit(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeBoardPanel; 