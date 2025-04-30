import { type NextRequest, NextResponse } from 'next/server';
import { POPULAR_CITIES } from '@/config/constants';
import type { City } from '@/types';

const CITY_DATABASE: City[] = [
  { id: 524901, name: 'Москва', region: 'Московская область' },
  { id: 4079, name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: 5295, name: 'Новосибирск', region: 'Новосибирская область' },
  { id: 4517, name: 'Екатеринбург', region: 'Свердловская область' },
  { id: 5297, name: 'Казань', region: 'Республика Татарстан' },
  { id: 4929, name: 'Нижний Новгород', region: 'Нижегородская область' },
  { id: 5309, name: 'Челябинск', region: 'Челябинская область' },
  { id: 5039, name: 'Омск', region: 'Омская область' },
  { id: 5344, name: 'Ростов-на-Дону', region: 'Ростовская область' },
  { id: 4764, name: 'Уфа', region: 'Республика Башкортостан' },
  { id: 5110, name: 'Пермь', region: 'Пермский край' },
  { id: 5398, name: 'Самара', region: 'Самарская область' },
  { id: 5720, name: 'Краснодар', region: 'Краснодарский край' },
  { id: 5475, name: 'Волгоград', region: 'Волгоградская область' },
  { id: 5422, name: 'Саратов', region: 'Саратовская область' },
  { id: 5539, name: 'Тюмень', region: 'Тюменская область' },
  { id: 5255, name: 'Красноярск', region: 'Красноярский край' },
  { id: 5626, name: 'Воронеж', region: 'Воронежская область' },
  { id: 5331, name: 'Ярославль', region: 'Ярославская область' },
  { id: 5012, name: 'Владивосток', region: 'Приморский край' },
  { id: 4907, name: 'Хабаровск', region: 'Хабаровский край' },
  { id: 5193, name: 'Иркутск', region: 'Иркутская область' },
  { id: 5174, name: 'Ижевск', region: 'Удмуртская Республика' },
  { id: 5002, name: 'Барнаул', region: 'Алтайский край' },
  { id: 5652, name: 'Астрахань', region: 'Астраханская область' },
  { id: 5074, name: 'Севастополь', region: 'Крым' },
  { id: 5084, name: 'Симферополь', region: 'Крым' },
  { id: 5034, name: 'Сочи', region: 'Краснодарский край' },
  { id: 5557, name: 'Калининград', region: 'Калининградская область' },
];

// Получаем API ключ OpenWeatherMap
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';

  if (!query.trim()) {
    return NextResponse.json(POPULAR_CITIES);
  }

  // Приводим запрос к нижнему регистру для поиска
  const queryLower = query.toLowerCase();

  // Пробуем найти город через OpenWeatherMap API
  try {
    // Формируем URL для запроса
    const weatherResponse = await fetch(`${BASE_URL}?q=${query}&appid=${API_KEY}&lang=ru`);

    if (!weatherResponse.ok) {
      throw new Error('Ошибка получения данных с OpenWeatherMap');
    }

    // Парсим ответ
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      throw new Error(`Город не найден: ${weatherData.message}`);
    }

    // Возвращаем данные о городе
    const city = {
      id: weatherData.id,
      name: weatherData.name,
      region: weatherData.sys.country, // можно дополнительно уточнить регион
      weather: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
      // Можно добавить дополнительные данные, такие как влажность, скорость ветра и т.д.
    };

    return NextResponse.json(city);
  } catch (error) {
    console.error('Ошибка при получении данных с OpenWeatherMap:', error);

    // Если ошибка, возвращаем города из локальной базы данных
    const results = CITY_DATABASE.filter(city =>
        city.name.toLowerCase().includes(queryLower) ||
        (city.region && city.region.toLowerCase().includes(queryLower))
    ).slice(0, 10); // Ограничиваем результаты

    return NextResponse.json(results);
  }
}
