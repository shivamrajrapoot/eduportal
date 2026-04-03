// client/src/pages/ReattemptPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import axiosInstance from '../api/axiosInstance';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import QuestionPalette from '../components/QuestionPalette';

const ReattemptPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const {
    attemptId, questions, responses,
    currentIndex, setCurrentIndex,
    duration, startTest, resetTest,
  } = useTest();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchTest = async () => {
      try {
        // test ka data lo — attempt start mat karo
        const res = await axiosInstance.get(`/tests/${testId}`);
        const { test, questions } = res.data.data;

        // TestContext mein set karo — attemptId null rakho
        startTest({
          attemptId: null,
          questions,
          duration: test.duration,
          totalMarks: test.totalMarks,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Test load nahi ho saka!');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
    return () => resetTest();
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const responsesArray = Object.values(responses);

    // localStorage mein save karo — DB mein nahi
    const practiceResult = {
      testId,
      timeTaken,
      responses: responsesArray,
      date: new Date().toISOString(),
    };

    // existing practice results lo
    const existing = JSON.parse(localStorage.getItem('practiceResults') || '[]');
    existing.unshift(practiceResult); // naya result upar daalo
    localStorage.setItem('practiceResults', JSON.stringify(existing));

    // practice result page pe bhejo
    navigate(`/practice-result/${testId}`, {
      state: { responses: responsesArray, timeTaken },
    });
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Test load ho raha hai...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>{error}</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Left — Question area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px 20px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          background: '#FFF3E0',
        }}>
          <div>
            <h3 style={{ margin: 0 }}>Practice Mode</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Result sirf local save hoga</p>
          </div>
          <Timer duration={duration} onTimeUp={handleSubmit} />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '10px 20px',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Practice'}
          </button>
        </div>

        {/* Question */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
          />
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex === questions.length - 1}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right — Question palette */}
      <div style={{
        width: '220px',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
        background: '#fafafa',
      }}>
        <QuestionPalette />
      </div>
    </div>
  );
};

export default ReattemptPage;