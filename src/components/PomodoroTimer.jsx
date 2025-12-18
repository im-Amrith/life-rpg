import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import TimerSettingsModal from './TimerSettingsModal'; // Import the new modal

export default function PomodoroTimer() {
  
  // 1. Store Durations in State (Default values)
  const [durations, setDurations] = useState({
    'Pomodoro': 25,
    'Short Break': 5,
    'Long Break': 15
  });

  const [mode, setMode] = useState('Pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Modal visibility
  
  const timerRef = useRef(null);

  // 2. Handle Countdown Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      const audio = new Audio('/sounds/coin.mp3'); 
      audio.play();
      alert(`${mode} finished!`);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode]);

  // 3. Helper: Format Time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 4. Controls
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60); // Use dynamic duration
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(durations[newMode] * 60); // Use dynamic duration
  };

  // 5. Handle Settings Save
  const handleSaveSettings = (newDurations) => {
    setDurations(newDurations);
    
    // If the timer is not running, update the display immediately
    if (!isActive) {
      setTimeLeft(newDurations[mode] * 60);
    }
  };

  return (
    <div id="pomodoro-timer" className="bg-[#0f0f0f] rounded-xl border border-[#1f1f1f] p-6 flex flex-col items-center justify-center relative overflow-hidden h-full">
      
      {/* Settings Modal */}
      <TimerSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentDurations={durations}
        onSave={handleSaveSettings}
      />

      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/68/3d/63/683d6339010661403004101410063105.gif')] bg-cover bg-center opacity-20 z-0"></div>
      
      <div className="z-10 flex flex-col items-center w-full">
        
        {/* Mode Toggles */}
        <div className="flex gap-1 bg-gray-900 p-1 rounded-full mb-6 text-xs font-bold z-20">
          {Object.keys(durations).map((m) => (
            <button 
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-3 py-1 rounded-full transition-all duration-300 ${mode === m ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-4xl md:text-6xl font-black text-white mb-6 font-mono tracking-wider drop-shadow-2xl">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTimer}
            className={`
              px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all transform active:scale-95
              ${isActive ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' : 'bg-white text-black hover:bg-gray-200'}
            `}
          >
            {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isActive ? 'Pause' : 'Start'}
          </button>

          <button 
            onClick={resetTimer}
            className="p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800 border border-transparent hover:border-gray-700"
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)} // Open Settings
            className="p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800 border border-transparent hover:border-gray-700"
            title="Timer Settings"
          >
            <Settings size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}