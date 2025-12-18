import React, { useState } from 'react';
import { X, Clock, Coffee, Armchair } from 'lucide-react';

export default function TimerSettingsModal({ isOpen, onClose, currentDurations, onSave }) {
  const [values, setValues] = useState(currentDurations);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(values);
    onClose();
  };

  const handleChange = (mode, minutes) => {
    setValues(prev => ({
      ...prev,
      [mode]: parseInt(minutes) || 1 // Prevent 0 or NaN
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl p-6 transform transition-all">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Timer Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Pomodoro Input */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
               <Clock size={12} /> Pomodoro (minutes)
            </label>
            <input 
              type="number" 
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={values['Pomodoro']}
              onChange={(e) => handleChange('Pomodoro', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Short Break */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Coffee size={12} /> Short Break
                </label>
                <input 
                type="number" 
                className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                value={values['Short Break']}
                onChange={(e) => handleChange('Short Break', e.target.value)}
                />
            </div>

            {/* Long Break */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Armchair size={12} /> Long Break
                </label>
                <input 
                type="number" 
                className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                value={values['Long Break']}
                onChange={(e) => handleChange('Long Break', e.target.value)}
                />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 px-4 py-3 rounded-lg text-sm font-bold text-black bg-white hover:bg-gray-200 transition-colors"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}