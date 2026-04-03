// client/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PasswordInput from '../components/PasswordInput';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      return setError('Passwords match nahi kar rahe!');
    }

    setLoading(true);

    try {
      const res = await axiosInstance.put(`/auth/reset-password/${token}`, { password });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Naya Password Set Karo</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <PasswordInput
          placeholder="Naya Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordInput
          placeholder="Password Confirm Karo"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>
          {loading ? 'Saving...' : 'Password Reset Karo'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;