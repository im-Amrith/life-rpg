import React, { useState } from 'react';
import { X, Link as LinkIcon, FileText } from 'lucide-react';

export default function AddQuickLinkModal({ isOpen, onClose, onAdd, category }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    note: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    // Send data back to parent
    onAdd(formData);
    
    // Reset and close
    setFormData({ title: '', url: '', note: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl p-6 transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">New {category} Page</h2>
            <p className="text-xs text-gray-500 mt-1">Create a new entry in {category}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text" 
              placeholder={`e.g. ${category === 'Assignments' ? 'Math Homework' : 'Project Idea'}`}
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
          </div>

          {/* URL Input (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <LinkIcon size={12} /> External Link (Optional)
            </label>
            <input 
              type="url" 
              placeholder="https://..."
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-xs text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
            />
          </div>

          {/* Note Input (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText size={12} /> Quick Note
            </label>
            <textarea 
              rows="3"
              placeholder="Add some details..."
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-xs text-gray-300 focus:outline-none focus:border-green-500 transition-colors resize-none"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-2">
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
              Create Page
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}