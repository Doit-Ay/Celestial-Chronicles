import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Star, MapPin, ExternalLink, Share2, Bookmark, Loader } from 'lucide-react';
import { SpaceEvent } from '../types';
import { SpaceDataService } from '../services/spaceDataService';
import { format } from 'date-fns';

interface EventDetailModalProps {
  eventId: string;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, onClose }) => {
  const [event, setEvent] = useState<SpaceEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const loadEventDetails = async () => {
      setLoading(true);
      try {
        // FIX: Fetch real event data using the eventId instead of using mock data.
        const fetchedEvent = await SpaceDataService.getEventById(eventId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Error loading event details:', error);
        setEvent(null); // Set to null on error to show the "Not Found" state
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
        loadEventDetails();
    }
  }, [eventId]);

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, this would be saved to user preferences.
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Loading Event Details...</h3>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-auto text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">Event Not Found</h3>
          <p className="text-slate-400 mb-6">Sorry, we couldn't load the details for this event.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-4xl w-full mx-auto bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
        >
          {/* Header Image */}
          <div className="relative h-72">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent" />
            <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={handleBookmark} className={`p-2 rounded-full backdrop-blur-sm transition-colors ${bookmarked ? 'bg-yellow-400/20 text-yellow-300' : 'bg-black/30 text-white hover:bg-black/50'}`}><Bookmark className="w-5 h-5" /></button>
                <button onClick={handleShare} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors"><Share2 className="w-5 h-5" /></button>
                <button onClick={onClose} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-4xl font-bold text-white shadow-black/50" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{event.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-200 mt-2">
                <div className="flex items-center space-x-1.5"><Calendar className="w-4 h-4" /><span>{format(new Date(event.date.year, event.date.month - 1, event.date.day), 'MMMM d, yyyy')}</span></div>
                {event.relatedBody && <div className="flex items-center space-x-1.5"><MapPin className="w-4 h-4" /><span>{event.relatedBody}</span></div>}
                <div className="flex items-center space-x-1.5"><Star className="w-4 h-4" /><span>{event.category}</span></div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 border-b-2 border-slate-700 pb-2">Event Summary</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{event.description}</p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 border-b-2 border-slate-700 pb-2">Historical Significance</h2>
                  <p className="text-slate-300 leading-relaxed">{event.significance}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3">Quick Facts</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span className="text-slate-400">Category:</span> <span className="text-white capitalize">{event.category}</span></li>
                    {event.relatedBody && <li className="flex justify-between"><span className="text-slate-400">Body:</span> <span className="text-white">{event.relatedBody}</span></li>}
                    {event.nasaId && <li className="flex justify-between"><span className="text-slate-400">NASA ID:</span> <span className="text-white text-xs">{event.nasaId}</span></li>}
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-3">Learn More</h3>
                  <div className="space-y-2">
                    <a href={`https://www.nasa.gov/search/?q=${encodeURIComponent(event.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"><ExternalLink className="w-4 h-4" /><span>NASA Archives</span></a>
                    <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(event.title.replace(/\s+/g, '_'))}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"><ExternalLink className="w-4 h-4" /><span>Wikipedia</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
