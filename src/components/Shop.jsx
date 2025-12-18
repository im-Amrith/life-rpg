import React, { useState, useEffect } from 'react';
import { Coins, Plus, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { 
  doc, updateDoc, increment, onSnapshot, 
  collection, query, where, addDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import AddShopItemModal from './AddShopItemModal';

// Expanded "System" Items with Pixel Art GIFs
const DEFAULT_ITEMS = [
  {
    id: 'sys_coffee',
    title: "Iced Coffee",
    cost: 50,
    desc: "Caffeine boost for the brain.",
    image: "https://64.media.tumblr.com/0bf2a8aec5d523dbf13519c0226a2fc7/tumblr_pnmoydYlEn1y6ld9uo1_1280.gifv", 
    color: "bg-amber-600",
    isSystem: true
  },
  {
    id: 'sys_gaming_1h',
    title: "1 Hour Gaming",
    cost: 80,
    desc: "Guilt-free rank pushing.",
    image: "https://i.pinimg.com/originals/42/58/26/425826d55c531c22b579d4773c68adb5.gif", 
    color: "bg-green-500",
    isSystem: true
  },
  {
    id: 'sys_snack',
    title: "Vending Snack",
    cost: 100,
    desc: "Chips, chocolate, or candy.",
    image: "https://cdnb.artstation.com/p/assets/images/images/042/857/371/original/aleksandra-wojtylak-vending-machine.gif?1635634672", 
    color: "bg-pink-500",
    isSystem: true
  },
  {
    id: 'sys_manga',
    title: "Read Manga",
    cost: 120,
    desc: "Read 5 chapters in peace.",
    image: "https://animesher.com/orig/2/206/2066/20664/animesher.com_pixel-pixel-gif-gif-2066449.gif", 
    color: "bg-blue-400",
    isSystem: true
  },
  {
    id: 'sys_music',
    title: "Lo-Fi Session",
    cost: 150,
    desc: "Zone out with music for 1 hour.",
    image: "https://cdnb.artstation.com/p/assets/images/images/072/923/883/original/alena-sherban-girl.gif?1708519090", 
    color: "bg-purple-400",
    isSystem: true
  },
  {
    id: 'sys_ramen',
    title: "Spicy Ramen",
    cost: 200,
    desc: "A warm bowl of noodles.",
    image: "https://cdna.artstation.com/p/assets/images/images/039/685/944/original/emee-ganibi-bowl-of-ramen-practice-export2.gif?1626639225", 
    color: "bg-orange-500",
    isSystem: true
  },
  {
    id: 'sys_pizza',
    title: "Pizza Night",
    cost: 300,
    desc: "Order a whole pizza.",
    image: "https://i.pinimg.com/originals/7d/bc/1f/7dbc1f3a9aae49f669776aad913e4d30.gif", 
    color: "bg-red-500",
    isSystem: true
  },
  {
    id: 'sys_boba',
    title: "Bubble Tea",
    cost: 250,
    desc: "Large milk tea with pearls.",
    image: "https://i.pinimg.com/originals/c2/04/a3/c204a39219528c1e99aded0f17916606.gif", 
    color: "bg-yellow-600",
    isSystem: true
  },
  {
    id: 'sys_sushi',
    title: "Sushi Platter",
    cost: 450,
    desc: "Fancy dinner out.",
    image: "https://66.media.tumblr.com/ec91d01e032655ead88cb109ed646b8e/tumblr_pz5xlpm2wT1tgo74ho1_640.gif", 
    color: "bg-red-400",
    isSystem: true
  },
  {
    id: 'sys_movie',
    title: "Movie Night",
    cost: 500,
    desc: "Theater trip or Netflix binge.",
    image: "https://i.pinimg.com/originals/8c/f6/06/8cf60608f95bfae20a9e78884e1a33cb.gif", 
    color: "bg-indigo-500",
    isSystem: true
  },
  {
    id: 'sys_sleep',
    title: "Nap Time",
    cost: 600,
    desc: "2 hour nap, no alarms.",
    image: "https://31.media.tumblr.com/9676f7b0d464eacbc2a06c796df97ccf/tumblr_mqc0tjK9le1qbcswco1_500.gif", 
    color: "bg-blue-300",
    isSystem: true
  },
  {
    id: 'sys_concert',
    title: "Concert Tix",
    cost: 2000,
    desc: "Save up for a live show.",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/source/84d1dc46883455.5868f5e2a5313.gif", 
    color: "bg-pink-600",
    isSystem: true
  },
  {
    id: 'sys_dayoff',
    title: "Lazy Day",
    cost: 5000,
    desc: "Do absolutely nothing all day.",
    image: "https://cdn.mos.cms.futurecdn.net/i5jdgiwFjdSzJmrLf9b4Ui.gif", 
    color: "bg-gray-400",
    isSystem: true
  }
];

// Fallback images for user-created rewards
const RANDOM_IMAGES = [
    "https://i.giphy.com/media/3o7TKuVp8rW5yQ9u7a/giphy.gif",
    "https://i.giphy.com/media/3o7TKp7V3J2qJ3X4k0/giphy.gif"
];




export default function Shop({ userId }) {
  const [coins, setCoins] = useState(0);
  const [customItems, setCustomItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Listen to Coins
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "user_stats", userId), (doc) => {
      if (doc.exists()) {
        setCoins(doc.data().coins || 0);
      }
    });
    return () => unsub();
  }, [userId]);

  // 2. Listen to Custom Items
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "shop_items"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snapshot) => {
      setCustomItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [userId]);

  // 3. Add Item
  const handleAddItem = async (formData) => {
    await addDoc(collection(db, "shop_items"), {
        userId,
        title: formData.title,
        cost: formData.cost,
        desc: "Custom Reward",
        image: formData.image || RANDOM_IMAGES[Math.floor(Math.random() * RANDOM_IMAGES.length)],
        color: "bg-purple-500",
        createdAt: serverTimestamp()
    });
  };

  // 4. Delete Item
  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (confirm("Remove this reward?")) {
        await deleteDoc(doc(db, "shop_items", id));
    }
  };

  // 5. Buy Item
  const handleBuy = async (item) => {
    if (coins >= item.cost) {
      const audio = new Audio('/sounds/coin.mp3'); audio.play().catch(() => {}); 
      const playerRef = doc(db, "user_stats", userId);
      await updateDoc(playerRef, { coins: increment(-item.cost) });
      alert(`Purchased ${item.title}!`);
    } else {
      alert("Not enough coins!");
    }
  };

  // Combine Lists
  const allItems = [...DEFAULT_ITEMS, ...customItems];

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 h-full flex flex-col min-w-0">
      
      <AddShopItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddItem} 
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
           <h2 className="text-lg font-bold text-white uppercase tracking-wide">Marketplace</h2>
           <p className="text-[10px] text-gray-500">Spend your hard-earned loot</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2d2d2d] px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
             >
                <Plus size={12} /> Add
             </button>
             <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2d2d2d] px-3 py-1.5 rounded-full">
                <Coins size={14} className="text-yellow-500" />
                <span className="text-yellow-500 font-bold font-mono">{coins}</span>
             </div>
        </div>
      </div>

      {/* Items Grid (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 min-h-0">
        {allItems.map((item) => {
          const canAfford = coins >= item.cost;
          
          return (
            <div 
              key={item.id} 
              className="min-w-[220px] shrink-0 bg-[#141414] border border-[#1f1f1f] rounded-lg overflow-hidden group hover:border-[#2d2d2d] transition-all relative"
            >
              {/* Delete Button (Only for Custom Items) */}
              {!item.isSystem && (
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute top-2 left-2 z-20 bg-black/60 p-1.5 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                     <Trash2 size={12} />
                  </button>
              )}

              {/* Image Area */}
              <div className="h-24 w-full relative overflow-hidden bg-black/50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-yellow-500 border border-yellow-500/20">
                   {item.cost} G
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                 <h3 className="text-xs font-bold text-gray-200 mb-1 truncate">{item.title}</h3>
                 <p className="text-[10px] text-gray-500 mb-3 truncate">{item.desc}</p>
                 
                 <div className="w-full h-1 bg-[#0a0a0a] rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${item.color}`} style={{ width: '60%' }}></div>
                 </div>

                 <button 
                   onClick={() => handleBuy(item)}
                   disabled={!canAfford}
                   className={`
                     w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors
                     ${canAfford 
                        ? 'bg-[#1f1f1f] text-gray-300 hover:bg-white hover:text-black border border-[#2d2d2d]' 
                        : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed border border-transparent'}
                   `}
                 >
                   {canAfford ? 'Purchase' : 'Locked'}
                 </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}