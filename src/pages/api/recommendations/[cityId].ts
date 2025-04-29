import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db/connect';
import ClothingRecommendation from '@/lib/db/models/ClothingRecommendation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  // Извлекаем параметры
  const { cityId } = req.query;
  const activityType = (req.query.activity_type as string) || 'walk';

  if (!cityId) {
    return res.status(400).json({ message: 'cityId обязателен' });
  }

  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    // Сначала получаем данные о погоде через прокси OpenWeather API
    const weatherResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weather/current/${cityId}`);

    if (!weatherResponse.ok) {
      throw new Error(`Ошибка получения данных о погоде: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // Определяем температуру для выбора рекомендаций
    const temperature = weatherData.temperature?.air?.C || 0;
    const feelsLike = weatherData.temperature?.comfort?.C || temperature;

    // Используем температуру "ощущается как" для рекомендаций
    const effectiveTemp = feelsLike;

    // Находим соответствующие рекомендации в базе данных
    // Ищем по температурному диапазону и типу активности
    let clothingRecommendation = await findRecommendationByTemperature(effectiveTemp, activityType);

    // Если ничего не найдено, используем рекомендации для прогулки
    if (!clothingRecommendation && activityType !== 'walk') {
      clothingRecommendation = await findRecommendationByTemperature(effectiveTemp, 'walk');
    }

    // Если все еще ничего не найдено, возвращаем ошибку
    if (!clothingRecommendation) {
      return res.status(404).json({
        message: 'Рекомендации не найдены для указанной температуры и типа активности'
      });
    }

    // Обрабатываем модификаторы погоды (дождь, снег, ветер и т.д.)
    const finalRecommendations = applyWeatherModifiers(
      clothingRecommendation.recommendations,
      clothingRecommendation.weatherModifiers || [],
      weatherData
    );

    // Формируем ответ
    const result = {
      weather: weatherData,
      recommendations: {
        ...finalRecommendations,
        temperature: {
          actual: temperature,
          feels_like: feelsLike,
          range: clothingRecommendation.tempRange.replace(/_/g, ' ')
        },
        weather_conditions: getWeatherConditions(weatherData),
        season: clothingRecommendation.season,
        tips: clothingRecommendation.tips || []
      }
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении рекомендаций:', error);
    return res.status(500).json({
      message: 'Ошибка при получении рекомендаций',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Функция для поиска рекомендаций по температуре
 */
async function findRecommendationByTemperature(temperature: number, activityType: string) {
  // Ищем рекомендации для данной температуры и типа активности
  const recommendationsByTemperature = await ClothingRecommendation.find({
    minTemp: { $lte: temperature },
    maxTemp: { $gt: temperature },
    activityType
  }).exec();

  // Если есть рекомендации, возвращаем первую
  if (recommendationsByTemperature.length > 0) {
    return recommendationsByTemperature[0];
  }

  // Проверяем, находимся ли мы в переходном сезоне (весна/осень)
  const month = new Date().getMonth() + 1; // JavaScript месяцы начинаются с 0

  // Весна (март-май)
  if (month >= 3 && month <= 5) {
    return ClothingRecommendation.findOne({
      tempRange: 'spring_transition',
      activityType
    }).exec();
  }

  // Осень (сентябрь-ноябрь)
  if (month >= 9 && month <= 11) {
    return ClothingRecommendation.findOne({
      tempRange: 'fall_transition',
      activityType
    }).exec();
  }

  // Если переходный сезон не определен, ищем ближайший температурный диапазон
  if (temperature < -25) {
    return ClothingRecommendation.findOne({
      tempRange: 'extreme_freezing',
      activityType
    }).exec();
  } else if (temperature >= 35) {
    return ClothingRecommendation.findOne({
      tempRange: 'extreme_hot',
      activityType
    }).exec();
  }

  return null;
}

/**
 * Функция для применения модификаторов погоды к рекомендациям
 */
function applyWeatherModifiers(
  baseRecommendations: any,
  weatherModifiers: any[],
  weatherData: any
) {
  const result = {
    essential: [...(baseRecommendations.essential || [])],
    recommended: [...(baseRecommendations.recommended || [])],
    accessories: [...(baseRecommendations.accessories || [])],
    avoid: [...(baseRecommendations.avoid || [])]
  };

  // Получаем текущие погодные условия
  const conditions = getWeatherConditions(weatherData);

  // Применяем модификаторы для текущих погодных условий
  for (const condition of conditions) {
    const modifier = weatherModifiers.find(m => m.condition === condition);

    if (modifier) {
      // Добавляем элементы "add" в аксессуары, если их еще нет в списке
      for (const item of modifier.add || []) {
        if (!result.essential.includes(item) &&
            !result.recommended.includes(item) &&
            !result.accessories.includes(item)) {
          result.accessories.push(item);
        }
      }

      // Добавляем элементы "avoid" в список того, что следует избегать
      for (const item of modifier.avoid || []) {
        if (!result.avoid.includes(item)) {
          result.avoid.push(item);
        }
      }
    }
  }

  return result;
}

/**
 * Функция для определения погодных условий
 */
function getWeatherConditions(weatherData: any): string[] {
  const conditions: string[] = [];

  // Проверяем осадки
  const precipitation = weatherData.precipitation || {};
  if (precipitation.type === 'rain') {
    if (precipitation.intensity > 5) {
      conditions.push('heavy_rain');
    } else if (precipitation.intensity > 0) {
      conditions.push('light_rain');
    }
    conditions.push('rain');
  } else if (precipitation.type === 'snow') {
    if (precipitation.intensity > 5) {
      conditions.push('heavy_snow');
    } else if (precipitation.intensity > 0) {
      conditions.push('light_snow');
    }
    conditions.push('snow');
  }

  // Проверяем ветер
  const wind = weatherData.wind || {};
  if (wind.speed > 8) {
    conditions.push('strong_wind');
  }

  // Проверяем другие явления
  const phenomena = weatherData.phenomena || {};
  if (phenomena.fog) {
    conditions.push('fog');
  }
  if (phenomena.thunder) {
    conditions.push('thunderstorm');
  }

  // Проверяем влажность
  if (weatherData.humidity > 80) {
    conditions.push('high_humidity');
  }

  // Проверяем УФ-индекс
  if (weatherData.uv_index > 5) {
    conditions.push('high_uv');
  }

  // Если резкие колебания температуры в течение дня
  if (weatherData.daily_temp_range && weatherData.daily_temp_range > 10) {
    conditions.push('variable');
  }

  return conditions;
}
