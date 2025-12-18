import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { db } from '../firebase'; 
import { 
  collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import CourseCard from './CourseCard';
import AddCourseModal from './AddCourseModal';

// 1. SPECIFIC SUBJECT IMAGES (Keyword Mapping)
const SUBJECT_IMAGES = {
  // Tech / CS
  code: "/code.jpg",
  computer: "/computer.jpg",
  data: "data.jpg",
  
  // Math
  math: "/math.jpg",
  algebra : "/algebra.jpg",
  calculus: "/calculus.jpg",
  statistics: "/statistics.jpg",

  // Science
  physics: "h/physics.jpg",
  chemistry: "/chemistry.jpg",
  biology: "/biology.jpg",
  science: "/science.jpg",

  // Humanities
  history: "/history.jpg",
  english: "/english.jpg",
  literature: "/literature.jpg",
  art: "/art.jpg",
  design: "/design.png",
  
  // Business
  business: "/business.jpg",
  economics: "/economics.jpg",
  marketing: "/marketing.jpg"
};

// 2. FALLBACK IMAGES (Random pool)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614726365723-49cfae9d0e8b?q=80&w=600&auto=format&fit=crop"
];

export default function CoursesSection({ userId, isModalOpen, setIsModalOpen }) {
  const [courses, setCourses] = useState([]);

  // Fetch Courses
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "courses"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    });

    return () => unsubscribe();
  }, [userId]);

  // Helper: Find matching image based on title keywords
  const getMatchedImage = (title) => {
    const lowerTitle = title.toLowerCase();
    
    // Check if any keyword in SUBJECT_IMAGES exists in the title
    for (const [key, url] of Object.entries(SUBJECT_IMAGES)) {
      if (lowerTitle.includes(key)) {
        return url;
      }
    }
    // Fallback if no match found
    return null;
  };

  // Handle Add Course
  const handleAddCourse = async (formData) => {
    // 1. Check if user provided a custom image URL
    let imageToUse = formData.image;

    // 2. If not, try to match based on title
    if (!imageToUse) {
      imageToUse = getMatchedImage(formData.title);
    }

    // 3. If still no image, pick a random default
    if (!imageToUse) {
      imageToUse = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
    }

    await addDoc(collection(db, "courses"), {
      userId,
      title: formData.title,
      icon: "📚", 
      image: imageToUse,
      stats: {
        totalAssignments: Number(formData.totalAssignments),     
        completedAssignments: 0,
        upcomingExams: Number(formData.upcomingExams),
        pastExams: 0
      },
      createdAt: serverTimestamp()
    });
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (confirm("Delete this course?")) {
      await deleteDoc(doc(db, "courses", courseId));
    }
  };

  return (
    <section id="courses-section">
      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCourse} 
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-400">
           <LayoutGrid size={16} />
           <h2 className="text-xs font-bold uppercase tracking-widest">Courses</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="text-[10px] text-gray-500 hover:text-white transition-colors flex items-center gap-1"
        >
            <Plus size={10} /> New Page
        </button>
      </div>

      {/* LAYOUT UPDATE:
         1. 'flex overflow-x-auto': Enables horizontal scroll on mobile.
         2. 'md:grid': Switches to grid on Desktop.
         3. 'pb-4': Adds padding at bottom so scrollbar doesn't hide content.
      */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible md:pb-0 no-scrollbar">
        {courses.map((course) => (
          // Wrapper div to force width on mobile, but auto width on desktop
          <div key={course.id} className="min-w-[260px] md:min-w-0 shrink-0">
            <CourseCard 
                id={course.id}
                title={course.title}
                icon={course.icon}
                image={course.image}
                stats={course.stats}
                onDelete={handleDeleteCourse} 
            />
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="min-w-[260px] md:min-w-0 shrink-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-[#1f1f1f] text-gray-600 hover:text-gray-400 hover:border-gray-500 transition-all"
              >
                <Plus size={24} />
                <span className="text-xs font-bold mt-2">Add Course</span>
              </button>
          </div>
        )}
      </div>
    </section>
  );
}