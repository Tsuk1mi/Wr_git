import { type NextRequest, NextResponse } from 'next/server';
import type { ClothingRecommendations, ActivityType } from '@/types';

// Функция для получения прогноза погоды на конкретную дату
async function getForecastWeather(cityId: string, date: string) {
  // Получаем прогноз на несколько дней
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/weather/forecast/${cityId}?days=7`);
  if (!response.ok) {
    throw new Error('Ошибка при получении прогноза погоды');
  }

  const forecastData = await response.json();

  // Находим данные для запрашиваемой даты
  const dayData = forecastData.find((day: any) => day.date === date);

  if (!dayData) {
    throw new Error('Данные для указанной даты не найдены');
  }

  return dayData;
}

// Функция для генерации рекомендаций на основе погодных данных и активности
function generateRecommendations(weatherData: any, activityType: ActivityType): ClothingRecommendations {
  const temperature = weatherData.temperature.air.C;
  const feelsLike = weatherData.temperature.comfort.C;
  const windSpeed = weatherData.wind?.speed || 0;
  const precipitationType = weatherData.precipitation?.type || 'none';
  const precipitationIntensity = weatherData.precipitation?.intensity || 0;
  const humidity = weatherData.humidity || 0;
  const uvIndex = weatherData.uv_index || 0;
  const isFog = weatherData.phenomena?.fog || false;

  // Массивы для рекомендаций
  let essential: string[] = [];
  let recommended: string[] = [];
  let accessories: string[] = [];
  let avoid: string[] = [];
  let weatherConditions: string[] = [];
  let temperatureRange = '';

  // Определяем температурный диапазон
  if (temperature < -20) {
    temperatureRange = 'extreme_cold';
    essential = ['Очень теплая зимняя куртка', 'Термобелье', 'Утепленные зимние ботинки'];
    recommended = ['Шерстяной свитер', 'Утепленные брюки', 'Теплые носки в несколько слоев'];
    accessories = ['Теплая шапка', 'Теплый шарф', 'Утепленные перчатки', 'Термос с горячим напитком'];
    avoid = ['Недостаточно теплая одежда', 'Оголенные участки кожи'];
  } else if (temperature < -10) {
    temperatureRange = 'freezing';
    essential = ['Теплая зимняя куртка', 'Термобелье', 'Зимние ботинки'];
    recommended = ['Шерстяной свитер', 'Утепленные брюки', 'Теплые носки'];
    accessories = ['Шапка', 'Шарф', 'Теплые перчатки', 'Термос с горячим напитком'];
    avoid = ['Легкая одежда', 'Обтягивающая одежда', 'Длительное пребывание на морозе'];
  } else if (temperature < 0) {
    temperatureRange = 'very_cold';
    essential = ['Зимняя куртка', 'Теплый свитер', 'Зимняя обувь'];
    recommended = ['Термобелье', 'Шерстяные носки', 'Теплые брюки'];
    accessories = ['Шапка', 'Шарф', 'Перчатки'];
    avoid = ['Тонкая одежда', 'Обувь без утепления'];
  } else if (temperature < 10) {
    temperatureRange = 'cold';
    essential = ['Демисезонная куртка', 'Свитер или кофта', 'Джинсы или брюки'];
    recommended = ['Теплая рубашка', 'Ботинки', 'Кофта с длинным рукавом'];
    accessories = ['Шапка', 'Легкий шарф', 'Перчатки при ветре'];
    avoid = ['Легкая летняя одежда', 'Сандалии и открытая обувь'];
  } else if (temperature < 15) {
    temperatureRange = 'cool';
    essential = ['Легкая куртка или ветровка', 'Джемпер или толстовка', 'Джинсы или брюки'];
    recommended = ['Рубашка с длинным рукавом', 'Кеды или ботинки'];
    accessories = ['Легкий шарф при ветре', 'Зонт при дожде'];
    avoid = ['Слишком теплая одежда', 'Летняя открытая обувь'];
  } else if (temperature < 20) {
    temperatureRange = 'mild';
    essential = ['Легкая куртка или кардиган', 'Джинсы или брюки', 'Футболка'];
    recommended = ['Рубашка', 'Кеды или лоферы', 'Толстовка'];
    accessories = ['Зонт при дожде', 'Легкий шарф при ветре'];
    avoid = ['Зимняя одежда', 'Слишком открытая одежда в ветреную погоду'];
  } else if (temperature < 25) {
    temperatureRange = 'warm';
    essential = ['Футболка или рубашка', 'Легкие брюки или джинсы', 'Кеды или мокасины'];
    recommended = ['Легкая рубашка', 'Шорты', 'Летнее платье'];
    accessories = ['Солнцезащитные очки', 'Головной убор', 'Бутылка воды'];
    avoid = ['Тяжелая одежда', 'Темные цвета при ярком солнце'];
  } else if (temperature < 30) {
    temperatureRange = 'hot';
    essential = ['Легкая футболка', 'Шорты или легкие брюки', 'Сандалии или легкая обувь'];
    recommended = ['Легкое платье', 'Рубашка из натуральных тканей', 'Бермуды'];
    accessories = ['Солнцезащитные очки', 'Панама или кепка', 'Бутылка воды', 'Солнцезащитный крем'];
    avoid = ['Синтетическая одежда', 'Темные цвета', 'Тяжелая обувь'];
  } else {
    temperatureRange = 'very_hot';
    essential = ['Очень легкая одежда из натуральных тканей', 'Шорты', 'Сандалии'];
    recommended = ['Льняная рубашка', 'Купальник', 'Легкое платье'];
    accessories = ['Солнцезащитные очки', 'Шляпа с широкими полями', 'Бутылка воды', 'Солнцезащитный крем'];
    avoid = ['Синтетическая одежда', 'Темные цвета', 'Многослойные комплекты'];
  }

  // Учет погодных условий
  if (precipitationType === 'rain') {
    weatherConditions.push('rain');
    if (precipitationIntensity > 2) {
      accessories.push('Водонепроницаемая куртка');
      accessories.push('Резиновые сапоги');
      recommended.push('Водоотталкивающая обувь');
    } else {
      accessories.push('Зонт');
      recommended.push('Водоотталкивающая обувь или ботинки');
    }
    avoid.push('Обувь из замши или ткани');
  }

  if (precipitationType === 'snow') {
    weatherConditions.push('snow');
    accessories.push('Водонепроницаемая обувь');
    recommended.push('Водоотталкивающая верхняя одежда');
    avoid.push('Обувь на гладкой подошве (скользкая)');
  }

  if (windSpeed > 5) {
    weatherConditions.push('strong_wind');
    recommended.push('Ветрозащитная куртка');
    avoid.push('Свободная широкая одежда');
    if (temperature < 10) {
      accessories.push('Защита для лица от ветра');
      avoid.push('Тонкая одежда без ветрозащиты');
    }
  }

  if (humidity > 80) {
    weatherConditions.push('high_humidity');
    recommended.push('Дышащая одежда из натуральных материалов');
    avoid.push('Плотная синтетическая одежда');
  }

  if (uvIndex > 6) {
    weatherConditions.push('high_uv');
    accessories.push('Солнцезащитный крем с высоким SPF');
    accessories.push('Солнцезащитные очки');
    recommended.push('Одежда, закрывающая плечи и спину');
    avoid.push('Длительное пребывание на солнце без защиты');
  }

  if (isFog) {
    weatherConditions.push('fog');
    if (activityType === 'sport' || activityType === 'walk') {
      accessories.push('Одежда со светоотражающими элементами');
    }
  }

  // Адаптируем рекомендации в зависимости от активности
  if (activityType === 'sport') {
    essential = essential.map(item => {
      if (item.includes('куртка')) return 'Спортивная куртка';
      if (item.includes('брюки')) return 'Спортивные брюки';
      return item;
    });
    recommended.push('Дышащая спортивная футболка');
    recommended.push('Кроссовки с хорошей амортизацией');
    accessories.push('Спортивный головной убор');
    accessories.push('Бутылка воды');
    avoid.push('Тяжелая непрактичная одежда');
    avoid.push('Обувь без амортизации');
  } else if (activityType === 'walk') {
    recommended.push('Деловая рубашка');
    recommended.push('Классические брюки');
    recommended.push('Формальная обувь');
    if (temperature > 25) {
      recommended.push('Легкий пиджак или блейзер');
      avoid.push('Слишком теплые костюмы');
    } else if (temperature < 10) {
      recommended.push('Деловое пальто');
    }
  } else if (activityType === 'leisure') {
    recommended.push('Удобная повседневная одежда');
    recommended.push('Комфортная обувь');
    accessories.push('Бутылка воды');
    if (temperature > 20) {
      accessories.push('Солнцезащитные очки');
    }
  }

  // Удаляем дубликаты
  essential = [...new Set(essential)];
  recommended = [...new Set(recommended)];
  accessories = [...new Set(accessories)];
  avoid = [...new Set(avoid)];
  weatherConditions = [...new Set(weatherConditions)];

  return {
    essential,
    recommended,
    accessories,
    avoid,
    temperature: {
      actual: temperature,
      feels_like: feelsLike,
      range: temperatureRange,
    },
    weather_conditions: weatherConditions,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { cityId: string } }
) {
  const cityId = params.cityId;
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const activityType = (searchParams.get('activity_type') || 'walk') as ActivityType;

  if (!date) {
    return NextResponse.json({ error: 'Необходимо указать дату' }, { status: 400 });
  }

  try {
    // Получаем прогноз погоды на указанную дату
    const weatherData = await getForecastWeather(cityId, date);

    // Генерируем рекомендации на основе погодных данных
    const recommendations = generateRecommendations(weatherData, activityType);

    // Формируем ответ
    return NextResponse.json({
      weather: weatherData,
      recommendations,
      date
    });
  } catch (error) {
    console.error('Error getting forecast recommendations:', error);
    return NextResponse.json({ error: 'Ошибка при получении рекомендаций для прогноза' }, { status: 500 });
  }
}
