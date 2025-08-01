import React, { useState } from 'react';
import axios from 'axios';

const departmentOptions = [
  { id: 1, name: 'Engineering', category: 'Department' },
  { id: 2, name: 'General', category: 'Department' },
  { id: 3, name: 'Ajmer Division', category: 'Division' },
  { id: 4, name: 'Bikaner Division', category: 'Division' },
  // ...add more as needed
];

const divisionOptions = [
  { id: 1, name: 'Jaipur Division' },
  { id: 2, name: 'Jodhpur Division' },
  { id: 3, name: 'Ajmer Division' },
  { id: 4, name: 'Bikaner Division' },
  { id: 5, name: 'Miscellaneous' }
];

const letterTypes = ['General', 'RTI', 'Confidential'];

function DispatchLetterForm() {
  const [form, setForm] = useState({
    letter_type: 'General',
    letter_no: '',
    letter_date: '',
    subject: '',
    reply_requested: 'No',
    reply_by_date: '',
    departments: [],
    files: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeptChange = e => {
    const value = Array.from(e.target.selectedOptions, opt => opt.value);
    setForm({ ...form, departments: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, files: Array.from(e.target.files) });
  };

  const validate = () => {
    const special = /[()&']/;
    if (special.test(form.letter_no) || special.test(form.subject)) {
      setError('No special characters like (), &, \' allowed in Letter No. or Subject.');
      return false;
    }
    if (!form.letter_no || !form.letter_date || !form.subject) {
      setError('Please fill all required fields.');
      return false;
    }
    if (form.files.some(f => f.size > 10 * 1024 * 1024)) {
      setError('Each file must be less than 10 MB.');
      return false;
    }
    if (form.departments.length === 0) {
      setError('Select at least one department/division.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('letter_type', form.letter_type);
      data.append('letter_no', form.letter_no);
      data.append('letter_date', form.letter_date);
      data.append('subject', form.subject);
      data.append('body', ''); // Optionally add body field
      data.append('reply_requested', form.reply_requested === 'Yes');
      data.append('reply_by_date', form.reply_by_date);
      // Mock recipients: just department IDs for now
      data.append('recipients', JSON.stringify(form.departments.map(id => ({ recipient_dept_id: id }))));
      form.files.forEach(f => data.append('files', f));
      const token = localStorage.getItem('token');
      await axios.post('/api/letters/dispatch', data, {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Letter dispatched successfully!');
      setForm({ ...form, letter_no: '', letter_date: '', subject: '', reply_by_date: '', files: [] });
    } catch (err) {
      setError('Failed to dispatch letter.');
    }
    setUploading(false);
  };

  return (
    <form className="mt-3" onSubmit={handleSubmit}>
      <div className="row mb-2">
        <div className="col-md-3">
          <label className="form-label">Letter Type / पत्र का प्रकार</label>
          <select className="form-select" name="letter_type" value={form.letter_type} onChange={handleChange}>
            {letterTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Letter No. / पत्र संख्या</label>
          <input className="form-control" name="letter_no" value={form.letter_no} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Letter Date / पत्र दिनांक</label>
          <input type="date" className="form-control" name="letter_date" value={form.letter_date} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Reply Requested / उत्तर अपेक्षित</label>
          <select className="form-select" name="reply_requested" value={form.reply_requested} onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-6">
          <label className="form-label">Subject / विषय</label>
          <input className="form-control" name="subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Reply by Date / उत्तर की तिथि</label>
          <input type="date" className="form-control" name="reply_by_date" value={form.reply_by_date} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Departments/Divisions / विभाग/मंडल</label>
          <select className="form-select" multiple size={4} value={form.departments} onChange={handleDeptChange}>
            {divisionOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label className="form-label">Attach Files (max 10MB each) / फ़ाइल संलग्न करें</label>
        <input type="file" className="form-control" multiple onChange={handleFileChange} />
      </div>
      {error && <div className="alert alert-danger py-1">{error}</div>}
      {success && <div className="alert alert-success py-1">{success}</div>}
      <button className="btn btn-danger" disabled={uploading}>{uploading ? 'Dispatching...' : 'Dispatch Letter'}</button>
    </form>
  );
}

export default DispatchLetterForm; 