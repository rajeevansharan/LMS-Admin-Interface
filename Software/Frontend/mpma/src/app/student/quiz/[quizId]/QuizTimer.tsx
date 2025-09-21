// src/app/student/quiz/[quizId]/QuizTimer.tsx
'use client';

import { useState, useEffect } from 'react';

interface QuizTimerProps {
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ onTimeUp }) => {
  // Always use 30 minutes (1800 seconds) for every quiz
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes = 1800 seconds

  useEffect(() => {
    console.log(`[QuizTimer] Starting timer with 30 minutes (${30 * 60} seconds)`);
    
    if (timeLeft <= 0) {
      console.log('[QuizTimer] Time is up! Calling onTimeUp');
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime <= 1 ? 0 : prevTime - 1;
        if (newTime % 60 === 0) { // Log every minute
          console.log(`[QuizTimer] ${Math.floor(newTime / 60)} minutes remaining`);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      console.log('[QuizTimer] Cleaning up interval');
      clearInterval(timerId);
    };
  }, [timeLeft, onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Add some visual feedback when time is running low
  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  return (
    <div className={`text-lg font-semibold p-2 border rounded-md ${
      isCriticalTime 
        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300' 
        : isLowTime 
          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300'
          : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      Time Left: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default QuizTimer;