// client/src/pages/ResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axiosInstance.get(`/attempts/result/${attemptId}`);
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Result load ho raha hai...</p>;
  if (!result) return <p style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>Result nahi mila!</p>;

  const { attempt, responses, insights } = result;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>

      {/* Score Summary */}
      <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '24px' }}>
        <h2>{attempt.testId.title}</h2>
        <h1 style={{ fontSize: '48px', color: 'blue', margin: '10px 0' }}>
          {attempt.score} / {attempt.totalMarks}
        </h1>
        <p style={{ fontSize: '20px', color: '#666' }}>Accuracy: {attempt.accuracy}%</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '16px' }}>
          <span style={{ color: 'green' }}>Correct: {attempt.correct}</span>
          <span style={{ color: 'red' }}>Incorrect: {attempt.incorrect}</span>
          <span style={{ color: '#888' }}>Skipped: {attempt.skipped}</span>
          <span style={{ color: '#FF9800' }}>Marked: {attempt.markedForReview}</span>
        </div>
        <p style={{ color: '#888', marginTop: '8px' }}>
          Time taken: {Math.floor(attempt.timeTaken / 60)} min {attempt.timeTaken % 60} sec
        </p>
      </div>

      {/* Insights */}
      {insights && (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '24px' }}>
          <h3>Insights</h3>
          {insights.mostTimeConsuming && (
            <p>Most time consuming: <strong>{insights.mostTimeConsuming.questionText}</strong> ({insights.mostTimeConsuming.timeTaken}s)</p>
          )}
          {insights.mostIncorrect && (
            <p>Incorrect questions: <strong>{insights.mostIncorrect.count}</strong></p>
          )}
          {insights.mostMarkedForReview && (
            <p>Marked for review: <strong>{insights.mostMarkedForReview.count}</strong></p>
          )}
        </div>
      )}

      {/* Per Question Analysis */}
      <h3>Question-wise Analysis</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {responses.map((response, index) => {
          const q = response.questionId;
          const statusColor = {
            correct: '#E8F5E9',
            incorrect: '#FFEBEE',
            skipped: '#F5F5F5',
            marked: '#FFF3E0',
          }[response.status] || '#F5F5F5';

          return (
            <div key={response._id} style={{ padding: '16px', background: statusColor, borderRadius: '10px', border: '1px solid #ddd' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Q{index + 1}. {q.questionText}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {q.options.map((opt) => {
                  let bg = 'transparent';
                  if (opt.label === q.correctAnswer) bg = '#C8E6C9'; // green — correct
                  if (opt.label === response.selectedAnswer && !response.isCorrect) bg = '#FFCDD2'; // red — wrong

                  return (
                    <div key={opt.label} style={{ padding: '6px 10px', background: bg, borderRadius: '6px' }}>
                      <strong>{opt.label}.</strong> {opt.text}
                      {opt.label === q.correctAnswer && <span style={{ color: 'green', marginLeft: '8px' }}>Correct Answer</span>}
                      {opt.label === response.selectedAnswer && !response.isCorrect && <span style={{ color: 'red', marginLeft: '8px' }}>Your Answer</span>}
                    </div>
                  );
                })}
              </div>

              {/* Meta info */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#666' }}>
                <span>Status: <strong style={{ color: response.status === 'correct' ? 'green' : response.status === 'incorrect' ? 'red' : '#888' }}>{response.status}</strong></span>
                <span>Time: {response.timeTaken}s</span>
                {response.markedForReview && <span style={{ color: '#FF9800' }}>Marked for Review</span>}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#E3F2FD', borderRadius: '6px', fontSize: '14px' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginTop: '30px', padding: '12px 24px', background: 'blue', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        <b> Back to Dashboard </b>
      </button>
    </div>
  );
};

export default ResultPage;