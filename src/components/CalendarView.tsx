import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCard } from './EventCard';
import { SpaceDataService } from '../services/spaceDataService';
import { SpaceEvent } from '../types';
import { ChevronLeft, ChevronRight, Loader, Calendar, RotateCcw } from 'lucide-react';
import { format, getDaysInMonth, getDay, startOfMonth } from 'date-fns';

interface CalendarViewProps {
  onEventView: (eventId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onEventView }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize calendar calculations for performance
  const { daysInMonth, firstDayOfMonth } = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return {
      daysInMonth: getDaysInMonth(date),
      firstDayOfMonth: getDay(startOfMonth(date)),
    };
  }, [currentDate]);

  // Fetch detailed events when a day is selected
  useEffect(() => {
    if (selectedDay === null) {
      setEvents([]);
      return;
    }
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const month = currentDate.getMonth() + 1;
        const fetchedEvents = await SpaceDataService.getHistoricalEvents(month, selectedDay);
        
        const filteredEvents = fetchedEvents.filter(event => 
            event.date.month === month && event.date.day === selectedDay
        );

        setEvents(filteredEvents.sort((a, b) => a.date.year - b.date.year));
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedDay, currentDate]);

  const navigateMonth = (amount: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    setSelectedDay(null);
  };
  
  const navigateYear = (amount: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear() + amount, prev.getMonth(), 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  }

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      const isToday = format(new Date(), 'yyyy-MM-dd') === format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');

      days.push(
        <motion.button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`h-14 rounded-lg text-sm font-semibold transition-all duration-200 relative flex items-center justify-center ${
            isSelected ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-600/25' : 'text-slate-300 hover:bg-slate-700/70'
          } ${isToday ? 'border-2 border-yellow-400' : ''}`}
          whileHover={{ scale: isSelected ? 1.05 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
        </motion.button>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                   <button onClick={() => navigateYear(-1)} className="p-2 rounded-lg hover:bg-slate-700"><ChevronLeft className="w-4 h-4" /><ChevronLeft className="w-4 h-4 -ml-2" /></button>
                   <button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg hover:bg-slate-700"><ChevronLeft className="w-5 h-5" /></button>
                </div>
                <h2 className="text-xl font-bold text-white text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-1">
                  <button onClick={() => navigateMonth(1)} className="p-2 rounded-lg hover:bg-slate-700"><ChevronRight className="w-5 h-5" /></button>
                  <button onClick={() => navigateYear(1)} className="p-2 rounded-lg hover:bg-slate-700"><ChevronRight className="w-4 h-4" /><ChevronRight className="w-4 h-4 -ml-2" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400 mb-2">
                {/* FIX: Use the full day name as the key to ensure uniqueness. */}
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="flex items-center justify-center">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
               <button onClick={goToToday} className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span>Go to Today</span>
              </button>
            </div>
          </div>
          
          {/* Selected Date Events */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedDay ? (
                <motion.div key={`${currentDate.getMonth()}-${selectedDay}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Events for {format(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay), 'MMMM d')}
                  </h3>
                  {loading ? (
                    <div className="flex items-center justify-center h-64"><Loader className="w-8 h-8 text-blue-400 animate-spin" /></div>
                  ) : events.length > 0 ? (
                    <div className="space-y-6">
                      {events.map((event, index) => (
                        <EventCard key={event.id} event={event} featured={index === 0} onClick={() => onEventView(event.id)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center bg-slate-800/30 rounded-xl p-8"><h4 className="text-lg font-semibold text-slate-300">No Events Found</h4></div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="prompt" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center h-full bg-slate-800/30 rounded-xl p-8 text-center border-2 border-dashed border-slate-700/50">
                  <div>
                    <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-slate-300 mb-2">Select a Date</h4>
                    <p className="text-slate-400 max-w-xs mx-auto">Click a day on the calendar to explore historical space events.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
