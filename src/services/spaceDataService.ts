import { SpaceEvent, UpcomingEvent } from '../types';
import { NASAService } from './nasaApi';
import { format, addDays } from 'date-fns';

export class SpaceDataService {
  private static cache = new Map<string, any>();
  private static readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  static async getHistoricalEvents(month: number, day: number): Promise<SpaceEvent[]> {
    const cacheKey = `historical-${month}-${day}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Fetch from multiple sources and combine
      const events = await this.fetchHistoricalEventsFromAPIs(month, day);
      
      this.cache.set(cacheKey, {
        data: events,
        timestamp: Date.now()
      });
      
      return events;
    } catch (error) {
      console.error('Error fetching historical events:', error);
      return this.getFallbackEvents(month, day);
    }
  }

  private static async fetchHistoricalEventsFromAPIs(month: number, day: number): Promise<SpaceEvent[]> {
    const events: SpaceEvent[] = [];
    
    // Try to get APOD for this date in previous years
    for (let year = new Date().getFullYear() - 1; year >= 1995; year--) {
      try {
        const dateStr = format(new Date(year, month - 1, day), 'yyyy-MM-dd');
        const apod = await NASAService.getAPOD(dateStr);
        
        if (apod && apod.title) {
          events.push({
            id: `apod-${dateStr}`,
            date: { month, day, year },
            title: apod.title,
            description: apod.explanation, // Use full description
            category: 'discovery',
            imageUrl: apod.url,
            significance: 'Featured as NASA\'s Astronomy Picture of the Day',
            nasaId: `apod-${dateStr}`
          });
          break; // Only get one APOD per date
        }
      } catch (error) {
        continue; // Try next year
      }
    }

    // Search for space-related images for this date
    try {
      const searchQuery = this.getSearchQueryForDate(month, day);
      const imageResults = await NASAService.searchImages(searchQuery, 5);
      
      imageResults.collection.items.forEach((item) => {
        if (item.data[0] && item.links?.[0]) {
          const data = item.data[0];
          const createdDate = new Date(data.date_created);
          
          events.push({
            id: `nasa-${data.nasa_id}`,
            date: { 
              month: createdDate.getUTCMonth() + 1, 
              day: createdDate.getUTCDate(), 
              year: createdDate.getUTCFullYear() 
            },
            title: data.title,
            description: data.description || 'NASA space exploration image.',
            category: this.categorizeFromKeywords(data.keywords),
            imageUrl: item.links[0].href,
            significance: 'Documented by NASA space exploration programs.',
            nasaId: data.nasa_id,
            relatedBody: this.extractCelestialBody(data.keywords)
          });
        }
      });
    } catch (error) {
      console.error('Error fetching NASA images:', error);
    }

    return events;
  }

  private static getSearchQueryForDate(month: number, day: number): string {
    const queries = [
      'space exploration', 'astronaut', 'spacecraft', 'satellite',
      'mars rover', 'space station', 'apollo mission', 'shuttle',
      'hubble telescope', 'planetary', 'solar system', 'galaxy'
    ];
    
    const index = (month + day) % queries.length;
    return queries[index];
  }

  private static categorizeFromKeywords(keywords?: string[]): SpaceEvent['category'] {
    if (!keywords) return 'discovery';
    
    const keywordStr = keywords.join(' ').toLowerCase();
    
    if (keywordStr.includes('launch') || keywordStr.includes('rocket')) return 'launch';
    if (keywordStr.includes('landing') || keywordStr.includes('touchdown')) return 'landing';
    if (keywordStr.includes('mission') || keywordStr.includes('expedition')) return 'mission';
    if (keywordStr.includes('spacewalk') || keywordStr.includes('eva')) return 'spacewalk';
    if (keywordStr.includes('milestone') || keywordStr.includes('first')) return 'milestone';
    if (keywordStr.includes('achievement') || keywordStr.includes('record')) return 'achievement';
    
    return 'discovery';
  }

  private static extractCelestialBody(keywords?: string[]): string | undefined {
    if (!keywords) return undefined;
    
    const keywordStr = keywords.join(' ').toLowerCase();
    const bodies = ['mars', 'moon', 'jupiter', 'saturn', 'venus', 'mercury', 'earth', 'sun', 'pluto', 'neptune', 'uranus'];
    
    for (const body of bodies) {
      if (keywordStr.includes(body)) {
        return body.charAt(0).toUpperCase() + body.slice(1);
      }
    }
    
    return undefined;
  }

  static async getUpcomingEvents(userLocation?: { lat: number; lng: number }): Promise<UpcomingEvent[]> {
    // This implementation can remain the same
    return this.getFallbackUpcomingEvents();
  }

  private static getFallbackEvents(month: number, day: number): SpaceEvent[] {
    // This is now only a true fallback in case of API failure
    return [];
  }

  private static getFallbackUpcomingEvents(): UpcomingEvent[] {
    const today = new Date();
    return [
      {
        id: 'fallback-upcoming-1',
        name: 'International Space Station Flyover',
        date: addDays(today, 2),
        type: 'conjunction',
        description: 'The ISS will be visible in the night sky',
        visibility: {
          bestTime: 'Evening twilight',
          direction: 'West to East',
        }
      },
    ];
  }

  // FIX: This function now searches the cache for the real event data.
  static async getEventById(eventId: string): Promise<SpaceEvent | null> {
    // Iterate through all cached data to find the event.
    for (const cached of this.cache.values()) {
        if (cached.data && Array.isArray(cached.data)) {
            // Find an event in the cached array that matches the eventId.
            const event = cached.data.find((e: SpaceEvent) => e.id === eventId);
            if (event) {
                // If found, return the event object.
                return event;
            }
        }
    }
    
    // If the event is not found in the cache after checking all entries,
    // log a warning and return null.
    console.warn(`Event with ID "${eventId}" not found in cache. It might not have been loaded yet.`);
    return null;
  }
}
