import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Calendar, Star, Trophy, Telescope, Globe, User, Settings, Sparkles, Bell, Clock } from 'lucide-react';

// --- Helper Component for a Live Clock ---
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4 text-slate-400" />
      <span className="text-sm font-medium text-slate-300 font-mono">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};


interface HeaderProps {
  currentView: 'today' | 'calendar' | 'solar-system' | 'timeline' | 'future' | 'collections' | 'achievements';
  onViewChange: (view: 'today' | 'calendar' | 'solar-system' | 'timeline' | 'future' | 'collections' | 'achievements') => void;
  userProgress: any;
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  userProgress,
  onSettingsClick 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // State to simulate a notification for the bell icon
  const [hasNotification, setHasNotification] = useState(true);

  const navItems = [
    { id: 'today', label: 'Today', icon: Star, description: 'Today in Space' },
    { id: 'calendar', label: 'Explore', icon: Calendar, description: 'Browse History' },
    { id: 'solar-system', label: '3D System', icon: Globe, description: 'Interactive Solar System' },
    { id: 'timeline', label: 'Timeline', icon: User, description: 'Your Cosmic Journey' },
    { id: 'future', label: 'FutureSight', icon: Telescope, description: 'Upcoming Events' },
    { id: 'collections', label: 'Collections', icon: Trophy, description: 'Themed Explorations' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, description: 'Your Progress' }
  ] as const;

  return (
    <header className="bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/50 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* --- Logo Section --- */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onViewChange('today')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div 
                className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Celestial Chronicles
              </h1>
            </div>
          </motion.div>
          
          {/* --- Desktop Navigation --- */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  className="relative group"
                >
                  <button
                    onClick={() => onViewChange(item.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 relative ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center space-x-2">
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </nav>

          {/* --- User Controls Section --- */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
              <LiveClock />
              <motion.button
                onClick={() => setHasNotification(false)}
                className="relative p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Bell className="w-5 h-5" />
                {hasNotification && (
                  <motion.div 
                    className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
            
            <motion.button
              onClick={onSettingsClick}
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* --- Mobile Menu Button --- */}
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              <motion.div 
                className="w-5 h-5 flex flex-col justify-center items-center"
                animate={showMobileMenu ? "open" : "closed"}
              >
                <motion.span className="block w-full h-0.5 bg-current" variants={{ closed: { rotate: 0, y: -4 }, open: { rotate: 45, y: 0.5 } }} />
                <motion.span className="block w-full h-0.5 bg-current mt-1.5" variants={{ closed: { rotate: 0, y: 4 }, open: { rotate: -45, y: -0.5 } }} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 border-t border-slate-800/50">
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id as any);
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 font-bold">{userProgress.totalPoints}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-bold">{userProgress.badges.length}</span>
                    </div>
                 </div>
                 <LiveClock />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
