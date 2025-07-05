import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { SolarSystem3D } from './components/SolarSystem3D';
import { CosmicTimeline } from './components/CosmicTimeline';
import { FutureSight } from './components/FutureSight';
import { CollectionsView } from './components/CollectionsView';
import { GamificationPanel } from './components/GameificationPanel';
import { SettingsModal } from './components/SettingsModal';
import { EventDetailModal } from './components/EventDetailModal';
import { StarfieldBackground } from './components/StarfieldBackground';
import { useUserProgress } from './hooks/useUserProgress';

type ViewType = 'today' | 'calendar' | 'solar-system' | 'timeline' | 'future' | 'collections' | 'achievements';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [showSettings, setShowSettings] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hasIncrementedFutureSight, setHasIncrementedFutureSight] = useState(false);
  
  // REMOVED: Unused state and functions related to the old 3D canvas.
  const {
    userProgress,
    viewEvent,
    setBirthdate,
    setLocation,
    incrementUpcomingViews
  } = useUserProgress();

  useEffect(() => {
    if (currentView === 'future' && !hasIncrementedFutureSight) {
      incrementUpcomingViews();
      setHasIncrementedFutureSight(true);
    } else if (currentView !== 'future') {
      setHasIncrementedFutureSight(false);
    }
  }, [currentView, hasIncrementedFutureSight, incrementUpcomingViews]);

  const handleEventView = (eventId: string) => {
    viewEvent(eventId);
    setSelectedEventId(eventId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView onEventView={handleEventView} />;
      
      case 'calendar':
        return <CalendarView onEventView={handleEventView} />;
      
      case 'solar-system':
        return (
          <div className="min-h-screen py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900/70 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">NASA's Eyes on the Solar System</h2>
                <p className="text-slate-400 mb-6">
                  Explore a real-time visualization of our solar system, powered by NASA's Eyes.
                </p>
                {/* UPDATED: The container now holds the iframe-based component. */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  <SolarSystem3D />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'timeline':
        if (!userProgress.birthdate) {
          return (
            <div className="min-h-screen flex items-center justify-center relative z-10">
              <div className="text-center max-w-md mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-4">Set Your Birthdate</h2>
                <p className="text-slate-400 mb-6">
                  To create your personalized cosmic timeline, please set your birthdate in settings.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Open Settings
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="min-h-screen py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CosmicTimeline 
                birthdate={userProgress.birthdate}
                onClose={() => setCurrentView('today')}
                onEventView={handleEventView}
              />
            </div>
          </div>
        );
      
      case 'future':
        return (
          <div className="min-h-screen py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FutureSight userLocation={userProgress.location} />
            </div>
          </div>
        );
      
      case 'collections':
        return (
          <div className="min-h-screen py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CollectionsView 
                userProgress={userProgress}
                onEventView={handleEventView}
              />
            </div>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="min-h-screen py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <GamificationPanel userProgress={userProgress} />
            </div>
          </div>
        );
      
      default:
        return <TodayView onEventView={handleEventView} />;
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-950">
      <StarfieldBackground />
      
      <div className="relative z-10">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          userProgress={userProgress}
          onSettingsClick={() => setShowSettings(true)}
        />
        
        {renderCurrentView()}

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userProgress={userProgress}
          onBirthdateSet={setBirthdate}
          onLocationSet={setLocation}
        />

        {showTimeline && userProgress.birthdate && (
          <CosmicTimeline 
            birthdate={userProgress.birthdate}
            onClose={() => setShowTimeline(false)}
            onEventView={handleEventView}
          />
        )}

        {selectedEventId && (
          <EventDetailModal
            eventId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
