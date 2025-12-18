import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  addDoc, deleteDoc, doc, serverTimestamp, orderBy 
} from 'firebase/firestore';

const COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

export default function EventsWidget({ userId }) {
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '' });

  // 1. Fetch Events
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "events"),
      where("userId", "==", userId),
      orderBy("date", "asc") // Sort by date soonest first
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  // 2. Add Event
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    // Pick random color
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    await addDoc(collection(db, "events"), {
      userId,
      title: formData.title,
      date: formData.date,
      color: randomColor,
      createdAt: serverTimestamp()
    });
    setFormData({ title: '', date: '' });
    setIsAdding(false);
  };

  // 3. Delete Event
  const deleteEvent = async (e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "events", id));
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reminder / Events</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-[10px] bg-[#1f1f1f] px-2 py-1 rounded text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <Plus size={10} /> {isAdding ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mb-3 space-y-2 bg-[#1a1a1a] p-2 rounded border border-[#2d2d2d]">
          <input 
            autoFocus
            type="text" 
            placeholder="Event Title..."
            className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <input 
            type="date" 
            className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded px-2 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-green-500"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
          <button type="submit" className="w-full bg-green-700 text-white text-[10px] font-bold py-1 rounded hover:bg-green-600">
            Save Event
          </button>
        </form>
      )}

      {/* List */}
      <ul className="space-y-4 overflow-y-auto no-scrollbar flex-1">
        {events.map(event => (
          <li key={event.id} className="flex gap-3 group relative">
            {/* Colored Dot */}
            <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${event.color}`}></div>
            
            {/* Info */}
            <div className="flex-1">
              <p className="text-xs text-gray-300 group-hover:text-white transition-colors">{event.title}</p>
              <p className="text-[10px] text-gray-600 font-mono">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Delete Button */}
            <button 
              onClick={(e) => deleteEvent(e, event.id)}
              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all bg-[#0f0f0f] pl-2"
            >
              <Trash2 size={12} />
            </button>
          </li>
        ))}
         {events.length === 0 && !isAdding && (
          <p className="text-[10px] text-gray-600 italic">No upcoming events.</p>
        )}
      </ul>
    </div>
  );
}