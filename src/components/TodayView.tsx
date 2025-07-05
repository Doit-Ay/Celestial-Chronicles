import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { EventCard } from './EventCard';
import { SpaceDataService } from '../services/spaceDataService';
import { SpaceEvent } from '../types';
import { Calendar, Loader, Quote, XCircle, Lightbulb } from 'lucide-react';

// --- Reusable Component: Quote of the Day ---
const SpaceQuote = ({ quote, author }: { quote: string; author: string }) => (
  <motion.div
    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 my-12 backdrop-blur-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Quote className="w-8 h-8 text-purple-400 mb-4" />
    <blockquote className="text-xl italic text-slate-300">"{quote}"</blockquote>
    <cite className="block text-right mt-4 text-slate-400 font-medium">— {author}</cite>
  </motion.div>
);

// --- Reusable Component: Space Fact of the Day ---
const SpaceFact = ({ fact, source }: { fact: string; source: string }) => (
  <motion.div
    className="bg-slate-800/50 border border-dashed border-slate-700/50 rounded-xl p-6 my-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="flex items-center space-x-3 mb-3">
      <Lightbulb className="w-6 h-6 text-yellow-400" />
      <h4 className="text-lg font-bold text-yellow-300">Cosmic Fact</h4>
    </div>
    <p className="text-slate-300">"{fact}"</p>
    <p className="text-right text-xs mt-3 text-slate-500">- {source}</p>
  </motion.div>
);

// --- Animation Variants for the event grid ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

interface TodayViewProps {
  onEventView: (eventId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onEventView }) => {
  const [todaysEvents, setTodaysEvents] = useState<SpaceEvent[]>([]);
  const [tomorrowsEvents, setTomorrowsEvents] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quote = {
    text: "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.",
    author: "Konstantin Tsiolkovsky"
  };
  
  const spaceFacts = useMemo(() => [
    { text: "A day on Venus is longer than a year on Venus.", source: "NASA" },
    { text: "The footprints on the Moon will be there for 100 million years because there is no wind or water.", source: "NASA" },
    { text: "Neutron stars are so dense that a spoonful would weigh about 6 billion tons.", source: "National Geographic" },
    { text: "The sunset on Mars appears blue.", source: "NASA" },
  ], []);

  const [randomFact] = useState(() => spaceFacts[Math.floor(Math.random() * spaceFacts.length)]);
  
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentMonth = monthNames[today.getUTCMonth()];
  const currentDay = today.getUTCDate();

  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);
  const tomorrowMonth = monthNames[tomorrow.getUTCMonth()];
  const tomorrowDay = tomorrow.getUTCDate();
  
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const MIN_EVENTS_THRESHOLD = 3;
        const utcDate = new Date();
        const todayMonth = utcDate.getUTCMonth() + 1;
        const todayDay = utcDate.getUTCDate();

        const todaysRawEvents = await SpaceDataService.getHistoricalEvents(todayMonth, todayDay);
        const todaysFilteredEvents = todaysRawEvents.filter(event => 
          event.date.month === todayMonth && event.date.day === todayDay
        );
        const todaysSortedEvents = todaysFilteredEvents.sort((a, b) => a.date.year - b.date.year);
        setTodaysEvents(todaysSortedEvents);

        if (todaysSortedEvents.length < MIN_EVENTS_THRESHOLD) {
          const tomorrowDate = new Date();
          tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
          const tomorrowMonthNum = tomorrowDate.getUTCMonth() + 1;
          const tomorrowDayNum = tomorrowDate.getUTCDate();

          const tomorrowsRawEvents = await SpaceDataService.getHistoricalEvents(tomorrowMonthNum, tomorrowDayNum);
          const tomorrowsFilteredEvents = tomorrowsRawEvents.filter(event => 
            event.date.month === tomorrowMonthNum && event.date.day === tomorrowDayNum
          );
          const tomorrowsSortedEvents = tomorrowsFilteredEvents.sort((a, b) => a.date.year - b.date.year);
          setTomorrowsEvents(tomorrowsSortedEvents);
        }

      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    loadEvents();
  }, []);

  const handleEventClick = (event: SpaceEvent) => {
    onEventView(event.id);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Fetching Cosmic History...</h3>
          <p className="text-slate-400">Loading events for {currentMonth} {currentDay}.</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500/50 rounded-xl p-8 max-w-lg">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-300 mb-2">An Error Occurred</h3>
          <p className="text-red-300/80 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-lg">
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }
  
  // Re-introduce the featured/other events logic
  const featuredEvent = todaysEvents[0];
  const otherTodaysEvents = todaysEvents.slice(1);

  return (
    <div className="min-h-screen relative z-10">
      <div className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">On This Day in Space</span>
            </h1>
            <div className="mt-4 flex items-center justify-center space-x-3 text-lg sm:text-xl text-slate-400">
              <Calendar className="w-6 h-6" />
              <span>{currentMonth} {currentDay}</span>
            </div>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
              Discover the remarkable space events that happened on this date throughout history.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-10">
        {todaysEvents.length > 0 ? (
          <>
            {/* Render the featured event */}
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
              <EventCard 
                event={featuredEvent} 
                featured={true}
                onClick={() => handleEventClick(featuredEvent)}
              />
            </motion.div>
            
            {/* Render other events if they exist */}
            {otherTodaysEvents.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {otherTodaysEvents.map((event) => (
                  <motion.div key={event.id} variants={itemVariants}>
                    <EventCard event={event} onClick={() => handleEventClick(event)} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Render tomorrow's events if they were fetched */}
            {tomorrowsEvents.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-white mt-16 mb-8 text-center">Coming Up Tomorrow: {tomorrowMonth} {tomorrowDay}</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {tomorrowsEvents.map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
                      <EventCard event={event} onClick={() => handleEventClick(event)} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}

            <SpaceFact fact={randomFact.text} source={randomFact.source} />
            <SpaceQuote quote={quote.text} author={quote.author} />

          </>
        ) : (
          <>
            {/* "No events today" message */}
            <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-slate-800/50 rounded-xl p-8 max-w-md mx-auto backdrop-blur-sm border border-slate-700/50">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">A Quiet Day in History</h3>
                <p className="text-slate-400">
                  No major space events were recorded for {currentMonth} {currentDay}.
                </p>
              </div>
            </motion.div>
            
            {/* Show tomorrow's events if today is empty */}
            {tomorrowsEvents.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-white mt-8 mb-8 text-center">Coming Up Tomorrow: {tomorrowMonth} {tomorrowDay}</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {tomorrowsEvents.map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
                      <EventCard event={event} onClick={() => handleEventClick(event)} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}

            <SpaceQuote quote={quote.text} author={quote.author} />
          </>
        )}
      </div>
    </div>
  );
};
