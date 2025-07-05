import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Telescope, MapPin, Clock, Star, Calendar, X, Globe } from 'lucide-react';
import { UpcomingEvent } from '../types';
import { SpaceDataService } from '../services/spaceDataService';
import { format, formatDistanceToNowStrict } from 'date-fns';

// --- Custom Hook for a real-time countdown ---
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState(formatDistanceToNowStrict(targetDate, { addSuffix: true }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatDistanceToNowStrict(targetDate, { addSuffix: true }));
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// --- New, improved component for a single event row ---
const EventRow = ({ event, onSelect }: { event: UpcomingEvent; onSelect: (event: UpcomingEvent, icon: string) => void; }) => {
  const timeLeft = useCountdown(event.date);

  const getEventIcon = (type: UpcomingEvent['type']): string => {
    switch (type) {
      case 'meteor_shower': return '☄️';
      case 'eclipse': return '🌑';
      case 'conjunction': return '🪐';
      case 'transit': return '🌟';
      case 'launch': return '🚀';
      default: return '⭐';
    }
  };
  
  const icon = getEventIcon(event.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}
      className="flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-colors"
      onClick={() => onSelect(event, icon)}
    >
      <div className="text-3xl bg-slate-800 p-3 rounded-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{event.name}</h3>
        <p className="text-sm text-slate-400 truncate">{event.description}</p>
      </div>
      <div className="text-right flex-shrink-0 w-28">
        <div className="font-semibold text-slate-200">{format(event.date, 'MMM d')}</div>
        <div className="text-xs text-slate-400">{timeLeft}</div>
      </div>
    </motion.div>
  );
};

// --- New, improved component for the event detail modal ---
const EventDetailModal = ({ event, icon, onClose }: { event: UpcomingEvent; icon: string; onClose: () => void; }) => {
    const getEventColor = (type: UpcomingEvent['type']) => {
        switch (type) {
          case 'meteor_shower': return 'from-orange-500 to-red-500';
          case 'eclipse': return 'from-slate-600 to-black';
          case 'conjunction': return 'from-blue-500 to-purple-500';
          case 'transit': return 'from-yellow-500 to-orange-500';
          case 'launch': return 'from-emerald-500 to-green-500';
          default: return 'from-indigo-500 to-purple-500';
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-black/30"
          >
            <div className="flex items-start justify-between mb-4">
                <div className={`text-4xl p-4 rounded-xl bg-gradient-to-br ${getEventColor(event.type)}`}>
                    {icon}
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
            <p className="text-slate-300 mb-6">{event.description}</p>
            
            <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-white font-medium">{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              {event.visibility && (
                <>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">Best time to watch: <span className="font-bold">{event.visibility.bestTime}</span></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-white">Look towards the <span className="font-bold">{event.visibility.direction}</span></span>
                  </div>
                  {event.visibility.magnitude && (
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-white">Apparent Magnitude: <span className="font-bold">{event.visibility.magnitude}</span></span>
                    </div>
                  )}
                </>
              )}
            </div>
            {event.notes && (
                <div className="mt-4 text-xs text-slate-400 border-t border-slate-700 pt-4">
                    <h4 className="font-semibold text-slate-300 mb-1">Viewing Tips:</h4>
                    <p>{event.notes}</p>
                </div>
            )}
          </motion.div>
        </div>
    )
}

// --- Main FutureSight Component ---
interface FutureSightProps {
  userLocation?: { lat: number; lng: number; city: string };
}

export const FutureSight: React.FC<FutureSightProps> = ({ userLocation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<{event: UpcomingEvent, icon: string} | null>(null);

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setLoading(true);
      try {
        const events = await SpaceDataService.getUpcomingEvents(userLocation);
        const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());
        setUpcomingEvents(sortedEvents);
      } catch (error) {
        console.error('Error loading upcoming events:', error);
      } finally {
        setTimeout(() => setLoading(false), 700);
      }
    };

    loadUpcomingEvents();
  }, [userLocation]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-slate-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-700 rounded"></div>
                      <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                  </div>
                  <div className="w-20 h-8 bg-slate-700 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Telescope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">FutureSight</h2>
              <p className="text-slate-400">A glimpse into upcoming celestial events.</p>
            </div>
          </div>

          {userLocation && (
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-center space-x-2 mb-4 text-sm text-slate-300 bg-slate-700/50 p-3 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Viewing events visible from <span className="font-bold text-white">{userLocation.city}</span></span>
            </motion.div>
          )}

          <div className="space-y-2">
            <AnimatePresence>
                {upcomingEvents.map((event) => (
                    <EventRow key={event.id} event={event} onSelect={(eventData, icon) => setSelectedEvent({event: eventData, icon})} />
                ))}
            </AnimatePresence>
          </div>

          {upcomingEvents.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-400">
              <Telescope className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-semibold text-white">The Cosmos is Quiet</h3>
              <p className="mt-2">No major upcoming events found for your location at this time. Please check back later!</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal event={selectedEvent.event} icon={selectedEvent.icon} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </>
  );
};
