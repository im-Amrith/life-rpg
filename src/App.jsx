import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import StatusWindow from './components/StatusWindow';
import QuestBoard from './components/QuestBoard';
import PomodoroTimer from './components/PomodoroTimer';
import CoursesSection from './components/CoursesSection';
import QuickLinksSection from './components/QuickLinksSection';
import MiniTodos from './components/MiniTodos';
import EventsWidget from './components/EventsWidget';
import TimeTable from './components/TimeTable';
import CalendarSection from './components/CalendarSection';
import PerformanceWidget from './components/PerformanceWidget';
import Shop from './components/Shop';
import DynamicHeader from './components/DynamicHeader';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for the "New Course" modal (Lifted up so Sidebar can access it)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="bg-[#050505] h-screen text-white flex items-center justify-center">Loading OS...</div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex font-sans selection:bg-green-500/30 relative">
      
      {/* SIDEBAR: Pass the function to open the modal */}
      <Sidebar 
        userId={user.uid} 
        onOpenCourseModal={() => setIsCourseModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 overflow-y-auto no-scrollbar h-screen flex flex-col w-full">
        
        {/* HEADER: Full width at the top */}
        <div className="w-full shrink-0">
            <DynamicHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        </div>

        {/* CONTENT CONTAINER: Padding applied here */}
        <div className="max-w-[1400px] mx-auto space-y-8 p-4 lg:p-10 w-full">
          
          {/* SECTION 1: COURSES */}
          {/* UPDATED: Passing the state props here so the button inside works */}
          <CoursesSection 
            userId={user.uid} 
            isModalOpen={isCourseModalOpen} 
            setIsModalOpen={setIsCourseModalOpen} 
          />

          {/* SECTION 2: QUICK LINKS */}
          <QuickLinksSection userId={user.uid} />

          {/* SECTION 3: WIDGETS ROW */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[20rem]">
              <div className="h-full">
                  <PerformanceWidget userId={user.uid} />
              </div>
              <MiniTodos userId={user.uid} />
              <EventsWidget userId={user.uid} />
              <div className="h-full">
                  <PomodoroTimer />
              </div>
          </section>

          {/* SECTION 4: TASK MANAGER */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Task Manager</h2>
                    <div className="flex gap-2 text-[10px] text-gray-500">
                        <span className="text-white border-b border-white pb-0.5">This Week</span>
                        <span>Unrelated Task</span>
                    </div>
                 </div>
                 <QuestBoard userId={user.uid} />
              </div>

              <div className="lg:col-span-1 space-y-4">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Player Status</h2>
                  <StatusWindow userId={user.uid} />
              </div>
          </section>
          <br />
          {/* SHOP SECTION */}
          <div id="shop-section" className="flex-1 min-h-[300px]">
            <Shop userId={user.uid} />
          </div>

          {/* SECTION 5: TIME TABLE */}
          <section className="mt-8">
              <TimeTable userId={user.uid} />
          </section>

          {/* SECTION 6: ACADEMIC CALENDAR */}
          <section className="mt-8 mb-12">
              <CalendarSection userId={user.uid} />
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;