// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Password Bhool Gaye?</h2>
      <p>Apni email daalo — reset link bhej denge!</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}
        >
          {loading ? 'Bhej raha hoon...' : 'Reset Link Bhejo'}
        </button>
      </form>

      <p><Link to="/login">Wapas Login pe jao</Link></p>
    </div>
  );
};

export default ForgotPassword;