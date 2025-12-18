import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

export default function PerformanceWidget({ userId }) {
  const [data, setData] = useState([
    { subject: 'Vitality', A: 0, fullMark: 100 },
    { subject: 'Intellect', A: 0, fullMark: 100 },
    { subject: 'Wealth', A: 0, fullMark: 100 },
    { subject: 'Discipline', A: 0, fullMark: 100 },
    { subject: 'Charisma', A: 0, fullMark: 100 },
  ]);

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "user_stats", userId), (docSnap) => {
      if (docSnap.exists()) {
        const stats = docSnap.data();
        
        // 1. Calculate Stats
        const hp = stats.currentHP || 0;
        
        // XP Progress % (Intellect)
        const nextLevel = stats.nextLevelXP || 100;
        const xpProgress = Math.min(100, (stats.currentXP / nextLevel) * 100);

        // Wealth (Cap at 500 coins for 100% visual)
        const coinsScore = Math.min(100, (stats.coins || 0) / 5);

        // Discipline (Base on Level, e.g., Level 10 = 100%)
        const disciplineScore = Math.min(100, (stats.level || 1) * 10);

        // Random Charisma fluctuation for "Live" feel (or map to social tasks later)
        // For now, let's base it on a mix of Level and HP
        const charismaScore = Math.min(100, (hp + xpProgress) / 2);

        setData([
          { subject: 'Vitality', A: hp, fullMark: 100 },
          { subject: 'Intellect', A: Math.round(xpProgress), fullMark: 100 },
          { subject: 'Wealth', A: Math.round(coinsScore), fullMark: 100 },
          { subject: 'Discipline', A: disciplineScore, fullMark: 100 },
          { subject: 'Charisma', A: Math.round(charismaScore), fullMark: 100 },
        ]);
      }
    });

    return () => unsub();
  }, [userId]);

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 h-full flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance</h3>
        <span className="text-[10px] text-pink-500 font-mono">Live Stats</span>
      </div>

      {/* The Chart */}
      <div className="flex-1 min-h-[200px] -ml-6">
        <ResponsiveContainer width="115%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="#ec4899" /* Pink-500 */
              strokeWidth={2}
              fill="#ec4899"
              fillOpacity={0.4}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#ec4899' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    

    </div>
  );
}