// client/src/pages/CompleteProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const CompleteProfile = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.put('/user/complete-profile', { mobile });
      const updatedUser = res.data.data.user;

      // AuthContext update karo — naya user data ke saath
      login(accessToken, updatedUser);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2>Profile Complete Karo</h2>
      <p>Welcome <strong>{user?.name}</strong>! Mobile number add karo.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}
        >
          {loading ? 'Saving...' : 'Save karo'}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;