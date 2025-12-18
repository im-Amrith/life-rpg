import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export default function AddCourseModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    totalAssignments: 5,
    upcomingExams: 1,
    image: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    // Pass data back to parent
    onAdd(formData);
    
    // Reset form
    setFormData({ title: '', totalAssignments: 5, upcomingExams: 1, image: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl p-6 transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Add New Course</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Title</label>
            <input 
              type="text" 
              placeholder="e.g. Advanced Calculus"
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Assignments</label>
              <input 
                type="number" 
                min="1"
                className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                value={formData.totalAssignments}
                onChange={(e) => setFormData({...formData, totalAssignments: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upcoming Exams</label>
              <input 
                type="number" 
                min="0"
                className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                value={formData.upcomingExams}
                onChange={(e) => setFormData({...formData, upcomingExams: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImageIcon size={12} /> Cover Image URL (Optional)
            </label>
            <input 
              type="text" 
              placeholder="https://..."
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-xs text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-black bg-white hover:bg-gray-200 transition-colors"
            >
              Create Course
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}