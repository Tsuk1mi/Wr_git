// Типы города
export interface City {
  id: number;
  name: string;
  region?: string;
}

// Типы активностей
export type ActivityType = 'walk' | 'sport' | 'work' | 'leisure';

// Типы для данных о погоде
export interface Temperature {
  air: {
    C: number;
    F: number;
  };
  comfort: {
    C: number;
    F: number;
  };
}

export interface Precipitation {
  type: 'rain' | 'snow' | 'drizzle' | 'none';
  intensity: number;
}

export interface Wind {
  speed: number;
  direction: string;
}

export interface Pressure {
  mm: number;
  hpa: number;
}

export interface Phenomena {
  fog: boolean;
  thunder: boolean;
  cloudy: number; // процент облачности (0-100)
}

export interface WeatherData {
  temperature: Temperature;
  humidity: number;
  precipitation: Precipitation;
  wind: Wind;
  pressure: Pressure;
  uv_index: number;
  phenomena: Phenomena;
  description: string;
  date?: string; // только для прогноза
}

// Типы для рекомендаций по одежде
export interface ClothingRecommendations {
  essential: string[]; // необходимые вещи
  recommended: string[]; // рекомендуемые вещи
  accessories: string[]; // аксессуары
  avoid: string[]; // что избегать
  temperature: {
    actual: number;
    feels_like: number;
    range: string;
  };
  weather_conditions: string[];
}

// Типы для ответов API
export interface CurrentWeatherWithRecommendations {
  weather: WeatherData;
  recommendations: ClothingRecommendations;
}

export interface ForecastRecommendation {
  date: string;
  weather: WeatherData;
  recommendations: ClothingRecommendations;
}

export interface ForecastWithRecommendations {
  city_id: number;
  activity_type: ActivityType;
  daily_recommendations: ForecastRecommendation[];
}

// Типы для ответов API поиска
export interface SearchResponse {
  results: City[];
}
