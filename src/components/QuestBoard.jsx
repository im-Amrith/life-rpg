import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp, increment, getDoc, where 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Plus, Calendar, Circle, CheckCircle2 } from 'lucide-react'; // Added icons

const getWeekRange = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
  const options = { month: 'long', day: 'numeric' };
  return `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
};

export default function QuestBoard({ userId }) {
  const [habits, setHabits] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Updated form data to include status
  const [formData, setFormData] = useState({ 
    title: '', 
    type: 'good', 
    priority: 'Medium', 
    status: 'Not Started', // New Field
    dueDate: '' 
  });

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "habits"), 
      where("userId", "==", userId),
      orderBy("dueDate", "asc"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHabits(habitsData);
    });
    return () => unsubscribe();
  }, [userId]);

  const addHabit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    await addDoc(collection(db, "habits"), {
      userId: userId,
      title: formData.title,
      type: formData.type,
      priority: formData.priority,
      status: 'Not Started', // Default status
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      xp: formData.type === 'good' ? 20 : 0, 
      damage: formData.type === 'bad' ? 10 : 0, 
      createdAt: serverTimestamp()
    });
    setFormData({ title: '', type: 'good', priority: 'Medium', status: 'Not Started', dueDate: '' });
    setIsAdding(false);
  };

  // Logic to toggle Status (Not Started <-> In Progress)
  const toggleStatus = async (e, habit) => {
    e.stopPropagation(); // Prevent completing the task
    const newStatus = habit.status === 'Not Started' ? 'In Progress' : 'Not Started';
    const habitRef = doc(db, "habits", habit.id);
    await updateDoc(habitRef, { status: newStatus });
  };

  const handleInteraction = async (habit) => {
    const playerRef = doc(db, "user_stats", userId);
    
    if (habit.type === 'good') {
      const audio = new Audio('/sounds/coin.mp3'); audio.volume = 0.5; audio.play();
      await deleteDoc(doc(db, "habits", habit.id));
      await updateDoc(playerRef, { currentXP: increment(habit.xp), coins: increment(habit.xp) });
    } else {
      const audio = new Audio('/sounds/damage.mp3'); audio.play();
      await updateDoc(playerRef, { currentHP: increment(-habit.damage) });
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-900/20 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-yellow-900/20 text-yellow-500 border-yellow-500/20';
      case 'Low': return 'bg-blue-900/20 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-800 text-gray-500 border-gray-700';
    }
  };

  // Helper for Status Color
  const getStatusColor = (status) => {
    if (status === 'In Progress') return 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30';
    return 'bg-gray-800 text-gray-400 border-gray-700'; // Not Started style
  };

  return (
    <div id="task-manager" className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden h-full flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="p-5 border-b border-[#1f1f1f] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Task Manager</h2>
          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <Calendar size={12} /> {getWeekRange()}
          </p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg text-xs text-gray-300 hover:bg-[#252525] transition-colors">
              <Filter size={12} /> All work <ChevronDown size={12} />
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} /> New Task
            </button>
        </div>
      </div>

      {/* --- ADD NEW TASK FORM --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={addHabit} 
            className="p-4 border-b border-[#1f1f1f] bg-[#141414] grid grid-cols-1 lg:grid-cols-12 gap-3"
          >
            {/* Title */}
            <div className="lg:col-span-6 flex gap-2">
               <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-2 text-xs text-white focus:outline-none"
               >
                  <option value="good">Quest</option>
                  <option value="bad">Threat</option>
               </select>
               <input 
                  type="text" placeholder="Task Title..." autoFocus
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
               />
            </div>
            
            {/* Priority & Date */}
            <div className="lg:col-span-5 flex gap-2">
                <select 
                value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="flex-1 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                >
                <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <input 
                type="date"
                value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="flex-1 bg-[#0a0a0a] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                />
            </div>

            <button type="submit" className="lg:col-span-1 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center justify-center py-2 lg:py-0"><Plus size={16}/></button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* --- TASK LIST --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <AnimatePresence mode='popLayout'>
          {habits.map((habit) => (
            <motion.div 
              key={habit.id}
              layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              onClick={() => handleInteraction(habit)}
              className="group grid grid-cols-12 items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] border border-transparent hover:border-[#2d2d2d] transition-all cursor-pointer mb-1"
            >
              {/* COL 1: Checkbox (1 col) */}
              <div className="col-span-1 flex items-center justify-center">
                 <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                    ${habit.type === 'good' ? 'border-gray-600 group-hover:border-green-500 group-hover:text-green-500' : 'border-red-500/50 text-red-500'}
                 `}>
                    {habit.type === 'good' ? <Circle size={12} className="group-hover:hidden"/> : <div className="text-[10px]">⚠️</div>}
                    {habit.type === 'good' && <CheckCircle2 size={14} className="hidden group-hover:block" />}
                 </div>
              </div>

              {/* COL 2: Title (5 cols) */}
              <div className="col-span-5">
                 <span className={`text-sm font-medium ${habit.type === 'good' ? 'text-gray-200' : 'text-red-400'}`}>{habit.title}</span>
              </div>

              {/* COL 3: Priority (2 cols) */}
              <div className="col-span-2 text-center">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(habit.priority)}`}>
                  {habit.priority}
                </span>
              </div>

              {/* COL 4: Status (2 cols) - NEW */}
              <div className="col-span-2 text-center">
                 <button 
                    onClick={(e) => toggleStatus(e, habit)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 mx-auto border transition-all hover:brightness-125 ${getStatusColor(habit.status || 'Not Started')}`}
                 >
                    <div className={`w-1.5 h-1.5 rounded-full ${habit.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                    {habit.status || 'Not Started'}
                 </button>
              </div>
              
              {/* COL 5: Due Date (2 cols) */}
              <div className="col-span-2 text-right">
                <span className="text-xs text-gray-500 font-mono group-hover:text-gray-300 transition-colors">
                  {new Date(habit.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {habits.length === 0 && !isAdding && (
           <div className="text-center py-12 text-gray-600 text-xs uppercase tracking-widest">No active tasks</div>
        )}
      </div>
    </div>
  );
}