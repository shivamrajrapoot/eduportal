// client/src/pages/PracticeResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const PracticeResultPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { responses, timeTaken } = location.state || {};

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/tests/${testId}`);
        setTest(res.data.data.test);
        setQuestions(res.data.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>;
  if (!responses) return <p style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>Result nahi mila!</p>;

  // score calculate karo locally
  let correct = 0, incorrect = 0, skipped = 0;
  let score = 0;

  responses.forEach(r => {
    const question = questions.find(q => q._id === r.questionId);
    if (!question) return;

    if (!r.selectedAnswer) {
      skipped++;
    } else if (r.selectedAnswer === question.correctAnswer) {
      correct++;
      score += question.marks;
    } else {
      incorrect++;
      score -= (test.negativeMarking * question.marks);
    }
  });

  score = Math.max(0, score);
  const attempted = correct + incorrect;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>

      {/* Practice mode badge */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span style={{ background: '#FFF3E0', color: '#E65100', padding: '4px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Practice Mode Result
        </span>
      </div>

      {/* Score Summary */}
      <div style={{ textAlign: 'center', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '24px' }}>
        <h2>{test?.title}</h2>
        <h1 style={{ fontSize: '48px', color: '#FF9800', margin: '10px 0' }}>
          {score} / {test?.totalMarks}
        </h1>
        <p style={{ fontSize: '20px', color: '#666' }}>Accuracy: {accuracy}%</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '16px' }}>
          <span style={{ color: 'green' }}>Correct: {correct}</span>
          <span style={{ color: 'red' }}>Incorrect: {incorrect}</span>
          <span style={{ color: '#888' }}>Skipped: {skipped}</span>
        </div>
        <p style={{ color: '#888', marginTop: '8px' }}>
          Time taken: {Math.floor(timeTaken / 60)} min {timeTaken % 60} sec
        </p>
        <p style={{ color: '#FF9800', fontSize: '13px', marginTop: '8px' }}>
          Yeh result sirf local hai — DB mein save nahi hua
        </p>
      </div>

      {/* Per Question Analysis */}
      <h3>Question-wise Analysis</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.map((q, index) => {
          const response = responses.find(r => r.questionId === q._id);
          const selectedAnswer = response?.selectedAnswer;
          const isCorrect = selectedAnswer === q.correctAnswer;
          const isSkipped = !selectedAnswer;

          const bgColor = isSkipped ? '#F5F5F5' : isCorrect ? '#E8F5E9' : '#FFEBEE';

          return (
            <div key={q._id} style={{ padding: '16px', background: bgColor, borderRadius: '10px', border: '1px solid #ddd' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Q{index + 1}. {q.questionText}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {q.options.map((opt) => {
                  let bg = 'transparent';
                  if (opt.label === q.correctAnswer) bg = '#C8E6C9';
                  if (opt.label === selectedAnswer && !isCorrect) bg = '#FFCDD2';

                  return (
                    <div key={opt.label} style={{ padding: '6px 10px', background: bg, borderRadius: '6px' }}>
                      <strong>{opt.label}.</strong> {opt.text}
                      {opt.label === q.correctAnswer && <span style={{ color: 'green', marginLeft: '8px' }}>Correct Answer</span>}
                      {opt.label === selectedAnswer && !isCorrect && <span style={{ color: 'red', marginLeft: '8px' }}>Your Answer</span>}
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              <div style={{ fontSize: '13px', color: '#666' }}>
                <span>Status: <strong style={{ color: isSkipped ? '#888' : isCorrect ? 'green' : 'red' }}>
                  {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                </strong></span>
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

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '12px 24px', background: 'blue', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate(`/reattempt/${testId}`)}
          style={{ padding: '12px 24px', background: 'white', color: '#FF9800', border: '1px solid #FF9800', borderRadius: '8px', cursor: 'pointer' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PracticeResultPage;