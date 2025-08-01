import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DepartmentsAdminTab() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_hi: '', type: '' });
  const [actionMsg, setActionMsg] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/departments', { headers: { Authorization: 'Bearer ' + token } });
      setDepartments(res.data);
    } catch {
      setError('Failed to load departments.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleAdd = () => {
    setForm({ name_en: '', name_hi: '', type: '' });
    setShowAdd(true);
  };

  const handleEdit = dept => {
    setEditDept(dept);
    setForm({ ...dept });
    setShowEdit(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this department?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/departments/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      setActionMsg('Department deleted.');
      fetchDepartments();
    } catch {
      setActionMsg('Failed to delete department.');
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/departments', form, { headers: { Authorization: 'Bearer ' + token } });
      setShowAdd(false);
      setActionMsg('Department added.');
      fetchDepartments();
    } catch {
      setActionMsg('Failed to add department.');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/departments/${editDept.id}`, form, { headers: { Authorization: 'Bearer ' + token } });
      setShowEdit(false);
      setActionMsg('Department updated.');
      fetchDepartments();
    } catch {
      setActionMsg('Failed to update department.');
    }
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add Department</button>
        {actionMsg && <span className="text-success ms-2">{actionMsg}</span>}
      </div>
      {loading ? <div>Loading departments...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>Name (EN)</th>
                <th>Name (HI)</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.id}>
                  <td>{d.name_en}</td>
                  <td>{d.name_hi}</td>
                  <td>{d.type}</td>
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
      {/* Add Department Modal */}
      {showAdd && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header"><h5 className="modal-title">Add Department</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name_en" placeholder="Name (EN)" value={form.name_en} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="name_hi" placeholder="Name (HI)" value={form.name_hi} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="type" placeholder="Type" value={form.type} onChange={handleFormChange} />
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
      {/* Edit Department Modal */}
      {showEdit && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header"><h5 className="modal-title">Edit Department</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name_en" placeholder="Name (EN)" value={form.name_en} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="name_hi" placeholder="Name (HI)" value={form.name_hi} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="type" placeholder="Type" value={form.type} onChange={handleFormChange} />
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

export default DepartmentsAdminTab; 