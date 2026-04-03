// client/src/pages/TestList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axiosInstance.get('/tests/all');
        setTests(res.data.data.tests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>Available Tests</h2>

      {tests.length === 0 && <p>Koi test available nahi hai!</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        {tests.map((test) => (
          <div
            key={test._id}
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 8px' }}>{test.title}</h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{test.description}</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: '#888' }}>
                <span>Duration: {test.duration} min</span>
                <span>Marks: {test.totalMarks}</span>
                <span>Passing: {test.passingMarks}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/test/${test._id}`)}
              style={{
                padding: '10px 20px',
                background: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestList;