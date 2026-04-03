// client/src/components/QuestionPalette.jsx
import React from 'react';
import { useTest } from '../context/TestContext';

const QuestionPalette = () => {
  const { questions, responses, currentIndex, setCurrentIndex } = useTest();

  const getColor = (questionId) => {
    const r = responses[questionId];
    if (!r) return '#gray';
    if (r.markedForReview) return '#FF9800';   // orange — marked
    if (r.selectedAnswer) return '#4CAF50';    // green — answered
    return '#e0e0e0';                           // gray — not visited
  };

  return (
    <div style={{ padding: '16px' }}>
      <h4 style={{ marginBottom: '12px' }}>Questions</h4>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <span style={{ width: '16px', height: '16px', background: '#4CAF50', borderRadius: '4px', display: 'inline-block' }}></span>
          Answered
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <span style={{ width: '16px', height: '16px', background: '#FF9800', borderRadius: '4px', display: 'inline-block' }}></span>
          Marked
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <span style={{ width: '16px', height: '16px', background: '#e0e0e0', borderRadius: '4px', display: 'inline-block' }}></span>
          Not answered
        </span>
      </div>

      {/* Question grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {questions.map((q, index) => (
          <button
            key={q._id}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '40px',
              height: '40px',
              background: getColor(q._id),
              border: currentIndex === index ? '2px solid blue' : '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: currentIndex === index ? 'bold' : 'normal',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionPalette;