import React, { useState, useEffect, useCallback } from 'react';

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isWarning = timeLeft <= 300;

  return (
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: isWarning ? 'red' : 'green',
      padding: '8px 16px',
      border: `2px solid ${isWarning ? 'red' : 'green'}`,
      borderRadius: '8px',
    }}>
      {formatted}
    </div>
  );
};

export default Timer;