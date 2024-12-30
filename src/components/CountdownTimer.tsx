import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onTimesUp: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, onTimesUp }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onTimesUp();
    }
  }, [seconds, onTimesUp]);

  return (
    <div>
      <p>Time remaining: {seconds} seconds</p>
    </div>
  );
};

export default CountdownTimer;
