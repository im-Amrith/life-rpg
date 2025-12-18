import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { db, auth } from '../firebase'; // <--- Import auth here
import { signOut } from 'firebase/auth'; // <--- Import signOut
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  ListTodo, BookOpen, CheckSquare, FileText, 
  Clock as ClockIcon, CalendarDays, GraduationCap,
  Wallet, LayoutGrid, CheckSquare as CheckIcon,
  LogOut, X // <--- Import Icon
} from 'lucide-react';

// Helper to calculate time progress
const getTimeProgress = () => {
  const now = new Date();
  
  // Year Progress
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

  // Month Progress
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthProgress = ((now - startOfMonth) / (endOfMonth - startOfMonth)) * 100;

  // Week Progress (approximate)
  const day = now.getDay(); // 0 is Sunday
  const weekProgress = ((day === 0 ? 7 : day) / 7) * 100;

  return { 
    year: Math.round(yearProgress), 
    month: Math.round(monthProgress), 
    week: Math.round(weekProgress) 
  };
};

export default function Sidebar({ userId, onOpenCourseModal, isOpen, onClose }) {
  const [value, setValue] = useState(new Date());
  const [progress, setProgress] = useState(getTimeProgress());
  const [goals, setGoals] = useState([]);

  // 1. Clock Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(new Date());
      setProgress(getTimeProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Goals from Firebase
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "goals"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snapshot) => {
      setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [userId]);

  // 3. Scroll Handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The App.js auth listener will automatically detect this and switch to Login screen
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className={`w-64 bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col h-screen overflow-y-auto no-scrollbar fixed left-0 top-0 z-50 font-sans text-gray-300 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* HEADER & CLOCK */}
      <div className="p-6 pb-2 flex flex-col items-center border-b border-[#1f1f1f]/50 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h1 className="text-lg font-bold text-white mb-6 tracking-wide">Student Life OS</h1>
        <div className="mb-2 invert opacity-80">
          <Clock value={value} size={110} renderNumbers={false} hourHandWidth={2} minuteHandWidth={2} secondHandWidth={1} />
        </div>
        <div className="text-center mt-4">
           <p className="text-xl font-mono text-white font-bold tracking-widest">
             {value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
           </p>
           <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
             {value.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
           </p>
        </div>
      </div>

      {/* PROGRESS BARS */}
      <div className="p-6 py-8 space-y-3 border-b border-[#1f1f1f]/50">
         <ProgressBar label="Year" value={progress.year} />
         <ProgressBar label="Month" value={progress.month} />
         <ProgressBar label="Week" value={progress.week} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="p-6 pb-2">
         <SectionTitle title="Quick-Action" />
         <div className="space-y-1">
            <ActionBtn icon={<ListTodo size={14} />} label="New Task" onClick={() => scrollToSection('task-manager')} />
            <ActionBtn icon={<BookOpen size={14} />} label="New Course" onClick={onOpenCourseModal} />
            <ActionBtn icon={<CheckSquare size={14} />} label="New Assignment" onClick={() => scrollToSection('task-manager')} />
         </div>
      </div>

      {/* GOAL TRACKER (Dynamic) */}
      <div className="p-6 pb-2">
         <SectionTitle title="Goal-Tracker" />
         <div className="space-y-2.5">
            {/* If no goals, show placeholders, else map goals */}
            {goals.length === 0 ? (
               <>
                  <GoalCard label="Q1 / Jan - Mar" progress={80} active />
                  <GoalCard label="Q2 / Apr - Jun" progress={0} />
               </>
            ) : (
               goals.map(goal => (
                  <GoalCard 
                    key={goal.id} 
                    label={goal.title} 
                    progress={goal.progress} 
                    completed={goal.progress >= 100}
                    active={goal.active}
                  />
               ))
            )}
         </div>
      </div>

      {/* ACADEMY LIFE (Navigation) */}
      <div className="p-6 pb-2">
         <SectionTitle title="Academy-Life" />
         <nav className="space-y-0.5">
            <NavLink icon={<ClockIcon size={14} />} label="Time Tracker" onClick={() => scrollToSection('pomodoro-timer')} />
            <NavLink icon={<ListTodo size={14} />} label="Task Manager" onClick={() => scrollToSection('task-manager')} />
            <NavLink icon={<GraduationCap size={14} />} label="Courses" onClick={() => scrollToSection('courses-section')} />
            <NavLink icon={<CalendarDays size={14} />} label="Timetable" onClick={() => scrollToSection('timetable-section')} />
         </nav>
      </div>

      {/* PERSONAL LIFE (Placeholders/Navigation) */}
      <div className="p-6 pb-2">
         <SectionTitle title="Personal-Life" />
         <nav className="space-y-0.5">
            <NavLink icon={<LayoutGrid size={14} />} label="Dashboard" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
            <NavLink icon={<Wallet size={14} />} label="Marketplace" onClick={() => scrollToSection('shop-section')} />
         </nav>
      </div>
      <div className="p-6 mt-auto border-t border-[#1f1f1f]">
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-2 py-2 rounded text-xs text-gray-400 hover:text-white hover:bg-red-500/10 transition-all group"
         >
           <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
           <span className="font-bold group-hover:text-red-500 transition-colors">Log Out</span>
         </button>
      </div>

    </aside>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */
function ActionBtn({ icon, label, onClick }) {
   return (
      <button onClick={onClick} className="flex items-center gap-3 w-full px-2 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all group text-left">
         <span className="text-gray-500 group-hover:text-white transition-colors">{icon}</span>
         <span className="font-medium">{label}</span>
      </button>
   );
}

function GoalCard({ label, progress, completed, active }) {
   return (
      <div className={`p-3 rounded-lg border ${active ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-[#0a0a0a] border-[#1f1f1f] opacity-60 hover:opacity-100'} transition-all cursor-pointer group`}>
         <div className="flex items-center gap-2 mb-2">
            {completed ? <CheckSquare size={12} className="text-white" /> : <div className="w-3 h-3 border border-gray-600 rounded-[2px]"></div>}
            <span className="text-[10px] font-bold text-gray-300 group-hover:text-white">{label}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-500 w-6">{progress}%</span>
            <div className="flex-1 h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
               <div className={`h-full ${completed ? 'bg-white' : 'bg-orange-400'}`} style={{ width: `${progress}%` }}></div>
            </div>
         </div>
      </div>
   );
}

function NavLink({ icon, label, onClick }) {
   return (
      <button onClick={onClick} className="flex items-center gap-3 w-full px-2 py-1.5 rounded text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors text-left">
         {icon}
         <span>{label}</span>
      </button>
   );
}

function ProgressBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-12 h-6 border border-[#2d2d2d] rounded-sm bg-[#0a0a0a] p-0.5">
          <div className="h-full bg-white" style={{ width: `${value}%` }}></div>
       </div>
       <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}: {value}%</span>
       </div>
    </div>
  );
}

function SectionTitle({ title }) {
   return (
      <h3 className="text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em] mb-4 pl-1 border-l-2 border-transparent hover:border-white transition-colors cursor-default">
         {title}
      </h3>
   );
}

