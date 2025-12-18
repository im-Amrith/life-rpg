import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Coins, Heart, Zap } from 'lucide-react'; // Import icons

export default function StatusWindow({ userId }) {
  const [stats, setStats] = useState({ level: 1, currentXP: 0, nextLevelXP: 100, currentHP: 100, coins: 0 });

  useEffect(() => {
    if (!userId) return;
    const playerRef = doc(db, "user_stats", userId);

    const unsub = onSnapshot(playerRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        setDoc(playerRef, {
          level: 1, currentXP: 0, nextLevelXP: 100, currentHP: 100, coins: 0
        });
      }
    });
    return () => unsub();
  }, [userId]);

  const safeNextLevel = stats.nextLevelXP || 100;
  const progressPercent = Math.min((stats.currentXP / safeNextLevel) * 100, 100);
  const currentHP = stats.currentHP !== undefined ? stats.currentHP : 100;
  const maxHP = 100;
  const hpPercent = Math.max(0, (currentHP / maxHP) * 100);

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 h-full">
      {/* Header with Level and Coins */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#2d2d2d] text-gray-400">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">Player Status</h3>
            <p className="text-xs text-green-500 font-bold mt-1">Level {stats.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-[#2d2d2d]">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">{stats.coins}</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-5">
        {/* XP BAR */}
        <div>
          <div className="flex justify-between mb-2 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400 font-medium">
              <Zap size={12} className="text-green-500" /> Experience
            </span>
            <span className="text-gray-500 font-mono">{stats.currentXP} / {safeNextLevel}</span>
          </div>
          <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2d2d2d]">
            <motion.div 
              className="h-full bg-green-500" 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }} 
            />
          </div>
        </div>

        {/* HP BAR */}
        <div>
          <div className="flex justify-between mb-2 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400 font-medium">
              <Heart size={12} className="text-red-500" /> Health
            </span>
            <span className="text-gray-500 font-mono">{currentHP} / {maxHP}</span>
          </div>
          <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2d2d2d]">
            <motion.div 
              className="h-full bg-red-600" 
              initial={{ width: "100%" }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}