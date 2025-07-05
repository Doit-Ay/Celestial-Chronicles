import { Badge, UserProgress } from '../types';
import { spaceEvents } from './spaceEvents'; // Import spaceEvents to check event details

export const badges: Badge[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'View your first space event.',
    icon: '🚀',
    condition: 'view_event_1',
  },
  {
    id: 'historian',
    name: 'Space Historian',
    description: 'View 50 different space events.',
    icon: '📚',
    condition: 'view_events_50',
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Explore events from 10 different years.',
    icon: '⏰',
    condition: 'view_years_10',
  },
  {
    id: 'cosmic-curator',
    name: 'Cosmic Curator',
    description: 'Complete your first collection.',
    icon: '🏆',
    condition: 'complete_collection_1',
  },
  {
    id: 'collection-master',
    name: 'Collection Master',
    description: 'Complete 3 different collections.',
    icon: '👑',
    condition: 'complete_collections_3',
  },
  {
    id: 'apollo-enthusiast',
    name: 'Apollo Enthusiast',
    description: 'Complete the "Apollo Missions" collection.',
    icon: '🌙',
    condition: 'complete_collection_apollo-missions',
  },
  {
    id: 'mars-explorer',
    name: 'Mars Explorer',
    description: 'Complete the "Mars Exploration" collection.',
    icon: '🔴',
    condition: 'complete_collection_mars-exploration',
  },
  {
    id: 'frequent-flyer',
    name: 'Frequent Flyer',
    description: 'Visit the app for 3 consecutive days.',
    icon: '📅',
    condition: 'daily_visits_3',
  },
  {
    id: 'dedicated-explorer',
    name: 'Dedicated Explorer',
    description: 'Visit the app for 7 consecutive days.',
    icon: '🗓️',
    condition: 'daily_visits_7',
  },
  {
    id: 'future-gazer',
    name: 'Future Gazer',
    description: 'Check the upcoming events.',
    icon: '🔮',
    condition: 'view_upcoming_1',
  },
  {
    id: 'orbital-mechanic',
    name: 'Orbital Mechanic',
    description: 'Interact with the 3D solar system 10 times.',
    icon: '🪐',
    condition: 'interact_3d_10',
  },
  {
    id: 'its-full-of-stars',
    name: 'It\'s Full of Stars!',
    description: 'Create your personal cosmic timeline.',
    icon: '✨',
    condition: 'create_timeline',
  }
];

export const getBadgeById = (id: string): Badge | undefined => {
  return badges.find(badge => badge.id === id);
};

// This function now correctly checks conditions against the user's progress.
export const checkBadgeCondition = (condition: string, userProgress: UserProgress): boolean => {
  switch (condition) {
    case 'view_event_1':
      return userProgress.eventsViewed.length >= 1;
    case 'view_events_50':
      return userProgress.eventsViewed.length >= 50;
    case 'view_years_10':
      const viewedYears = new Set(
        userProgress.eventsViewed.map(id => {
          // A more robust way to find the event and its year
          const event = spaceEvents.find(e => e.id === id);
          return event ? event.date.year : null;
        }).filter(year => year !== null)
      );
      return viewedYears.size >= 10;
    case 'complete_collection_1':
        return userProgress.collectionsCompleted.length >= 1;
    case 'complete_collections_3':
      return userProgress.collectionsCompleted.length >= 3;
    case 'complete_collection_apollo-missions':
      return userProgress.collectionsCompleted.includes('apollo-missions');
    case 'complete_collection_mars-exploration':
      return userProgress.collectionsCompleted.includes('mars-exploration');
    case 'daily_visits_3':
      return userProgress.dailyVisits.streak >= 3;
    case 'daily_visits_7':
      return userProgress.dailyVisits.streak >= 7;
    case 'view_upcoming_1':
      return userProgress.upcomingViews >= 1;
    case 'interact_3d_10':
      return userProgress.solarSystemInteractions >= 10;
    case 'create_timeline':
      return !!userProgress.birthdate;
    default:
      return false;
  }
};
