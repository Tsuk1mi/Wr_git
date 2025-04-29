import { API_BASE_URL } from '@/config/constants';
import type {
  ActivityType,
  City,
  CurrentWeatherWithRecommendations,
  ForecastWithRecommendations,
  WeatherData
} from '@/types';

/**
 * Класс для работы с API
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Выполнить GET-запрос к API
   */
  private async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Добавить параметры запроса
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Поиск города по названию
   */
  async searchCity(query: string): Promise<City[]> {
    return this.get<City[]>('/weather/search', { query });
  }

  /**
   * Получить текущую погоду по ID города
   */
  async getCurrentWeather(cityId: number): Promise<WeatherData> {
    return this.get<WeatherData>(`/weather/current/${cityId}`);
  }

  /**
   * Получить текущую погоду по географическим координатам
   */
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    return this.get<WeatherData>(`/weather/current/coordinates`, {
      lat: lat.toString(),
      lon: lon.toString()
    });
  }

  /**
   * Получить прогноз погоды по ID города
   */
  async getWeatherForecast(cityId: number, days = 7): Promise<WeatherData[]> {
    return this.get<WeatherData[]>(`/weather/forecast/${cityId}`, { days: days.toString() });
  }

  /**
   * Получить рекомендации по одежде для текущей погоды
   */
  async getClothingRecommendations(
    cityId: number,
    activityType: ActivityType = 'walk'
  ): Promise<CurrentWeatherWithRecommendations> {
    return this.get<CurrentWeatherWithRecommendations>(
      `/recommendations/${cityId}`,
      { activity_type: activityType }
    );
  }

  /**
   * Получить рекомендации по одежде на основе прогноза погоды
   */
  async getForecastRecommendations(
    cityId: number,
    days = 3,
    activityType: ActivityType = 'walk'
  ): Promise<ForecastWithRecommendations> {
    return this.get<ForecastWithRecommendations>(
      `/recommendations/forecast/${cityId}`,
      {
        days: days.toString(),
        activity_type: activityType
      }
    );
  }
}

// Экспортируем экземпляр класса для использования в компонентах
const api = new ApiClient();
export default api;
