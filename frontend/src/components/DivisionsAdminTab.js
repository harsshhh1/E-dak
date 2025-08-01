import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DivisionsAdminTab() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editDiv, setEditDiv] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_hi: '', department_id: '' });
  const [actionMsg, setActionMsg] = useState('');

  const fetchDivisions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/divisions', { headers: { Authorization: 'Bearer ' + token } });
      setDivisions(res.data);
    } catch {
      setError('Failed to load divisions.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchDivisions(); }, []);

  const handleAdd = () => {
    setForm({ name_en: '', name_hi: '', department_id: '' });
    setShowAdd(true);
  };

  const handleEdit = div => {
    setEditDiv(div);
    setForm({ ...div });
    setShowEdit(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this division?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/divisions/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      setActionMsg('Division deleted.');
      fetchDivisions();
    } catch {
      setActionMsg('Failed to delete division.');
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/divisions', form, { headers: { Authorization: 'Bearer ' + token } });
      setShowAdd(false);
      setActionMsg('Division added.');
      fetchDivisions();
    } catch {
      setActionMsg('Failed to add division.');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/divisions/${editDiv.id}`, form, { headers: { Authorization: 'Bearer ' + token } });
      setShowEdit(false);
      setActionMsg('Division updated.');
      fetchDivisions();
    } catch {
      setActionMsg('Failed to update division.');
    }
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add Division</button>
        {actionMsg && <span className="text-success ms-2">{actionMsg}</span>}
      </div>
      {loading ? <div>Loading divisions...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>Name (EN)</th>
                <th>Name (HI)</th>
                <th>Department ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map(d => (
                <tr key={d.id}>
                  <td>{d.name_en}</td>
                  <td>{d.name_hi}</td>
                  <td>{d.department_id}</td>
                  <td>
                    <button className="btn btn-link btn-sm" onClick={() => handleEdit(d)}>Edit</button>
                    <button className="btn btn-link btn-sm text-danger" onClick={() => handleDelete(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add Division Modal */}
      {showAdd && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header"><h5 className="modal-title">Add Division</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name_en" placeholder="Name (EN)" value={form.name_en} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="name_hi" placeholder="Name (HI)" value={form.name_hi} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="department_id" placeholder="Department ID" value={form.department_id} onChange={handleFormChange} required />
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
      {/* Edit Division Modal */}
      {showEdit && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header"><h5 className="modal-title">Edit Division</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name_en" placeholder="Name (EN)" value={form.name_en} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="name_hi" placeholder="Name (HI)" value={form.name_hi} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="department_id" placeholder="Department ID" value={form.department_id} onChange={handleFormChange} required />
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

export default DivisionsAdminTab; 