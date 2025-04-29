// Константы приложения

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Типы активности
export const ACTIVITY_TYPES = [
  { id: 'walk', name: 'Прогулка', icon: '🚶' },
  { id: 'sport', name: 'Спорт', icon: '🏃' },
  { id: 'work', name: 'Работа', icon: '💼' },
  { id: 'leisure', name: 'Отдых', icon: '🏖️' }
];

// Погодные иконки
export const WEATHER_ICONS = {
  'clear': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'overcast': '🌥️',
  'drizzle': '🌦️',
  'rain': '🌧️',
  'heavy-rain': '⛈️',
  'thunderstorm': '🌩️',
  'snow': '❄️',
  'heavy-snow': '🌨️',
  'fog': '🌫️',
  'freezing-rain': '🧊',
  'default': '🌈'
};

// Температурные диапазоны и их цвета
export const TEMPERATURE_RANGES = {
  'freezing': { minTemp: -100, maxTemp: -10, color: '#5B21B6', textColor: 'text-purple-900' },
  'very_cold': { minTemp: -10, maxTemp: 0, color: '#1E40AF', textColor: 'text-blue-900' },
  'cold': { minTemp: 0, maxTemp: 10, color: '#2563EB', textColor: 'text-blue-600' },
  'cool': { minTemp: 10, maxTemp: 15, color: '#93C5FD', textColor: 'text-blue-300' },
  'mild': { minTemp: 15, maxTemp: 20, color: '#A1A1AA', textColor: 'text-zinc-400' },
  'warm': { minTemp: 20, maxTemp: 25, color: '#FBBF24', textColor: 'text-yellow-400' },
  'hot': { minTemp: 25, maxTemp: 30, color: '#F59E0B', textColor: 'text-amber-500' },
  'very_hot': { minTemp: 30, maxTemp: 100, color: '#DC2626', textColor: 'text-red-600' }
};

// Популярные города
export const POPULAR_CITIES = [
  { id: 4368, name: 'Москва' },
  { id: 4079, name: 'Санкт-Петербург' },
  { id: 5295, name: 'Новосибирск' },
  { id: 4517, name: 'Екатеринбург' },
  { id: 5297, name: 'Казань' },
  { id: 4929, name: 'Нижний Новгород' },
  { id: 5309, name: 'Челябинск' },
  { id: 5039, name: 'Омск' },
  { id: 5344, name: 'Ростов-на-Дону' },
  { id: 4764, name: 'Уфа' }
];
