import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [fpUsername, setFpUsername] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpMsg, setFpMsg] = useState('');
  const [fpStep, setFpStep] = useState(1);
  const [fpOtp, setFpOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setFpMsg('');
    try {
      await axios.post('/api/auth/forgot-password', { username: fpUsername, newPassword: fpNewPassword });
      setFpMsg('Password reset successful. You can now log in with the new password.');
    } catch {
      setFpMsg('Failed to reset password. Check username.');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setFpMsg('');
    try {
      await axios.post('/api/auth/request-otp', { username: fpUsername });
      setFpMsg('OTP sent! (Check backend console in demo)');
      setFpStep(2);
    } catch {
      setFpMsg('Failed to send OTP. Check username.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpMsg('');
    try {
      await axios.post('/api/auth/verify-otp', { username: fpUsername, otp: fpOtp, newPassword: fpNewPassword });
      setFpMsg('Password reset successful. You can now log in with the new password.');
      setFpStep(1);
      setShowForgot(false);
    } catch (err) {
      setFpMsg('Failed to reset password. Check OTP and try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <div className="card p-4">
        <div className="text-center mb-3">
          <img src="/indian-railways-logo.jpeg" alt="Indian Railways Logo" style={{ width: 80, height: 80 }} />
        </div>
        <h4 className="mb-3 text-center">Login | लॉगिन</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username / उपयोगकर्ता नाम</label>
            <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password / पासवर्ड</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button className="btn btn-danger w-100">Login</button>
        </form>
        <div className="text-center mt-2">
          <button className="btn btn-link p-0" onClick={() => { setShowForgot(true); setFpStep(1); setFpMsg(''); setFpUsername(''); setFpOtp(''); setFpNewPassword(''); }}>Forgot Password?</button>
        </div>
      </div>
      {/* Forgot Password Modal (OTP flow) */}
      {showForgot && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              {fpStep === 1 ? (
                <form onSubmit={handleRequestOtp}>
                  <div className="modal-header"><h5 className="modal-title">Request OTP</h5></div>
                  <div className="modal-body">
                    <input className="form-control mb-2" placeholder="Username" value={fpUsername} onChange={e => setFpUsername(e.target.value)} required />
                    {fpMsg && <div className="alert alert-info py-1">{fpMsg}</div>}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" type="button" onClick={() => setShowForgot(false)}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Send OTP</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="modal-header"><h5 className="modal-title">Reset Password</h5></div>
                  <div className="modal-body">
                    <input className="form-control mb-2" placeholder="Username" value={fpUsername} onChange={e => setFpUsername(e.target.value)} required disabled />
                    <input className="form-control mb-2" placeholder="OTP" value={fpOtp} onChange={e => setFpOtp(e.target.value)} required />
                    <input className="form-control mb-2" type="password" placeholder="New Password" value={fpNewPassword} onChange={e => setFpNewPassword(e.target.value)} required />
                    {fpMsg && <div className="alert alert-info py-1">{fpMsg}</div>}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" type="button" onClick={() => { setShowForgot(false); setFpStep(1); }}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Reset</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage; 