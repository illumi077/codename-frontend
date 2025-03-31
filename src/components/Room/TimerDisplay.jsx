import React, { useState, useEffect } from 'react';
import './TimerDisplay.css';

const TimerDisplay = ({ duration, currentTurn, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!currentTurn) return; // Run timer only when there's an active turn

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timer);
        onTimeEnd(); // Trigger the onTimeEnd callback when time is up
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [currentTurn, onTimeEnd]);

  return (
    <div className="timer-display-container">
      <h3>Time Remaining</h3>
      <p>{timeLeft} seconds</p>
    </div>
  );
};

export default TimerDisplay;
