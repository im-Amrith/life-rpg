import React, { useState } from 'react';
import { X, Image as ImageIcon, Coins } from 'lucide-react';

export default function AddShopItemModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    cost: 50,
    image: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.cost < 1) return;
    
    onAdd(formData);
    setFormData({ title: '', cost: 50, image: '' }); // Reset
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Reward</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Reward Title</label>
            <input 
              type="text" 
              placeholder="e.g. Cheat Meal"
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
          </div>

          {/* Cost */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Coins size={12} /> Cost (Coins)
            </label>
            <input 
              type="number" 
              min="1"
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value) || 0})}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImageIcon size={12} /> Image URL (Optional)
            </label>
            <input 
              type="text" 
              placeholder="https://..."
              className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-4 py-3 text-xs text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-bold text-black bg-white hover:bg-gray-200 transition-colors mt-2"
          >
            Add Reward
          </button>
        </form>
      </div>
    </div>
  );
}