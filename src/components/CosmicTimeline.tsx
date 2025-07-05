import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Star, Rocket, Clock, X, ChevronDown, ArrowUp } from 'lucide-react';
import { SpaceEvent } from '../types';
import { SpaceDataService } from '../services/spaceDataService';
import { format, differenceInYears } from 'date-fns';

interface CosmicTimelineProps {
  birthdate: Date;
  onClose: () => void;
  onEventView?: (eventId: string) => void;
}

// --- New Component for an individual timeline year ---
const YearNode = ({ year, age, events, onEventClick, getYearColor, isSelected, onSelectYear }: {
  year: number;
  age: number;
  events: SpaceEvent[];
  onEventClick: (event: SpaceEvent) => void;
  getYearColor: (year: number) => string;
  isSelected: boolean;
  onSelectYear: () => void;
}) => {
  const yearColor = getYearColor(year);

  return (
    <div className="flex items-start space-x-4 pl-4">
      {/* Timeline Marker */}
      <div className="flex flex-col items-center h-full">
        <motion.div 
          className={`w-5 h-5 rounded-full bg-gradient-to-r ${yearColor} ring-4 ring-slate-800 z-10`}
          whileHover={{ scale: 1.2 }}
        />
        <div className="w-0.5 flex-grow bg-slate-700/50" />
      </div>

      {/* Year Content */}
      <motion.div 
        className="flex-1 pb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: age * 0.02 }}
      >
        <button 
          onClick={onSelectYear}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{year}</h3>
            <span className="text-sm font-medium text-slate-400">Age {age}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">{events.length} Events</span>
            <motion.div animate={{ rotate: isSelected ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pl-4 border-l-2 border-slate-700 ml-2">
                {events.length > 0 ? (
                  events.map(event => (
                    <motion.div
                      key={event.id}
                      className="bg-slate-900/50 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => onEventClick(event)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-4">
                        <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-md object-cover" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{format(new Date(event.date.year, event.date.month - 1, event.date.day), 'MMMM d')}</p>
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{event.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm pl-2">No major space events found for this year.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


export const CosmicTimeline: React.FC<CosmicTimelineProps> = ({ 
  birthdate, 
  onClose, 
  onEventView 
}) => {
  const [timelineEvents, setTimelineEvents] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const userAge = differenceInYears(new Date(), birthdate);
  const birthYear = birthdate.getFullYear();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadTimelineEvents = async () => {
      setLoading(true);
      const events: SpaceEvent[] = [];
      const promises = [];

      for (let year = birthYear; year <= currentYear; year++) {
        // Fetch from more random dates to get a better sample of events
        for (let i = 0; i < 4; i++) {
            const randomMonth = Math.floor(Math.random() * 12) + 1;
            const randomDay = Math.floor(Math.random() * 28) + 1;
            promises.push(
                SpaceDataService.getHistoricalEvents(randomMonth, randomDay)
                    .then(dayEvents => {
                        const yearEvents = dayEvents.filter(event => event.date.year === year);
                        events.push(...yearEvents);
                    })
                    .catch(error => console.error(`Error loading events for ${year}-${randomMonth}-${randomDay}:`, error))
            );
        }
      }
      
      await Promise.all(promises);

      const uniqueEvents = Array.from(new Map(events.map(e => [e.id, e])).values())
        .sort((a, b) => a.date.year - b.date.year || a.date.month - b.date.month || a.date.day - b.date.day);
      
      setTimelineEvents(uniqueEvents);
      setLoading(false);
    };

    loadTimelineEvents();
  }, [birthdate, birthYear, currentYear]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && scrollRef.current.scrollTop > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    const scrollableDiv = scrollRef.current;
    scrollableDiv?.addEventListener('scroll', handleScroll);
    return () => scrollableDiv?.removeEventListener('scroll', handleScroll);
  }, []);

  const getEventsForYear = (year: number) => {
    return timelineEvents.filter(event => event.date.year === year);
  };

  const getYearColor = (year: number) => {
    const age = year - birthYear;
    if (age < 5) return 'from-pink-500 to-rose-500';
    if (age < 13) return 'from-blue-500 to-cyan-500';
    if (age < 18) return 'from-green-500 to-teal-500';
    if (age < 25) return 'from-yellow-500 to-orange-500';
    return 'from-indigo-500 to-purple-500';
  };

  const handleEventClick = (event: SpaceEvent) => {
    if (onEventView) {
      onEventView(event.id);
    }
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(prev => (prev === year ? null : year));
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white">Building Your Cosmic Timeline...</h3>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      {/* FIX: Increased top padding to clear the main app header */}
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/80 backdrop-blur-md rounded-xl p-6 mb-8 sticky top-4 z-20 border border-slate-700/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Cosmic Timeline</h2>
                  <p className="text-slate-400">A journey through space history during your lifetime.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
             <div className="absolute top-0 left-6 w-0.5 h-full bg-slate-700/50" />
             {Array.from({ length: currentYear - birthYear + 1 }, (_, i) => currentYear - i).map((year) => (
                <YearNode
                    key={year}
                    year={year}
                    age={year - birthYear}
                    events={getEventsForYear(year)}
                    onEventClick={handleEventClick}
                    getYearColor={getYearColor}
                    isSelected={selectedYear === year}
                    onSelectYear={() => handleSelectYear(year)}
                />
             ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
