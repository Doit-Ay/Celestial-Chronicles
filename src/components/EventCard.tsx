import React from 'react';
import { motion } from 'framer-motion';
import { SpaceEvent } from '../types';
import { Calendar, Star, Rocket, Telescope, MapPin, Zap, Award, Footprints } from 'lucide-react';

interface EventCardProps {
  event: SpaceEvent;
  featured?: boolean;
  onClick?: () => void;
}

const getCategoryIcon = (category: SpaceEvent['category']) => {
  switch (category) {
    case 'launch': return Rocket;
    case 'discovery': return Telescope;
    case 'landing': return MapPin;
    case 'mission': return Star;
    case 'milestone': return Zap;
    case 'spacewalk': return Footprints;
    case 'achievement': return Award;
    default: return Star;
  }
};

const getCategoryTheme = (category: SpaceEvent['category']) => {
  switch (category) {
    case 'launch': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', shadow: 'shadow-orange-500/20', text: 'text-orange-400', iconBg: 'bg-orange-500' };
    case 'discovery': return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', shadow: 'shadow-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500' };
    case 'landing': return { bg: 'bg-green-500/10', border: 'border-green-500/30', shadow: 'shadow-green-500/20', text: 'text-green-400', iconBg: 'bg-green-500' };
    case 'mission': return { bg: 'bg-sky-500/10', border: 'border-sky-500/30', shadow: 'shadow-sky-500/20', text: 'text-sky-400', iconBg: 'bg-sky-500' };
    case 'milestone': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', shadow: 'shadow-yellow-500/20', text: 'text-yellow-400', iconBg: 'bg-yellow-500' };
    case 'spacewalk': return { bg: 'bg-teal-500/10', border: 'border-teal-500/30', shadow: 'shadow-teal-500/20', text: 'text-teal-400', iconBg: 'bg-teal-500' };
    case 'achievement': return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', shadow: 'shadow-pink-500/20', text: 'text-pink-400', iconBg: 'bg-pink-500' };
    default: return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', shadow: 'shadow-gray-500/20', text: 'text-gray-400', iconBg: 'bg-gray-500' };
  }
};

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false, onClick }) => {
  const IconComponent = getCategoryIcon(event.category);
  const theme = getCategoryTheme(event.category);

  // --- Featured Card Layout ---
  if (featured) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="group relative lg:col-span-2 flex flex-col md:flex-row overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
        onClick={onClick}
      >
        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}>
              <IconComponent className="w-4 h-4" />
              <span className="capitalize">{event.category}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{event.date.month}/{event.date.day}/{event.date.year}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200">
            {event.title}
          </h3>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed flex-grow">
            {event.description}
          </p>
          <div className={`bg-slate-800/70 rounded-lg p-4 border-l-4 ${theme.border}`}>
            <p className="text-xs font-medium text-slate-400 mb-1">Historical Significance</p>
            <p className="text-sm text-slate-200">{event.significance}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Standard Card Layout ---
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/30 cursor-pointer flex flex-col`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent" />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span className="capitalize">{event.category}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.date.month}/{event.date.day}/{event.date.year}</span>
            </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200 flex-grow">
          {event.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {event.description.substring(0, 100)}{event.description.length > 100 && '...'}
        </p>
      </div>
    </motion.div>
  );
};
