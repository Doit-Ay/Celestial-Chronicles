import { Collection } from '../types';

export const collections: Collection[] = [
  {
    id: 'apollo-missions',
    name: 'Apollo Missions',
    description: 'The historic journey that took humanity to the Moon.',
    imageUrl: 'https://images.pexels.com/photos/65704/pexels-photo-65704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: ['apollo-11'], // Add more valid IDs from spaceEvents.ts here
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'women-in-space',
    name: 'Women in Space',
    description: 'Celebrating the pioneering female astronauts and cosmonauts.',
    imageUrl: 'https://images.pexels.com/photos/87009/earth-galaxy-universe-9529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: [], // Add valid IDs here
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'voyager-journey',
    name: 'The Voyager Journey',
    description: 'The epic grand tour of our solar system and beyond.',
    imageUrl: 'https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: [], // Add valid IDs here
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'mars-exploration',
    name: 'Mars Exploration',
    description: 'Our robotic envoys on the Red Planet.',
    imageUrl: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: ['mariner-4-flyby', 'spirit-landing', 'perseverance-landing'],
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'great-observatories',
    name: 'The Great Observatories',
    description: 'Our most powerful eyes on the universe.',
    imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: ['hubble-launch'],
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'space-firsts',
    name: 'Pioneering Firsts',
    description: 'The groundbreaking achievements that started it all.',
    imageUrl: 'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eventIds: ['first-human-in-space', 'first-spacewalk'],
    color: 'from-green-500 to-teal-600'
  }
];

// Functions to get collections remain the same
export const getCollectionById = (id: string): Collection | undefined => {
  return collections.find(collection => collection.id === id);
};

export const getCollectionsByEventId = (eventId: string): Collection[] => {
  return collections.filter(collection => collection.eventIds.includes(eventId));
};
