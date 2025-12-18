import { useState, useEffect } from 'react';

export default function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'morning', 'day', 'evening', 'night'

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    checkTime(); // Run on mount
    const timer = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return timeOfDay;
}