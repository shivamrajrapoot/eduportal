// client/src/context/TestContext.jsx
import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({}); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  // Test shuru karo
  const startTest = (data) => {
    setAttemptId(data.attemptId);
    setQuestions(data.questions);
    setDuration(data.duration);
    setTotalMarks(data.totalMarks);

    // har question ke liye empty response banao
    const initialResponses = {};
    data.questions.forEach((q) => {
      initialResponses[q._id] = {
        questionId: q._id,
        selectedAnswer: null,
        markedForReview: false,
        timeTaken: 0,
      };
    });
    setResponses(initialResponses);
  };

  // Answer select karo
  const selectAnswer = (questionId, answer) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedAnswer: answer,
      },
    }));
  };

  // Mark for review toggle
  const toggleMarkForReview = (questionId) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        markedForReview: !prev[questionId].markedForReview,
      },
    }));
  };

  // Time update per question
  const updateTimeTaken = (questionId, time) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        timeTaken: (prev[questionId]?.timeTaken || 0) + time,
      },
    }));
  };

  // Reset — test khatam hone ke baad
  const resetTest = () => {
    setAttemptId(null);
    setQuestions([]);
    setResponses({});
    setCurrentIndex(0);
    setDuration(0);
    setTotalMarks(0);
  };

  return (
    <TestContext.Provider value={{
      attemptId, questions, responses,
      currentIndex, setCurrentIndex,
      duration, totalMarks,
      startTest, selectAnswer,
      toggleMarkForReview, updateTimeTaken,
      resetTest,
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => useContext(TestContext);