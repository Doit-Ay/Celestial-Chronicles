import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Badge } from '../types';
import { badges, checkBadgeCondition } from '../data/badges';
import { isYesterday, parseISO } from 'date-fns';

const STORAGE_KEY = 'celestial-chronicles-progress';

// --- Constants for point values ---
const POINTS = {
  VIEW_EVENT: 10,
  COMPLETE_COLLECTION: 100,
  SET_BIRTHDATE_FIRST_TIME: 25,
  SET_LOCATION_FIRST_TIME: 15,
  INTERACT_3D: 5,
  VIEW_UPCOMING: 2,
  BADGE_AWARD: 50,
};

const defaultProgress: UserProgress = {
  eventsViewed: [],
  collectionsCompleted: [],
  badges: [],
  totalPoints: 0,
  birthdate: undefined,
  location: undefined,
  solarSystemInteractions: 0,
  upcomingViews: 0,
  dailyVisits: {
    streak: 0,
    lastVisit: new Date(0).toISOString(), // A long time ago
  },
};

export const useUserProgress = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);

  // Centralized function to check for and award new badges
  const checkAndAwardBadges = useCallback((currentProgress: UserProgress): UserProgress => {
    const newBadges = badges.filter(badge => 
      !currentProgress.badges.some(b => b.id === badge.id) &&
      checkBadgeCondition(badge.condition, currentProgress)
    );

    if (newBadges.length > 0) {
      return {
        ...currentProgress,
        badges: [...currentProgress.badges, ...newBadges],
        totalPoints: currentProgress.totalPoints + (newBadges.length * POINTS.BADGE_AWARD),
      };
    }
    return currentProgress;
  }, []);

  // Load progress from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const loadedProgress: UserProgress = {
          ...defaultProgress,
          ...parsed,
          birthdate: parsed.birthdate ? parseISO(parsed.birthdate) : undefined,
          badges: parsed.badges || [],
        };
        
        // Check for daily visit on load
        const today = new Date().toISOString().split('T')[0];
        const lastVisitDate = parseISO(loadedProgress.dailyVisits.lastVisit);

        if (today !== loadedProgress.dailyVisits.lastVisit.split('T')[0]) {
            const streak = isYesterday(lastVisitDate) ? loadedProgress.dailyVisits.streak + 1 : 1;
            loadedProgress.dailyVisits = { streak, lastVisit: new Date().toISOString() };
        }
        
        setUserProgress(checkAndAwardBadges(loadedProgress));
      } else {
        // First visit
        const initialProgress = {
            ...defaultProgress,
            dailyVisits: { streak: 1, lastVisit: new Date().toISOString() }
        };
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      setUserProgress(defaultProgress);
    }
  }, [checkAndAwardBadges]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }, [userProgress]);

  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setUserProgress(prev => {
        const newProgress = updater(prev);
        // Always check for new badges after an update
        return checkAndAwardBadges(newProgress);
    });
  };

  const viewEvent = (eventId: string) => {
    updateProgress(prev => {
      if (prev.eventsViewed.includes(eventId)) return prev;
      return {
        ...prev,
        eventsViewed: [...prev.eventsViewed, eventId],
        totalPoints: prev.totalPoints + POINTS.VIEW_EVENT
      };
    });
  };

  const completeCollection = (collectionId: string) => {
    updateProgress(prev => {
      if (prev.collectionsCompleted.includes(collectionId)) return prev;
      return {
        ...prev,
        collectionsCompleted: [...prev.collectionsCompleted, collectionId],
        totalPoints: prev.totalPoints + POINTS.COMPLETE_COLLECTION
      };
    });
  };

  const setBirthdate = (birthdate: Date) => {
    updateProgress(prev => ({
      ...prev,
      birthdate,
      totalPoints: prev.totalPoints + (prev.birthdate ? 0 : POINTS.SET_BIRTHDATE_FIRST_TIME)
    }));
  };

  const setLocation = (location: { lat: number; lng: number; city: string }) => {
    updateProgress(prev => ({
      ...prev,
      location,
      totalPoints: prev.totalPoints + (prev.location ? 0 : POINTS.SET_LOCATION_FIRST_TIME)
    }));
  };

  const incrementSolarSystemInteractions = () => {
    updateProgress(prev => ({
      ...prev,
      solarSystemInteractions: (prev.solarSystemInteractions || 0) + 1,
      totalPoints: prev.totalPoints + POINTS.INTERACT_3D
    }));
  };

  const incrementUpcomingViews = () => {
    updateProgress(prev => ({
      ...prev,
      upcomingViews: (prev.upcomingViews || 0) + 1,
      totalPoints: prev.totalPoints + POINTS.VIEW_UPCOMING
    }));
  };

  return {
    userProgress,
    viewEvent,
    completeCollection,
    setBirthdate,
    setLocation,
    incrementSolarSystemInteractions,
    incrementUpcomingViews
  };
};
