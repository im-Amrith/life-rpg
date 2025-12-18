import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

export default function EditClassModal({ isOpen, onClose, onSave, slotInfo }) {
  const [className, setClassName] = useState(slotInfo?.currentClass || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(slotInfo.day, slotInfo.time, className);
    setClassName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl p-6">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Edit Schedule</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-[#2d2d2d]">
          <p><span className="font-bold text-gray-300">Day:</span> {slotInfo.day}</p>
          <p><span className="font-bold text-gray-300">Time:</span> {slotInfo.time}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
               <BookOpen size={12} /> Class / Subject
            </label>
            <input 
              type="text" 
              placeholder="e.g. Computer Science"
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button 
                type="button"
                onClick={() => { onSave(slotInfo.day, slotInfo.time, ''); onClose(); }} 
                className="flex-1 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-900/20 transition-colors"
            >
                Clear Slot
            </button>
            <button 
                type="submit"
                className="flex-[2] py-2 rounded-lg text-xs font-bold text-black bg-white hover:bg-gray-200 transition-colors"
            >
                Save Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}