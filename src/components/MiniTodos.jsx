import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy 
} from 'firebase/firestore';

export default function MiniTodos({ userId }) {
  const [todos, setTodos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  // 1. Fetch Todos
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "mini_todos"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  // 2. Add Todo
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    await addDoc(collection(db, "mini_todos"), {
      userId,
      text: newTodoText,
      completed: false,
      createdAt: serverTimestamp()
    });
    setNewTodoText('');
    setIsAdding(false);
  };

  // 3. Toggle Complete
  const toggleTodo = async (id, currentStatus) => {
    await updateDoc(doc(db, "mini_todos", id), {
      completed: !currentStatus
    });
  };

  // 4. Delete
  const deleteTodo = async (e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "mini_todos", id));
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mini-To-Do's</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-[10px] bg-[#1f1f1f] px-2 py-1 rounded text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <Plus size={10} /> {isAdding ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* Add Input (Visible when clicking New) */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mb-3">
          <input 
            autoFocus
            type="text" 
            placeholder="Type task & press enter..."
            className="w-full bg-[#0a0a0a] border border-[#2d2d2d] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
        </form>
      )}

      {/* List */}
      <ul className="space-y-3 overflow-y-auto no-scrollbar flex-1">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            onClick={() => toggleTodo(todo.id, todo.completed)}
            className="flex items-center gap-3 text-xs group cursor-pointer"
          >
            {/* Custom Checkbox */}
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-600 border-green-600' : 'border-gray-600 group-hover:border-gray-400'}`}>
              {todo.completed && <Check size={10} className="text-white" />}
            </div>
            
            {/* Text */}
            <span className={`flex-1 transition-colors ${todo.completed ? 'text-gray-600 line-through' : 'text-gray-300 group-hover:text-white'}`}>
              {todo.text}
            </span>

            {/* Delete Button (Hover only) */}
            <button 
              onClick={(e) => deleteTodo(e, todo.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </li>
        ))}
        {todos.length === 0 && !isAdding && (
          <p className="text-[10px] text-gray-600 italic">No pending tasks.</p>
        )}
      </ul>
    </div>
  );
}