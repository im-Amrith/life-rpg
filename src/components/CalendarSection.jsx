import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function CalendarSection({ userId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  // 1. Fetch Tasks (Reusing habits collection)
  useEffect(() => {
    if (!userId) return;
    
    // We fetch all tasks for this user to place them on the calendar
    const q = query(collection(db, "habits"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId]);

  // 2. Calendar Logic (Get Current Week)
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Helper to format date for comparison (YYYY-MM-DD)
  const formatDateKey = (date) => date.toISOString().split('T')[0];

  // Helper for Status Badge Color
  const getStatusStyle = (status) => {
    if (status === 'Completed') return 'bg-green-900/30 text-green-500 border-green-500/30';
    if (status === 'In Progress') return 'bg-yellow-900/30 text-yellow-500 border-yellow-500/30';
    return 'bg-gray-800 text-gray-500 border-gray-700';
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Academic-Calendar</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
             <button className="text-white font-bold border-b border-white pb-0.5">This Week</button>
             <button className="hover:text-gray-300">This Month</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
           {/* Week Navigation */}
           <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1 border border-[#2d2d2d] flex-1 md:flex-none justify-between md:justify-start">
              <button onClick={() => changeWeek(-1)} className="p-1 text-gray-400 hover:text-white"><ChevronLeft size={16} /></button>
              <span className="text-xs font-mono text-gray-300 min-w-[100px] text-center">
                 {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <button onClick={() => changeWeek(1)} className="p-1 text-gray-400 hover:text-white"><ChevronRight size={16} /></button>
           </div>
           
           <button className="flex items-center gap-2 text-[10px] text-gray-400 border border-[#2d2d2d] rounded-lg px-3 py-1.5 hover:bg-[#1f1f1f] transition-colors whitespace-nowrap">
              <ExternalLink size={12} /> Open in Calendar
           </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-7 border border-[#1f1f1f] rounded-lg bg-[#0a0a0a] overflow-hidden min-h-[400px]">
         {weekDays.map((day, index) => {
            const dateKey = formatDateKey(day);
            const isToday = dateKey === formatDateKey(new Date());
            const dayTasks = tasks.filter(t => t.dueDate === dateKey);

            return (
               <div key={dateKey} className={`border-b md:border-b-0 md:border-r border-[#1f1f1f] last:border-b-0 md:last:border-r-0 flex flex-row md:flex-col ${isToday ? 'bg-[#141414]' : ''} min-h-[100px] md:min-h-0`}>
                  
                  {/* Day Header */}
                  <div className="p-3 border-r md:border-r-0 md:border-b border-[#1f1f1f] text-center w-24 md:w-auto shrink-0 flex flex-col justify-center md:block">
                     <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        {day.toLocaleDateString(undefined, { weekday: 'short' })}
                     </p>
                     <div className={`text-sm font-bold w-7 h-7 mx-auto flex items-center justify-center rounded-full ${isToday ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-300'}`}>
                        {day.getDate()}
                     </div>
                  </div>

                  {/* Tasks Column */}
                  <div className="p-2 flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto no-scrollbar flex flex-row md:flex-col gap-2 md:space-y-2 md:gap-0 items-center md:items-stretch">
                     {dayTasks.map(task => (
                        <div key={task.id} className="bg-[#1a1a1a] border border-[#2d2d2d] rounded p-2 hover:border-gray-500 transition-colors cursor-pointer group min-w-[140px] md:min-w-0 shrink-0 md:shrink">
                           {/* Task Type/Icon */}
                           <div className="flex items-center gap-1 mb-1.5">
                              <span className="text-[10px] text-gray-400 truncate font-bold">
                                 {task.title}
                              </span>
                           </div>
                           
                           {/* Metadata */}
                           <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                 <span className="truncate">{task.priority} Priority</span>
                              </div>
                              
                              {/* Status Badge */}
                              <div className={`text-[9px] px-1.5 py-0.5 rounded border inline-block ${getStatusStyle(task.status || 'Not Started')}`}>
                                 {task.status || 'Not Started'}
                              </div>
                           </div>
                        </div>
                     ))}
                     
                     {/* Empty State spacer */}
                     {dayTasks.length === 0 && (
                        <div className="h-full"></div>
                     )}
                  </div>

               </div>
            );
         })}
      </div>

    </div>
  );
}