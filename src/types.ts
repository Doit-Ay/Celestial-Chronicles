/**
 * Defines the structure for a single achievement badge.
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  condition: string; // The key for the check function
  earned?: boolean;
  earnedDate?: Date;
}

/**
 * Defines the structure for a user's progress and achievements.
 */
export interface UserProgress {
  totalPoints: number;
  eventsViewed: string[];
  collectionsCompleted: string[];
  badges: Badge[];
  birthdate?: Date;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
  solarSystemInteractions: number;
  upcomingViews: number;
  dailyVisits: {
    streak: number;
    lastVisit: string; // ISO date string
  };
}

/**
 * Defines the structure for a historical space event.
 */
export interface SpaceEvent {
  id: string;
  date: {
    month: number;
    day: number;
    year: number;
  };
  title: string;
  description: string;
  category: 'launch' | 'discovery' | 'landing' | 'mission' | 'milestone' | 'spacewalk' | 'achievement';
  imageUrl: string;
  significance: string;
  relatedBody?: string;
  collection?: string;
  nasaId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  relatedImages?: string[];
}

/**
 * Defines the structure for an upcoming celestial event.
 */
export interface UpcomingEvent {
  id: string;
  name: string;
  description: string;
  date: Date;
  type: 'meteor_shower' | 'eclipse' | 'conjunction' | 'transit' | 'launch';
  visibility?: {
    bestTime: string;
    direction: string;
    magnitude?: string;
  };
  notes?: string;
}

/**
 * Defines the structure for a themed collection of events.
 */
export interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
  eventIds: string[];
}
