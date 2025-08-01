import React, { useState, useEffect } from 'react';
import axios from 'axios';

const senderUnits = [
  { value: '', label: 'Any' },
  { value: 'Unit1', label: 'Unit 1' },
  { value: 'Unit2', label: 'Unit 2' },
  // Add more units as needed
];
const senderDepartments = [
  { value: '', label: 'Any' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'General Administration', label: 'General Administration' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Human Resources', label: 'Human Resources' },
  // Add more departments as needed
];

function LettersSearchPanel() {
  const [form, setForm] = useState({
    searchIn: 'received',
    status: 'both',
    staticId: '',
    letterNo: '',
    letterDateFrom: '',
    letterDateTo: '',
    letterDateAny: true,
    subject: '',
    dispatchDateFrom: '',
    dispatchDateTo: '',
    dispatchDateAny: true,
    senderUnit: '',
    senderDepartment: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Build query params
    const params = {
      searchIn: form.searchIn,
      status: form.status,
      staticId: form.staticId,
      letterNo: form.letterNo,
      subject: form.subject,
      senderUnit: form.senderUnit,
      senderDepartment: form.senderDepartment,
    };
    if (!form.letterDateAny) {
      params.letterDateFrom = form.letterDateFrom;
      params.letterDateTo = form.letterDateTo;
    }
    if (!form.dispatchDateAny) {
      params.dispatchDateFrom = form.dispatchDateFrom;
      params.dispatchDateTo = form.dispatchDateTo;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/letters/search', {
        headers: { Authorization: 'Bearer ' + token },
        params
      });
      setResults(res.data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="mt-3">
      <form className="mb-3" onSubmit={handleSearch}>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Search In:</div>
          <div className="col-md-10">
            <label className="me-2"><input type="radio" name="searchIn" value="received" checked={form.searchIn === 'received'} onChange={handleChange} /> Received</label>
            <label className="me-2"><input type="radio" name="searchIn" value="sent" checked={form.searchIn === 'sent'} onChange={handleChange} /> Sent</label>
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Status of Letter:</div>
          <div className="col-md-10">
            <label className="me-2"><input type="radio" name="status" value="read" checked={form.status === 'read'} onChange={handleChange} /> Read</label>
            <label className="me-2"><input type="radio" name="status" value="unread" checked={form.status === 'unread'} onChange={handleChange} /> Unread</label>
            <label className="me-2"><input type="radio" name="status" value="both" checked={form.status === 'both'} onChange={handleChange} /> Both</label>
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Static ID:</div>
          <div className="col-md-4"><input className="form-control" name="staticId" value={form.staticId} onChange={handleChange} /></div>
          <div className="col-md-2">Letter No.:</div>
          <div className="col-md-4"><input className="form-control" name="letterNo" value={form.letterNo} onChange={handleChange} /></div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Letter Date (Between):</div>
          <div className="col-md-2"><input type="date" className="form-control" name="letterDateFrom" value={form.letterDateFrom} onChange={handleChange} disabled={form.letterDateAny} /></div>
          <div className="col-md-2">To</div>
          <div className="col-md-2"><input type="date" className="form-control" name="letterDateTo" value={form.letterDateTo} onChange={handleChange} disabled={form.letterDateAny} /></div>
          <div className="col-md-2"><label><input type="checkbox" name="letterDateAny" checked={form.letterDateAny} onChange={handleChange} /> Any</label></div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Subject:</div>
          <div className="col-md-10"><input className="form-control" name="subject" value={form.subject} onChange={handleChange} /></div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Dispatch Date (Between):</div>
          <div className="col-md-2"><input type="date" className="form-control" name="dispatchDateFrom" value={form.dispatchDateFrom} onChange={handleChange} disabled={form.dispatchDateAny} /></div>
          <div className="col-md-2">To</div>
          <div className="col-md-2"><input type="date" className="form-control" name="dispatchDateTo" value={form.dispatchDateTo} onChange={handleChange} disabled={form.dispatchDateAny} /></div>
          <div className="col-md-2"><label><input type="checkbox" name="dispatchDateAny" checked={form.dispatchDateAny} onChange={handleChange} /> Any</label></div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-md-2">Sender Unit:</div>
          <div className="col-md-4">
            <select className="form-select" name="senderUnit" value={form.senderUnit} onChange={handleChange}>
              {senderUnits.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="col-md-2">Sender Department:</div>
          <div className="col-md-4">
            <select className="form-select" name="senderDepartment" value={form.senderDepartment} onChange={handleChange}>
              {senderDepartments.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12 text-center">
            <button className="btn btn-primary mt-2" type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
          </div>
        </div>
      </form>
      {results.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-danger">
              <tr>
                <th>Letter No</th>
                <th>Subject</th>
                <th>Sender</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {results.map(l => (
                <tr key={l.id}>
                  <td>{l.letter_no}</td>
                  <td>{l.subject}</td>
                  <td>{l.sender_name}</td>
                  <td>{l.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {results.length === 0 && !loading && <div>No results found.</div>}
    </div>
  );
}

export default LettersSearchPanel; 