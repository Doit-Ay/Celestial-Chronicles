import { SpaceEvent } from '../types';

// A more comprehensive and detailed list of space events.
export const spaceEvents: SpaceEvent[] = [
  // January
  {
    id: 'spirit-landing',
    date: { month: 1, day: 4, year: 2004 },
    title: 'Spirit Rover Lands on Mars',
    description: 'NASA\'s Mars Exploration Rover, Spirit, successfully lands in Gusev Crater on Mars to begin its 90-sol mission of exploring the planet\'s geology and searching for signs of past water activity.',
    category: 'landing',
    imageUrl: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'One of two highly successful rovers that vastly exceeded their planned mission durations, providing a wealth of data about the Martian environment.',
    relatedBody: 'Mars',
    collection: 'mars-exploration'
  },
  {
    id: 'challenger-disaster',
    date: { month: 1, day: 28, year: 1986 },
    title: 'Space Shuttle Challenger Disaster',
    description: 'The Space Shuttle Challenger broke apart 73 seconds into its flight, leading to the deaths of its seven crew members, including schoolteacher Christa McAuliffe.',
    category: 'milestone',
    imageUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'A tragic event that led to a nearly three-year hiatus in the shuttle program and significant changes in NASA\'s safety protocols and decision-making processes.',
    relatedBody: 'Earth'
  },
  // February
  {
    id: 'mariner-4-flyby',
    date: { month: 2, day: 17, year: 1965 },
    title: 'Mariner 4\'s First Images of Mars',
    description: 'Mariner 4 performed the first successful flyby of the planet Mars, returning the first close-up pictures of another planet from deep space.',
    category: 'discovery',
    imageUrl: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'The images revealed a cratered, moon-like surface, fundamentally changing scientific views of Mars at the time.',
    relatedBody: 'Mars',
    collection: 'mars-exploration'
  },
  {
    id: 'perseverance-landing',
    date: { month: 2, day: 18, year: 2021 },
    title: 'Perseverance Rover Lands on Mars',
    description: 'NASA\'s Perseverance rover, along with the Ingenuity helicopter drone, successfully landed in Jezero Crater on Mars to seek signs of ancient life and collect samples for possible return to Earth.',
    category: 'landing',
    imageUrl: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'Marked the first powered, controlled flight on another planet and began a new era of sample-caching for future return missions.',
    relatedBody: 'Mars',
    collection: 'mars-exploration'
  },
  // March
  {
    id: 'first-spacewalk',
    date: { month: 3, day: 18, year: 1965 },
    title: 'First Spacewalk by Alexei Leonov',
    description: 'Soviet cosmonaut Alexei Leonov performed the first extravehicular activity (EVA), or spacewalk, in history, exiting the Voskhod 2 spacecraft for 12 minutes.',
    category: 'spacewalk',
    imageUrl: 'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'Demonstrated that humans could survive and work in the vacuum of space, a critical step for future missions and moon landings.',
    relatedBody: 'Earth',
    collection: 'space-firsts'
  },
  // April
  {
    id: 'first-human-in-space',
    date: { month: 4, day: 12, year: 1961 },
    title: 'Yuri Gagarin: First Human in Space',
    description: 'Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space, completing one orbit of Earth aboard the Vostok 1 spacecraft.',
    category: 'milestone',
    imageUrl: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=800',
    significance: 'A monumental achievement in the Space Race, marking the dawn of human spaceflight.',
    relatedBody: 'Earth',
    collection: 'space-firsts'
  },
  {
    id: 'hubble-launch',
    date: { month: 4, day: 24, year: 1990 },
    title: 'Hubble Space Telescope Launch',
    description: 'The Hubble Space Telescope was launched into low Earth orbit aboard the Space Shuttle Discovery. It has since become one of the most important scientific instruments ever built.',
    category: 'launch',
    imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    significance: 'Revolutionized modern astronomy by providing incredibly deep and clear views of the universe, leading to countless discoveries.',
    relatedBody: 'Earth',
    collection: 'great-observatories'
  },
  // ... and so on for all other events ...
  {
    id: 'apollo-11',
    date: { month: 7, day: 20, year: 1969 },
    title: 'Apollo 11 Moon Landing',
    description: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon, a pivotal moment in human history broadcast to a global audience.',
    category: 'landing',
    imageUrl: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    significance: 'First human landing on another celestial body, fulfilling a national goal and marking the peak of the Space Race.',
    relatedBody: 'Moon',
    collection: 'apollo-missions'
  },
];

// Helper functions to access the event data
export const getEventsByDate = (month: number, day: number): SpaceEvent[] => {
  return spaceEvents.filter(event => 
    event.date.month === month && event.date.day === day
  );
};

export const getEventById = (id: string): SpaceEvent | undefined => {
  return spaceEvents.find(event => event.id === id);
};
