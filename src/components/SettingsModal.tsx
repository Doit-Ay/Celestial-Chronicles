import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Globe, AlertCircle, Loader } from 'lucide-react';
import { UserProgress } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onBirthdateSet: (date: Date) => void;
  onLocationSet: (location: { lat: number; lng: number; city: string }) => void;
}

type Tab = 'personalize' | 'account';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onBirthdateSet,
  onLocationSet
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('personalize');
  const [birthdate, setBirthdate] = useState(
    userProgress.birthdate ? userProgress.birthdate.toISOString().split('T')[0] : ''
  );
  const [city, setCity] = useState(userProgress.location?.city || '');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSave = () => {
    if (birthdate) {
      onBirthdateSet(new Date(birthdate));
    }
    if (city) {
      onLocationSet({ lat: 40.7128, lng: -74.006, city: city });
    }
    onClose();
  };

  const handleGetCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mockCity = 'Current Location';
          onLocationSet({ lat: latitude, lng: longitude, city: mockCity });
          setCity(mockCity);
          setGettingLocation(false);
        },
        (error) => {
          setLocationError(error.message);
          setGettingLocation(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setGettingLocation(false);
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-slate-700 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Settings</h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="border-b border-slate-700 mb-6">
                        <nav className="flex space-x-4">
                            <button onClick={() => setActiveTab('personalize')} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'personalize' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}>Personalize</button>
                            <button onClick={() => setActiveTab('account')} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'account' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}>Account</button>
                        </nav>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'personalize' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="font-semibold text-white mb-2 block flex items-center space-x-2"><Calendar className="w-5 h-5 text-blue-400" /><span>Your Birthdate</span></label>
                                        <p className="text-sm text-slate-400 mb-3">Set your birthdate to create a personalized cosmic timeline of events that happened in your lifetime.</p>
                                        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-white mb-2 block flex items-center space-x-2"><MapPin className="w-5 h-5 text-green-400" /><span>Your Location</span></label>
                                        <p className="text-sm text-slate-400 mb-3">Set your location for personalized notifications about upcoming celestial events visible from your area.</p>
                                        <div className="flex space-x-2">
                                            <input type="text" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                                            <button onClick={handleGetCurrentLocation} disabled={gettingLocation} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center w-12 h-12">
                                                {gettingLocation ? <Loader className="w-5 h-5 animate-spin"/> : <Globe className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {locationError && <p className="text-xs text-red-400 mt-2 flex items-center space-x-1"><AlertCircle className="w-3 h-3"/><span>{locationError}</span></p>}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'account' && (
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Account Details</h3>
                                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Username:</span><span className="text-white">CosmicExplorer</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Member Since:</span><span className="text-white">July 2025</span></div>
                                        <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Subscription:</span><span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Free Tier</span></div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">Save Changes</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};
