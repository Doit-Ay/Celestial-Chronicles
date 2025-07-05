export interface SpaceEvent {
  id: string;
  date: {
    month: number;
    day: number;
    year: number;
  };
  title: string;
  description: string;
  category: 'mission' | 'discovery' | 'milestone' | 'launch' | 'landing' | 'spacewalk' | 'achievement';
  imageUrl: string;
  significance: string;
  relatedBody?: string;
  collection?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  nasaId?: string;
}

export interface CalendarDate {
  month: number;
  day: number;
  year?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface UserProgress {
  eventsViewed: string[];
  collectionsCompleted: string[];
  badges: Badge[];
  totalPoints: number;
  birthdate?: Date;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  eventIds: string[];
  color: string;
}

export interface UpcomingEvent {
  id: string;
  name: string;
  date: Date;
  type: 'meteor_shower' | 'eclipse' | 'conjunction' | 'transit' | 'launch';
  description: string;
  visibility?: {
    bestTime: string;
    direction: string;
    magnitude?: number;
  };
}

export interface CelestialBody {
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  texture?: string;
  moons?: CelestialBody[];
}