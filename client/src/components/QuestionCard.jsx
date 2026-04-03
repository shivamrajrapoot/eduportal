// client/src/components/QuestionCard.jsx
import React from 'react';
import { useTest } from '../context/TestContext';

const QuestionCard = ({ question, index }) => {
  const { responses, selectAnswer, toggleMarkForReview } = useTest();

  const response = responses[question._id];
  const selectedAnswer = response?.selectedAnswer;
  const isMarked = response?.markedForReview;

  return (
    <div style={{ padding: '20px' }}>

      {/* Question number + mark for review */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Question {index + 1}</h3>
        <button
          onClick={() => toggleMarkForReview(question._id)}
          style={{
            padding: '6px 12px',
            background: isMarked ? '#FF9800' : 'white',
            color: isMarked ? 'white' : '#FF9800',
            border: '1px solid #FF9800',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {isMarked ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      {/* Question text */}
      <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
        {question.questionText}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((option) => (
          <button
            key={option.label}
            onClick={() => selectAnswer(question._id, option.label)}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: selectedAnswer === option.label ? '#E3F2FD' : 'white',
              border: selectedAnswer === option.label
                ? '2px solid #2196F3'
                : '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            <strong>{option.label}.</strong> {option.text}
          </button>
        ))}
      </div>

      {/* Clear answer */}
      {selectedAnswer && (
        <button
          onClick={() => selectAnswer(question._id, null)}
          style={{
            marginTop: '12px',
            padding: '6px 12px',
            background: 'white',
            color: 'red',
            border: '1px solid red',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Clear Answer
        </button>
      )}
    </div>
  );
};

export default QuestionCard;