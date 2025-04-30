import { type NextRequest, NextResponse } from 'next/server';
import type { WeatherData } from '@/types';

export const dynamic = 'force-dynamic'; // ✅ разрешает использовать асинхронные параметры

const API_KEY = process.env.OPENWEATHER_API_KEY || 'c4b2992878138ac1210bc925ac188097';

export async function GET(request: NextRequest, context: { params: { cityId: string } }) {
  const params = await context.params;
  const { cityId } = await context.params;




  try {
    const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=ru`
    );

    if (!weatherResponse.ok) {
      throw new Error(`OpenWeatherMap API вернул статус: ${weatherResponse.status}`);
    }

    const openWeatherData = await weatherResponse.json();

    const weatherData: WeatherData = {
      temperature: {
        air: {
          C: Math.round(openWeatherData.main.temp),
          F: Math.round((openWeatherData.main.temp * 9) / 5 + 32),
        },
        comfort: {
          C: Math.round(openWeatherData.main.feels_like),
          F: Math.round((openWeatherData.main.feels_like * 9) / 5 + 32),
        },
      },
      humidity: openWeatherData.main.humidity,
      precipitation: {
        type: getPrecipitationType(openWeatherData.weather[0].id),
        intensity: getPrecipitationIntensity(openWeatherData.weather[0].id),
      },
      wind: {
        speed: openWeatherData.wind.speed,
        direction: getWindDirection(openWeatherData.wind.deg),
      },
      pressure: {
        mm: Math.round(openWeatherData.main.pressure * 0.750062),
        hpa: openWeatherData.main.pressure,
      },
      uv_index: 3,
      phenomena: {
        fog: openWeatherData.weather[0].id >= 700 && openWeatherData.weather[0].id < 800,
        thunder: openWeatherData.weather[0].id >= 200 && openWeatherData.weather[0].id < 300,
        cloudy: getCloudiness(openWeatherData.clouds.all),
      },
      description: openWeatherData.weather[0].description,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Ошибка при получении данных о погоде:', error);

    const mockWeatherData: WeatherData = {
      temperature: {
        air: { C: 15, F: 59 },
        comfort: { C: 13, F: 55 },
      },
      humidity: 65,
      precipitation: {
        type: 'none',
        intensity: 0,
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
      description: 'Ошибка получения данных, используется резервный прогноз',
    };

    return NextResponse.json(mockWeatherData);
  }
}

// Вспомогательные функции

function getPrecipitationType(weatherId: number): 'rain' | 'snow' | 'drizzle' | 'none' {
  if (weatherId >= 300 && weatherId < 400) return 'drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  return 'none';
}

function getPrecipitationIntensity(weatherId: number): number {
  if (weatherId >= 500 && weatherId < 510) return Math.min((weatherId - 500) / 2, 3);
  if (weatherId >= 600 && weatherId < 610) return Math.min((weatherId - 600) / 2, 3);
  return 0;
}

function getWindDirection(degrees: number): string {
  const directions = [
    'северный', 'северо-восточный', 'восточный', 'юго-восточный',
    'южный', 'юго-западный', 'западный', 'северо-западный'
  ];
  return directions[Math.round(degrees / 45) % 8];
}

function getCloudiness(cloudPercent: number): number {
  return cloudPercent;
}
