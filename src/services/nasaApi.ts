const NASA_API_KEY = 'YOUR_NASA_API_KEY_HERE';
const NASA_BASE_URL = 'https://api.nasa.gov';

export interface NASAImageResult {
  collection: {
    items: Array<{
      data: Array<{
        title: string;
        description: string;
        date_created: string;
        nasa_id: string;
        keywords?: string[];
      }>;
      links?: Array<{
        href: string;
        rel: string;
      }>;
    }>;
  };
}

export interface APODResult {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: string;
  hdurl?: string;
}

export interface NEOResult {
  near_earth_objects: {
    [date: string]: Array<{
      id: string;
      name: string;
      estimated_diameter: {
        meters: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
      };
      close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
          kilometers_per_hour: string;
        };
        miss_distance: {
          kilometers: string;
        };
      }>;
    }>;
  };
}

export class NASAService {
  static async searchImages(query: string, limit: number = 10): Promise<NASAImageResult> {
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${limit}`
      );
      return await response.json();
    } catch (error) {
      console.error('NASA Images API error:', error);
      throw error;
    }
  }

  static async getAPOD(date?: string): Promise<APODResult> {
    try {
      const dateParam = date ? `&date=${date}` : '';
      const response = await fetch(
        `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`
      );
      return await response.json();
    } catch (error) {
      console.error('NASA APOD API error:', error);
      throw error;
    }
  }

  static async getNearEarthObjects(startDate: string, endDate: string): Promise<NEOResult> {
    try {
      const response = await fetch(
        `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('NASA NEO API error:', error);
      throw error;
    }
  }

  static async getHistoricalEvents(date: string): Promise<any> {
    try {
      // Using NASA's historical events or space history APIs
      const response = await fetch(
        `${NASA_BASE_URL}/planetary/earth/imagery?lon=-95.33&lat=29.78&date=${date}&api_key=${NASA_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('NASA Historical Events API error:', error);
      throw error;
    }
  }
}
