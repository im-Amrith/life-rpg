import React from 'react';
import { Trash2 } from 'lucide-react';

export default function CourseCard({ id, title, icon, image, stats, onDelete }) {
  // Destructure stats with safe defaults in case DB data is missing
  const { 
    totalAssignments = 0, 
    completedAssignments = 0, 
    upcomingExams = 0, 
    pastExams = 0 
  } = stats || {};

  const assignPercent = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;
    
  const examPercent = 0; // Placeholder for exam progress logic

  return (
    <div className="bg-[#121212] rounded-xl border border-[#1f1f1f] overflow-hidden group hover:border-gray-600 transition-all duration-300 min-w-[200px] relative">
      
      {/* Delete Button (Hidden until hover) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering other clicks
          onDelete(id);
        }}
        className="absolute top-2 right-2 z-20 bg-black/50 p-1.5 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={12} />
      </button>

      {/* Image Header */}
      <div className="h-24 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col gap-4">
        
        {/* Title Header */}
        <div className="flex items-center gap-2 text-gray-200">
          <span className="text-lg text-gray-400">{icon}</span>
          <h3 className="font-bold text-sm truncate">{title}</h3>
        </div>

        {/* Stats Block 1: Assignments */}
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 flex justify-between">
            <span>Assignments</span>
            <span className="text-gray-500">{completedAssignments}/{totalAssignments}</span>
          </p>
          
          <div className="mt-1">
            <div className="w-full h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-400/80 rounded-full" 
                style={{ width: `${assignPercent}%` }} 
              />
            </div>
            <div className="text-[9px] text-gray-600 text-right mt-0.5">{assignPercent}%</div>
          </div>
        </div>

        {/* Stats Block 2: Exams */}
        <div className="space-y-1">
           <p className="text-[10px] text-gray-400 flex justify-between">
            <span>Exams</span>
            <span className="text-gray-500">{upcomingExams} Upcoming</span>
          </p>
          
          <div className="mt-1">
            <div className="w-full h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-400/80 rounded-full" 
                style={{ width: `${examPercent}%` }} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}