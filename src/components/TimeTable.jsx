import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, setDoc, doc } from 'firebase/firestore';
import EditClassModal from './EditClassModal';

// Configuration arrays matching the image
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = [
  '8:00 - 9:00',
  '9:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 1:00',
  '1:00 - 2:00',
  '2:00 - 3:00'
];

export default function TimeTable({ userId }) {
  const [schedule, setSchedule] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: '', time: '', currentClass: '' });

  // 1. Fetch Schedule
  useEffect(() => {
    if (!userId) return;
    
    // We store the schedule in a collection where ID = "userId_Day_Time"
    const q = query(collection(db, "timetable"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scheduleData = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Create a key like "Monday-8:00 - 9:00" for easy lookup
        scheduleData[`${data.day}-${data.time}`] = data.className;
      });
      setSchedule(scheduleData);
    });

    return () => unsubscribe();
  }, [userId]);

  // 2. Open Modal
  const handleSlotClick = (day, time) => {
    const currentClass = schedule[`${day}-${time}`] || '';
    setSelectedSlot({ day, time, currentClass });
    setModalOpen(true);
  };

  // 3. Save Class
  const saveClass = async (day, time, className) => {
    const docId = `${userId}_${day}_${time}`.replace(/[\s:]/g, ''); // Create safe ID
    
    if (className.trim() === '') {
       // If empty, effectively "delete" (or save as empty)
       await setDoc(doc(db, "timetable", docId), {
         userId, day, time, className: '' 
       });
    } else {
       await setDoc(doc(db, "timetable", docId), {
         userId, day, time, className 
       });
    }
  };

  return (
    <div id="timetable-section" className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 overflow-hidden">
      
      <EditClassModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        slotInfo={selectedSlot} 
        onSave={saveClass} 
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 text-gray-200">
        <Clock size={16} />
        <h2 className="text-sm font-bold tracking-widest uppercase">TimeTable</h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] border border-[#1f1f1f] rounded-lg bg-[#0a0a0a]">
            
            {/* Table Header */}
            <div className="grid grid-cols-6 border-b border-[#1f1f1f] bg-[#141414]">
                <div className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 border-r border-[#1f1f1f]">
                    <Clock size={12} /> Time
                </div>
                {DAYS.map(day => (
                    <div key={day} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-[#1f1f1f] last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Table Body */}
            {TIMES.map((time, index) => (
                <div key={time} className={`grid grid-cols-6 ${index !== TIMES.length - 1 ? 'border-b border-[#1f1f1f]' : ''} hover:bg-[#0f0f0f] transition-colors`}>
                    {/* Time Column */}
                    <div className="p-4 text-xs font-mono text-gray-400 border-r border-[#1f1f1f]">
                        {time}
                    </div>

                    {/* Days Columns */}
                    {DAYS.map(day => {
                        const className = schedule[`${day}-${time}`];
                        return (
                            <div 
                                key={`${day}-${time}`} 
                                onClick={() => handleSlotClick(day, time)}
                                className="p-4 text-xs border-r border-[#1f1f1f] last:border-r-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors group relative"
                            >
                                {className ? (
                                    <span className="text-gray-200 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {className}
                                    </span>
                                ) : (
                                    <span className="opacity-0 group-hover:opacity-100 text-gray-600 text-[10px]">+ Add</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}