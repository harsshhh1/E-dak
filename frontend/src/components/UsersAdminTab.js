import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UsersAdminTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'employee', department_id: '', division_id: '', name: '', phone: '' });
  const [actionMsg, setActionMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', { headers: { Authorization: 'Bearer ' + token } });
      setUsers(res.data);
    } catch {
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = () => {
    setForm({ username: '', password: '', role: 'employee', department_id: '', division_id: '', name: '', phone: '' });
    setShowAdd(true);
  };

  const handleEdit = user => {
    setEditUser(user);
    setForm({ ...user, password: '' });
    setShowEdit(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      setActionMsg('User deleted.');
      fetchUsers();
    } catch {
      setActionMsg('Failed to delete user.');
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/users', form, { headers: { Authorization: 'Bearer ' + token } });
      setShowAdd(false);
      setActionMsg('User added.');
      fetchUsers();
    } catch {
      setActionMsg('Failed to add user.');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${editUser.id}`, form, { headers: { Authorization: 'Bearer ' + token } });
      setShowEdit(false);
      setActionMsg('User updated.');
      fetchUsers();
    } catch {
      setActionMsg('Failed to update user.');
    }
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add User</button>
        {actionMsg && <span className="text-success ms-2">{actionMsg}</span>}
      </div>
      {loading ? <div>Loading users...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Division</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.department_id}</td>
                  <td>{u.division_id}</td>
                  <td>{u.phone}</td>
                  <td>
                    <button className="btn btn-link btn-sm" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn btn-link btn-sm text-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add User Modal */}
      {showAdd && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header"><h5 className="modal-title">Add User</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="username" placeholder="Username" value={form.username} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="password" type="password" placeholder="Password" value={form.password} onChange={handleFormChange} required />
                  <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} />
                  <select className="form-select mb-2" name="role" value={form.role} onChange={handleFormChange}>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input className="form-control mb-2" name="department_id" placeholder="Department ID" value={form.department_id} onChange={handleFormChange} />
                  <select className="form-select mb-2" name="division_id" value={form.division_id} onChange={handleFormChange} required>
                    <option value="">Select Division</option>
                    <option value="Jaipur Division">Jaipur Division</option>
                    <option value="Jodhpur Division">Jodhpur Division</option>
                    <option value="Ajmer Division">Ajmer Division</option>
                    <option value="Bikaner Division">Bikaner Division</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
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
      {/* Edit User Modal */}
      {showEdit && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header"><h5 className="modal-title">Edit User</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
                  <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} />
                  <select className="form-select mb-2" name="role" value={form.role} onChange={handleFormChange}>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input className="form-control mb-2" name="department_id" placeholder="Department ID" value={form.department_id} onChange={handleFormChange} />
                  <select className="form-select mb-2" name="division_id" value={form.division_id} onChange={handleFormChange} required>
                    <option value="">Select Division</option>
                    <option value="Jaipur Division">Jaipur Division</option>
                    <option value="Jodhpur Division">Jodhpur Division</option>
                    <option value="Ajmer Division">Ajmer Division</option>
                    <option value="Bikaner Division">Bikaner Division</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
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

export default UsersAdminTab; 