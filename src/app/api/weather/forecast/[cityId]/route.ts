import { type NextRequest, NextResponse } from 'next/server';
import type { WeatherData } from '@/types';

// OpenWeatherMap API ключ
const API_KEY = process.env.OPENWEATHER_API_KEY || 'f34e61eb7108bf62fb3ed7e7e9a37aaa'; // Используем публичный API ключ для тестирования

export async function GET(
  request: NextRequest,
  { params }: { params: { cityId: string } }
) {
  const cityId = params.cityId;
  const searchParams = request.nextUrl.searchParams;
  const days = Number.parseInt(searchParams.get('days') || '5', 10);

  try {
    // Запрос 5-дневного прогноза из OpenWeatherMap API (по 3 часа)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=ru`
    );

    if (!forecastResponse.ok) {
      throw new Error(`OpenWeatherMap API вернул статус: ${forecastResponse.status}`);
    }

    const openWeatherData = await forecastResponse.json();

    // Группируем данные по дням (до указанного количества дней)
    const dailyForecasts = groupForecastByDay(openWeatherData.list);
    const limitedForecasts = dailyForecasts.slice(0, days);

    // Преобразуем данные из OpenWeatherMap API в наш формат
    const forecastData: WeatherData[] = limitedForecasts.map(dayForecast => {
      // Используем прогноз на полдень (или ближайшее доступное время)
      const midDayForecast = dayForecast.find(item =>
        item.dt_txt.includes('12:00:00')
      ) || dayForecast[Math.floor(dayForecast.length / 2)];

      return {
        temperature: {
          air: {
            C: Math.round(midDayForecast.main.temp),
            F: Math.round((midDayForecast.main.temp * 9/5) + 32),
          },
          comfort: {
            C: Math.round(midDayForecast.main.feels_like),
            F: Math.round((midDayForecast.main.feels_like * 9/5) + 32),
          },
        },
        humidity: midDayForecast.main.humidity,
        precipitation: {
          type: getPrecipitationType(midDayForecast.weather[0].id),
          intensity: getPrecipitationIntensity(midDayForecast.weather[0].id),
        },
        wind: {
          speed: midDayForecast.wind.speed,
          direction: getWindDirection(midDayForecast.wind.deg),
        },
        pressure: {
          mm: Math.round(midDayForecast.main.pressure * 0.750062),
          hpa: midDayForecast.main.pressure,
        },
        uv_index: 3, // OpenWeatherMap базовый API не предоставляет УФ-индекс
        phenomena: {
          fog: midDayForecast.weather[0].id >= 700 && midDayForecast.weather[0].id < 800,
          thunder: midDayForecast.weather[0].id >= 200 && midDayForecast.weather[0].id < 300,
          cloudy: midDayForecast.clouds.all,
        },
        description: midDayForecast.weather[0].description,
        date: midDayForecast.dt_txt.split(' ')[0],
      };
    });

    return NextResponse.json(forecastData);
  } catch (error) {
    console.error('Ошибка при получении прогноза погоды:', error);

    // В случае ошибки, возвращаем мок данных прогноза
    const forecastData: WeatherData[] = [];

    for (let i = 0; i < days; i++) {
      // Генерируем дату (сегодня + i дней)
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      forecastData.push({
        temperature: {
          air: {
            C: 15 + i,
            F: 59 + i * 2,
          },
          comfort: {
            C: 13 + i,
            F: 55 + i * 2,
          },
        },
        humidity: 65,
        precipitation: {
          type: i % 3 === 0 ? 'rain' : 'none',
          intensity: i % 3 === 0 ? 1 : 0,
        },
        wind: {
          speed: 3.5,
          direction: 'северо-западный',
        },
        pressure: {
          mm: 750,
          hpa: 1000,
        },
        uv_index: 3,
        phenomena: {
          fog: false,
          thunder: false,
          cloudy: 50,
        },
        date: dateStr,
        description: 'Нет данных (использованы резервные)',
      });
    }

    return NextResponse.json(forecastData);
  }
}

// Вспомогательные функции

function groupForecastByDay(forecastList: any[]): any[][] {
  const days: { [key: string]: any[] } = {};

  forecastList.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) {
      days[date] = [];
    }
    days[date].push(item);
  });

  return Object.values(days);
}

function getPrecipitationType(weatherId: number): 'rain' | 'snow' | 'drizzle' | 'none' {
  if (weatherId >= 200 && weatherId < 600) {
    if (weatherId >= 300 && weatherId < 400) {
      return 'drizzle';
    } else if (weatherId >= 500 && weatherId < 600) {
      return 'rain';
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'snow';
    }
    return 'rain';
  }
  return 'none';
}

function getPrecipitationIntensity(weatherId: number): number {
  if (weatherId >= 500 && weatherId < 510) {
    const intensity = weatherId - 500;
    return Math.min(intensity / 2, 3); // Нормализуем до шкалы 0-3
  }
  if (weatherId >= 600 && weatherId < 610) {
    const intensity = weatherId - 600;
    return Math.min(intensity / 2, 3);
  }
  return 0;
}

function getWindDirection(degrees: number): string {
  const directions = [
    'северный', 'северо-восточный', 'восточный', 'юго-восточный',
    'южный', 'юго-западный', 'западный', 'северо-западный'
  ];
  return directions[Math.round(degrees / 45) % 8];
}
