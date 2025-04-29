import { type NextRequest, NextResponse } from 'next/server';
import type { WeatherData } from '@/types';

// OpenWeatherMap API ключ
const API_KEY = process.env.OPENWEATHER_API_KEY || 'f34e61eb7108bf62fb3ed7e7e9a37aaa'; // Используем публичный API ключ для тестирования

export async function GET(
  request: NextRequest,
  { params }: { params: { cityId: string } }
) {
  const cityId = params.cityId;

  try {
    // Запрос текущей погоды из OpenWeatherMap API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=ru`
    );

    if (!weatherResponse.ok) {
      throw new Error(`OpenWeatherMap API вернул статус: ${weatherResponse.status}`);
    }

    const openWeatherData = await weatherResponse.json();

    // Преобразуем данные из OpenWeatherMap API в наш формат
    const weatherData: WeatherData = {
      temperature: {
        air: {
          C: Math.round(openWeatherData.main.temp),
          F: Math.round((openWeatherData.main.temp * 9/5) + 32),
        },
        comfort: {
          C: Math.round(openWeatherData.main.feels_like),
          F: Math.round((openWeatherData.main.feels_like * 9/5) + 32),
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
      uv_index: 3, // OpenWeatherMap базовый API не предоставляет УФ-индекс
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

    // В случае ошибки, возвращаем мок данных с сообщением об ошибке
    const mockWeatherData: WeatherData = {
      temperature: {
        air: {
          C: 15,
          F: 59,
        },
        comfort: {
          C: 13,
          F: 55,
        },
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

// Вспомогательные функции для преобразования данных

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

function getCloudiness(cloudPercent: number): number {
  return cloudPercent;
}
