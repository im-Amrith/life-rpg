import React, { useState, useEffect } from 'react';
import { Book, FileText, PenTool, Layout, Plus, ExternalLink, StickyNote, Trash2 } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore'; 
import AddQuickLinkModal from './AddQuickLinkModal'; 

const LINKS_DATA = [
  {
    id: 'assignments',
    title: 'Assignments',
    categoryName: 'Assignments',
    icon: <Book size={16} />,
    image: '/assignment.jpg' 
  },
  {
    id: 'resources',
    title: 'Resources',
    categoryName: 'Resources',
    icon: <Layout size={16} />,
    image: '/resources.jpg' 
  },
  {
    id: 'notes',
    title: 'Notes',
    categoryName: 'Notes',
    icon: <PenTool size={16} />,
    image: '/notes.jpg' 
  },
  {
    id: 'exams',
    title: 'Exams',
    categoryName: 'Exams',
    icon: <FileText size={16} />,
    image: '/exams.jpg' 
  }
];

export default function QuickLinksSection({ userId }) { 
  const [activeCategory, setActiveCategory] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pages, setPages] = useState({}); 

  // 1. Fetch Pages
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "quick_pages"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPages = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const cat = data.category; 
        if (!newPages[cat]) newPages[cat] = [];
        newPages[cat].push({ id: doc.id, ...data });
      });

      setPages(newPages);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleOpenModal = (e, category) => {
    e.stopPropagation();
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  // 2. Add Page
  const handleAddPage = async (formData) => {
    if (!userId || !activeCategory) return;
    try {
      await addDoc(collection(db, "quick_pages"), {
        userId: userId,
        category: activeCategory,
        title: formData.title,
        url: formData.url,
        note: formData.note,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save page.");
    }
  };

  // 3. Delete Page Logic
  const handleDeletePage = async (e, pageId) => {
    e.stopPropagation(); // Stop click from opening the link
    if (confirm("Delete this page?")) {
      try {
        await deleteDoc(doc(db, "quick_pages", pageId));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  return (
    <section>
      <AddQuickLinkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPage}
        category={activeCategory}
      />

      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Access</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LINKS_DATA.map((item) => {
          const categoryPages = pages[item.categoryName] || [];

          return (
            <div 
              key={item.id}
              className="bg-[#121212] rounded-xl border border-[#1f1f1f] overflow-hidden group hover:border-gray-600 transition-all flex flex-col h-[320px]" 
            >
              {/* Header Image */}
              <div className="h-20 shrink-0 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-2 left-3 z-20 flex items-center gap-2 text-white">
                    {item.icon}
                    <span className="font-bold text-sm shadow-black drop-shadow-md">{item.title}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-3 flex flex-col flex-1 min-h-0">
                
                {/* Scrollable List Area */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar mb-3 flex items-center gap-2">
                    {categoryPages.length > 0 ? (
                        categoryPages.map(page => (
                            <div 
                                key={page.id} 
                                className="min-w-[100px] max-w-[100px] h-full bg-[#1a1a1a] border border-[#2d2d2d] rounded p-2 flex flex-col justify-between hover:border-gray-500 transition-colors cursor-pointer group/item relative"
                                onClick={() => page.url ? window.open(page.url, '_blank') : alert(page.note || page.title)}
                            >
                                {/* Delete Button (Visible on Hover) */}
                                <button 
                                  onClick={(e) => handleDeletePage(e, page.id)}
                                  className="absolute top-1 right-1 z-20 opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-red-500 bg-black/50 rounded p-0.5 transition-all"
                                  title="Delete Page"
                                >
                                  <Trash2 size={10} />
                                </button>

                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <StickyNote size={10} className="text-gray-500" />
                                        {page.url && <ExternalLink size={8} className="text-blue-400" />}
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-300 line-clamp-2 leading-tight group-hover/item:text-white">
                                        {page.title}
                                    </p>
                                </div>
                                <p className="text-[8px] text-gray-600 truncate mt-1">
                                    {page.note || "No details"}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-[10px] italic border border-dashed border-[#2d2d2d] rounded">
                            <span>No items yet</span>
                        </div>
                    )}
                </div>

                {/* Add Button */}
                <button 
                  onClick={(e) => handleOpenModal(e, item.categoryName)}
                  className="w-full py-2 rounded border border-dashed border-[#2d2d2d] flex items-center justify-center gap-2 text-[10px] text-gray-500 hover:text-gray-300 hover:border-gray-500 hover:bg-[#1a1a1a] transition-all shrink-0"
                >
                  <Plus size={10} /> New page
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}