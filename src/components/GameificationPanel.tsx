import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Target, Check } from 'lucide-react';
import { badges, checkBadgeCondition } from '../data/badges';
import { Badge, UserProgress } from '../types';

interface GamificationPanelProps {
  userProgress: UserProgress;
}

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
        <div className={`p-3 rounded-md bg-gradient-to-br ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    </div>
);

const BadgeCard = ({ badge, isEarned, progress, onClick }: { badge: Badge; isEarned: boolean; progress?: number; onClick: () => void; }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className={`rounded-xl p-4 text-center cursor-pointer transition-all duration-300 border ${isEarned ? 'bg-slate-700/50 border-slate-700' : 'bg-slate-800/30 border-slate-800'}`}
        onClick={onClick}
    >
        <div className={`relative inline-block text-5xl mb-3 transition-all duration-300 ${isEarned ? 'grayscale-0' : 'grayscale opacity-50'}`}>
            {badge.icon}
            {isEarned && (
                <motion.div initial={{scale: 0}} animate={{scale: 1}} className="absolute -top-1 -right-1 bg-green-500 p-1 rounded-full">
                    <Check className="w-3 h-3 text-white" />
                </motion.div>
            )}
        </div>
        <h4 className={`font-bold ${isEarned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
        <p className={`text-xs mt-1 ${isEarned ? 'text-slate-400' : 'text-slate-600'}`}>{badge.description}</p>
        {!isEarned && progress !== undefined && (
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
                <motion.div 
                    className="bg-blue-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%`}}
                    transition={{ duration: 0.5 }}
                />
            </div>
        )}
    </motion.div>
);

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ userProgress }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadges = userProgress.badges;
  const availableBadges = badges.filter(badge => !earnedBadges.some(b => b.id === badge.id));

  const getProgressForBadge = (badge: Badge) => {
    switch (badge.condition) {
      case 'view_event': return Math.min(userProgress.eventsViewed.length, 1);
      case 'view_years_10': return new Set(userProgress.eventsViewed.map((id: string) => id.split('-')[2])).size;
      case 'view_events_100': return userProgress.eventsViewed.length;
      case 'complete_collections_3': return userProgress.collectionsCompleted.length;
      default: return 0;
    }
  };

  const getProgressMax = (badge: Badge): number => {
    switch (badge.condition) {
      case 'view_event': return 1;
      case 'view_years_10': return 10;
      case 'view_events_100': return 100;
      case 'complete_collections_3': return 3;
      case 'daily_visits_7': return 7;
      case 'view_upcoming_5': return 5;
      case 'interact_3d_10': return 10;
      default: return 1;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Your Achievements</h1>
        <p className="text-slate-400 mt-2">Track your progress and unlock new badges as you explore the cosmos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Star className="w-6 h-6 text-white" />} label="Total Points" value={userProgress.totalPoints} color="from-yellow-500 to-orange-500" />
        <StatCard icon={<Award className="w-6 h-6 text-white" />} label="Badges Earned" value={earnedBadges.length} color="from-purple-500 to-indigo-500" />
        <StatCard icon={<Target className="w-6 h-6 text-white" />} label="Events Viewed" value={userProgress.eventsViewed.length} color="from-blue-500 to-cyan-500" />
        <StatCard icon={<Trophy className="w-6 h-6 text-white" />} label="Collections Done" value={userProgress.collectionsCompleted.length} color="from-green-500 to-emerald-500" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {earnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} isEarned={true} onClick={() => setSelectedBadge(badge)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-800/30 rounded-lg"><p className="text-slate-500">Start exploring to earn your first badge!</p></div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Badges in Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableBadges.map(badge => {
            const progress = getProgressForBadge(badge);
            const max = getProgressMax(badge);
            const percentage = Math.round((progress / max) * 100);
            return <BadgeCard key={badge.id} badge={badge} isEarned={false} progress={percentage} onClick={() => setSelectedBadge(badge)} />;
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center border border-slate-700 shadow-2xl"
            >
              <motion.div 
                className="text-7xl mb-4 inline-block"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {selectedBadge.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h3>
              <p className="text-slate-400 mb-6">{selectedBadge.description}</p>
              
              {userProgress.badges.some(b => b.id === selectedBadge.id) ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 text-green-300">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Achievement Unlocked!</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-300 mb-2">Progress</p>
                  <div className="w-full bg-slate-600 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${Math.round((getProgressForBadge(selectedBadge) / getProgressMax(selectedBadge)) * 100)}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{getProgressForBadge(selectedBadge)} / {getProgressMax(selectedBadge)}</p>
                </div>
              )}
              
              <button onClick={() => setSelectedBadge(null)} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
