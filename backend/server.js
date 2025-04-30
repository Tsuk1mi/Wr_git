// eslint-disable-next-line @typescript-eslint/no-require-imports
const fastify = require('fastify')({ logger: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { exec } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fetch = require('node-fetch');

// Регистрируем CORS для взаимодействия с фронтендом
// eslint-disable-next-line @typescript-eslint/no-require-imports
fastify.register(require('@fastify/cors'), {
  origin: '*'
});

// Типы активностей
const ACTIVITY_TYPES = ['walk', 'sport', 'work', 'leisure'];

// Температурные диапазоны и соответствующие рекомендации
const TEMP_RANGES = {
  "freezing": [-100, -10],  // Экстремально холодно
  "very_cold": [-10, 0],    // Очень холодно
  "cold": [0, 10],          // Холодно
  "cool": [10, 15],         // Прохладно
  "mild": [15, 20],         // Умеренно
  "warm": [20, 25],         // Тепло
  "hot": [25, 30],          // Жарко
  "very_hot": [30, 100]     // Очень жарко
};

// База данных одежды по температурным диапазонам и типам активности
const CLOTHING_DB = {
  "freezing": {
    "walk": {
      "essential": ["теплый пуховик", "шапка-ушанка", "теплый шарф", "термобелье", "толстые варежки", "утепленные ботинки"],
      "recommended": ["термоноски", "утепленные штаны", "многослойная одежда", "защита для лица"],
      "accessories": ["грелки для рук", "термос с горячим напитком"]
    },
    "sport": {
      "essential": ["специальная термоодежда", "термобелье", "утепленные спортивные штаны", "теплая шапка", "теплые перчатки"],
      "recommended": ["шарф или бафф", "спортивная ветрозащитная куртка", "термоноски"],
      "accessories": ["теплый напиток в термосе"]
    },
    "work": {
      "essential": ["теплый пуховик", "шапка", "шарф", "перчатки", "теплая обувь", "термобелье"],
      "recommended": ["теплые брюки", "вязаный свитер", "утепленный жилет"],
      "accessories": ["термос с горячим напитком", "запасные теплые носки"]
    },
    "leisure": {
      "essential": ["теплая верхняя одежда", "шапка", "шарф", "перчатки", "теплая обувь"],
      "recommended": ["теплый свитер", "теплые носки", "термобелье"],
      "accessories": ["плед"]
    }
  },
  "very_cold": {
    "walk": {
      "essential": ["теплая куртка", "шапка", "шарф", "перчатки", "теплые ботинки"],
      "recommended": ["слои одежды", "термоноски"],
      "accessories": ["грелки для рук"]
    },
    "sport": {
      "essential": ["термобелье", "спортивная куртка", "шапка", "перчатки"],
      "recommended": ["бафф", "термоноски"],
      "accessories": []
    },
    "work": {
      "essential": ["теплая куртка", "шапка", "шарф", "перчатки", "теплая обувь"],
      "recommended": ["утепленные брюки", "свитер"],
      "accessories": ["термос с горячим напитком"]
    },
    "leisure": {
      "essential": ["теплая куртка", "шапка", "шарф", "перчатки"],
      "recommended": ["слои одежды", "теплые носки"],
      "accessories": []
    }
  },
  "cold": {
    "walk": {
      "essential": ["куртка", "шапка", "шарф", "перчатки"],
      "recommended": ["слои одежды"],
      "accessories": []
    },
    "sport": {
      "essential": ["спортивная куртка", "шапка"],
      "recommended": ["бафф"],
      "accessories": []
    },
    "work": {
      "essential": ["куртка", "шапка", "перчатки"],
      "recommended": ["свитер"],
      "accessories": []
    },
    "leisure": {
      "essential": ["куртка", "шапка"],
      "recommended": ["слои одежды"],
      "accessories": []
    }
  },
  "cool": {
    "walk": {
      "essential": ["легкая куртка"],
      "recommended": ["шарф"],
      "accessories": []
    },
    "sport": {
      "essential": ["спортивная одежда"],
      "recommended": [],
      "accessories": []
    },
    "work": {
      "essential": ["пиджак", "рубашка"],
      "recommended": [],
      "accessories": []
    },
    "leisure": {
      "essential": ["лёгкая куртка"],
      "recommended": [],
      "accessories": []
    }
  },
  "mild": {
    "walk": {
      "essential": ["футболка", "лёгкая кофта"],
      "recommended": [],
      "accessories": []
    },
    "sport": {
      "essential": ["спортивная одежда"],
      "recommended": [],
      "accessories": []
    },
    "work": {
      "essential": ["рубашка"],
      "recommended": [],
      "accessories": []
    },
    "leisure": {
      "essential": ["футболка"],
      "recommended": [],
      "accessories": []
    }
  },
  "warm": {
    "walk": {
      "essential": ["футболка", "шорты"],
      "recommended": ["головной убор"],
      "accessories": ["солнцезащитные очки"]
    },
    "sport": {
      "essential": ["спортивная одежда"],
      "recommended": ["головной убор"],
      "accessories": ["солнцезащитные очки"]
    },
    "work": {
      "essential": ["легкая рубашка"],
      "recommended": [],
      "accessories": []
    },
    "leisure": {
      "essential": ["футболка", "шорты"],
      "recommended": ["головной убор"],
      "accessories": ["солнцезащитные очки"]
    }
  },
  "hot": {
    "walk": {
      "essential": ["майка", "шорты"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["солнцезащитные очки", "бутылка воды"]
    },
    "sport": {
      "essential": ["спортивная одежда"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["бутылка воды"]
    },
    "work": {
      "essential": ["легкая рубашка"],
      "recommended": ["головной убор"],
      "accessories": []
    },
    "leisure": {
      "essential": ["майка", "шорты"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["бутылка воды"]
    }
  },
  "very_hot": {
    "walk": {
      "essential": ["майка", "шорты", "сандалии"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["солнцезащитные очки", "бутылка воды"]
    },
    "sport": {
      "essential": ["очень легкая спортивная одежда"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["бутылка воды"]
    },
    "work": {
      "essential": ["легкая рубашка", "светлые брюки"],
      "recommended": ["головной убор"],
      "accessories": []
    },
    "leisure": {
      "essential": ["майка", "шорты", "сандалии"],
      "recommended": ["головной убор", "солнцезащитный крем"],
      "accessories": ["бутылка воды"]
    }
  }
};

// Модификаторы для различных погодных условий
const WEATHER_MODIFIERS = {
  "rain": {
    "add": ["зонт", "водонепроницаемая куртка/плащ", "водонепроницаемая обувь"],
    "avoid": ["замшевая обувь", "одежда, которая долго сохнет"]
  },
  "strong_wind": {
    "add": ["ветрозащитная куртка", "плотная одежда", "шарф"],
    "avoid": ["свободная одежда", "широкополые шляпы"]
  },
  "snow": {
    "add": ["водонепроницаемая обувь", "теплая куртка", "перчатки", "шапка"],
    "avoid": ["тонкая обувь", "одежда без защиты от влаги"]
  },
  "fog": {
    "add": ["яркая одежда/аксессуары для видимости", "теплый шарф"],
    "avoid": []
  },
  "high_humidity": {
    "add": ["легкая одежда из натуральных тканей"],
    "avoid": ["синтетические ткани", "многослойная одежда"]
  },
  "high_uv": {
    "add": ["головной убор", "солнцезащитные очки", "солнцезащитный крем", "одежда с УФ-защитой"],
    "avoid": ["открытая одежда без защиты"]
  }
};

// Регистрируем маршрут для проверки работоспособности сервера
fastify.get('/', async (request, reply) => {
  return { message: 'Добро пожаловать в API Weather & Clothing!' };
});

// Проксируем запросы к API OpenWeather
fastify.get('/weather/search', async (request, reply) => {
  const query = request.query.query;
  const apiKey = 'c4b2992878138ac1210bc925ac188097';

  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Адаптируем данные
    const adaptedData = data.map(city => ({
      id: `lat${city.lat}_lon${city.lon}`,
      name: city.name,
      country: city.country,
      region: city.state || '',
      latitude: city.lat,
      longitude: city.lon
    }));

    return adaptedData;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Маршрут для получения текущей погоды по координатам
fastify.get('/weather', async (request, reply) => {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const apiKey = 'c4b2992878138ac1210bc925ac188097';

  if (!lat || !lon) {
    return reply.code(400).send({ error: 'Требуются параметры lat и lon' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ru&units=metric`
    );

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Адаптируем данные
    const main = data.main || {};
    const wind = data.wind || {};
    const weather = data.weather && data.weather.length > 0 ? data.weather[0] : {};
    const clouds = data.clouds || {};
    const rain = data.rain || {};
    const snow = data.snow || {};

    const adaptedData = {
      name: data.name || `Место (${lat}, ${lon})`,
      temperature: {
        air: {
          C: main.temp || 0
        },
        comfort: {
          C: main.feels_like || 0
        }
      },
      humidity: main.humidity || 0,
      precipitation: {
        type: rain['1h'] > 0 ? 'rain' : snow['1h'] > 0 ? 'snow' : 'none',
        intensity: rain['1h'] || snow['1h'] || 0
      },
      wind: {
        speed: wind.speed || 0,
        direction: getWindDirection(wind.deg || 0)
      },
      pressure: {
        mm: Math.round((main.pressure || 0) * 0.750062 * 10) / 10,
        hpa: main.pressure || 0
      },
      phenomena: {
        fog: weather.id === 741,
        thunder: weather.id >= 200 && weather.id < 300,
        cloudy: clouds.all || 0
      },
      description: weather.description || '',
      date: new Date().toISOString(),
      uv_index: 0 // OpenWeather бесплатная версия не предоставляет UV Index
    };

    return adaptedData;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Маршрут для получения текущей погоды
fastify.get('/weather/current/:cityId', async (request, reply) => {
  const cityId = request.params.cityId;
  const apiKey = 'c4b2992878138ac1210bc925ac188097';

  try {
    // Извлекаем координаты из city_id
    const latLonMatch = cityId.match(/lat([-\d.]+)_lon([-\d.]+)/);
    if (!latLonMatch) {
      return reply.code(400).send({ error: 'Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}' });
    }

    const lat = latLonMatch[1];
    const lon = latLonMatch[2];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ru&units=metric`
    );

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Адаптируем данные
    const main = data.main || {};
    const wind = data.wind || {};
    const weather = data.weather && data.weather.length > 0 ? data.weather[0] : {};
    const clouds = data.clouds || {};
    const rain = data.rain || {};
    const snow = data.snow || {};

    const adaptedData = {
      temperature: {
        air: {
          C: main.temp || 0
        },
        comfort: {
          C: main.feels_like || 0
        }
      },
      humidity: main.humidity || 0,
      precipitation: {
        type: rain['1h'] > 0 ? 'rain' : snow['1h'] > 0 ? 'snow' : 'none',
        intensity: rain['1h'] || snow['1h'] || 0
      },
      wind: {
        speed: wind.speed || 0,
        direction: getWindDirection(wind.deg || 0)
      },
      pressure: {
        mm: Math.round((main.pressure || 0) * 0.750062 * 10) / 10,
        hpa: main.pressure || 0
      },
      phenomena: {
        fog: weather.id === 741,
        thunder: weather.id >= 200 && weather.id < 300,
        cloudy: clouds.all || 0
      },
      description: weather.description || '',
      date: new Date().toISOString(),
      uv_index: 0 // OpenWeather бесплатная версия не предоставляет UV Index
    };

    return adaptedData;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Маршрут для получения прогноза погоды
fastify.get('/weather/forecast/:cityId', async (request, reply) => {
  const cityId = request.params.cityId;
  const days = parseInt(request.query.days || '7');
  const apiKey = 'c4b2992878138ac1210bc925ac188097';

  try {
    // Извлекаем координаты из city_id
    const latLonMatch = cityId.match(/lat([-\d.]+)_lon([-\d.]+)/);
    if (!latLonMatch) {
      return reply.code(400).send({ error: 'Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}' });
    }

    const lat = latLonMatch[1];
    const lon = latLonMatch[2];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ru&units=metric`
    );

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Группируем прогнозы по дате
    const forecasts = data.list || [];
    const groupedForecasts = {};

    forecasts.forEach(forecast => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!groupedForecasts[date]) {
        groupedForecasts[date] = [];
      }
      groupedForecasts[date].push(forecast);
    });

    // Для каждого дня выбираем прогноз на 12:00
    const result = { days: [] };

    for (const date in groupedForecasts) {
      if (result.days.length >= days) break;

      const dayForecasts = groupedForecasts[date];

      // Ищем прогноз ближайший к 12:00
      let noonForecast = null;
      let minDiff = Infinity;

      dayForecasts.forEach(forecast => {
        const time = forecast.dt_txt.split(' ')[1];
        const hour = parseInt(time.split(':')[0]);
        const diff = Math.abs(hour - 12);

        if (diff < minDiff) {
          minDiff = diff;
          noonForecast = forecast;
        }
      });

      const forecast = noonForecast || dayForecasts[0];
      const main = forecast.main || {};
      const wind = forecast.wind || {};
      const weather = forecast.weather && forecast.weather.length > 0 ? forecast.weather[0] : {};
      const clouds = forecast.clouds || {};
      const rain = forecast.rain || {};
      const snow = forecast.snow || {};

      result.days.push({
        temperature: {
          air: {
            C: main.temp || 0
          },
          comfort: {
            C: main.feels_like || 0
          }
        },
        humidity: main.humidity || 0,
        precipitation: {
          type: rain['3h'] > 0 ? 'rain' : snow['3h'] > 0 ? 'snow' : 'none',
          intensity: rain['3h'] || snow['3h'] || 0
        },
        wind: {
          speed: wind.speed || 0,
          direction: getWindDirection(wind.deg || 0)
        },
        pressure: {
          mm: Math.round((main.pressure || 0) * 0.750062 * 10) / 10,
          hpa: main.pressure || 0
        },
        phenomena: {
          fog: weather.id === 741,
          thunder: weather.id >= 200 && weather.id < 300,
          cloudy: clouds.all || 0
        },
        description: weather.description || '',
        date: forecast.dt_txt,
        uv_index: 0
      });
    }

    return result;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Маршрут для получения рекомендаций по одежде
fastify.get('/recommendations/:cityId', async (request, reply) => {
  const cityId = request.params.cityId;
  const activityType = request.query.activity_type || 'walk';

  if (!ACTIVITY_TYPES.includes(activityType)) {
    return reply.code(400).send({ error: `Неизвестный тип активности. Допустимые значения: ${ACTIVITY_TYPES.join(', ')}` });
  }

  try {
    // Используем существующий маршрут для получения текущей погоды
    const weatherResponse = await fastify.inject({
      method: 'GET',
      url: `/weather/current/${cityId}`
    });

    if (weatherResponse.statusCode !== 200) {
      return reply.code(weatherResponse.statusCode).send(JSON.parse(weatherResponse.payload));
    }

    const weatherData = JSON.parse(weatherResponse.payload);

    // Получаем рекомендации
    const recommendations = getClothingRecommendations(weatherData, activityType);

    return {
      weather: weatherData,
      recommendations: recommendations
    };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Маршрут для получения рекомендаций по одежде на основе прогноза
fastify.get('/recommendations/forecast/:cityId', async (request, reply) => {
  const cityId = request.params.cityId;
  const days = parseInt(request.query.days || '3');
  const activityType = request.query.activity_type || 'walk';

  if (!ACTIVITY_TYPES.includes(activityType)) {
    return reply.code(400).send({ error: `Неизвестный тип активности. Допустимые значения: ${ACTIVITY_TYPES.join(', ')}` });
  }

  try {
    // Используем существующий маршрут для получения прогноза погоды
    const forecastResponse = await fastify.inject({
      method: 'GET',
      url: `/weather/forecast/${cityId}?days=${days}`
    });

    if (forecastResponse.statusCode !== 200) {
      return reply.code(forecastResponse.statusCode).send(JSON.parse(forecastResponse.payload));
    }

    const forecastData = JSON.parse(forecastResponse.payload);

    // Получаем рекомендации для каждого дня
    const dailyRecommendations = forecastData.days.map(dayData => {
      const recommendations = getClothingRecommendations(dayData, activityType);

      return {
        date: dayData.date,
        weather: dayData,
        recommendations: recommendations
      };
    });

    return {
      city_id: cityId,
      activity_type: activityType,
      daily_recommendations: dailyRecommendations
    };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: error.message });
  }
});

// Функция для определения направления ветра по градусам
function getWindDirection(degrees) {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Функция для определения температурного диапазона
function getTempRange(temperature) {
  for (const [rangeName, [minTemp, maxTemp]] of Object.entries(TEMP_RANGES)) {
    if (temperature >= minTemp && temperature < maxTemp) {
      return rangeName;
    }
  }

  // Если температура выходит за пределы заданных диапазонов
  if (temperature < TEMP_RANGES.freezing[0]) {
    return "freezing";
  }
  return "very_hot";
}

// Функция для определения погодных условий, требующих дополнительных модификаторов
function getWeatherConditionModifiers(weatherData) {
  const modifiers = [];

  const precipitation = weatherData.precipitation || {};
  if (precipitation && precipitation.type === 'rain' && precipitation.intensity > 0) {
    modifiers.push('rain');
  }

  const wind = weatherData.wind || {};
  if (wind && wind.speed > 8) {  // Сильный ветер > 8 м/с
    modifiers.push('strong_wind');
  }

  if (precipitation && precipitation.type === 'snow' && precipitation.intensity > 0) {
    modifiers.push('snow');
  }

  const phenomena = weatherData.phenomena || {};
  if (phenomena.fog) {
    modifiers.push('fog');
  }

  if (weatherData.humidity > 80) {  // Высокая влажность > 80%
    modifiers.push('high_humidity');
  }

  if (weatherData.uv_index > 5) {  // Высокий УФ-индекс > 5
    modifiers.push('high_uv');
  }

  return modifiers;
}

// Функция для получения рекомендаций по одежде
function getClothingRecommendations(weatherData, activityType) {
  // Проверка корректности типа активности
  if (!ACTIVITY_TYPES.includes(activityType)) {
    activityType = 'walk';  // По умолчанию прогулка
  }

  // Определение температуры
  const temperature = weatherData.temperature?.air?.C || 0;
  const feelsLike = weatherData.temperature?.comfort?.C || temperature;

  // Используем температуру "ощущается как" для расчета
  const effectiveTemp = feelsLike;

  // Определение температурного диапазона
  const tempRange = getTempRange(effectiveTemp);

  // Базовые рекомендации по одежде для данного температурного диапазона и активности
  const recommendations = CLOTHING_DB[tempRange]?.[activityType] || CLOTHING_DB[tempRange]?.walk || {};

  // Копируем базовые рекомендации
  const result = {
    essential: [...(recommendations.essential || [])],
    recommended: [...(recommendations.recommended || [])],
    accessories: [...(recommendations.accessories || [])],
    avoid: []
  };

  // Применяем модификаторы на основе дополнительных погодных условий
  const weatherConditions = getWeatherConditionModifiers(weatherData);

  for (const condition of weatherConditions) {
    const conditionModifiers = WEATHER_MODIFIERS[condition] || {};

    for (const item of (conditionModifiers.add || [])) {
      // Добавляем только если такого элемента еще нет в рекомендациях
      if (!result.essential.includes(item) && !result.recommended.includes(item) && !result.accessories.includes(item)) {
        result.accessories.push(item);
      }
    }

    // Добавляем элементы, которых следует избегать
    for (const item of (conditionModifiers.avoid || [])) {
      if (!result.avoid.includes(item)) {
        result.avoid.push(item);
      }
    }
  }

  // Добавляем дополнительную информацию
  result.temperature = {
    actual: temperature,
    feels_like: feelsLike,
    range: tempRange.replace('_', ' ').charAt(0).toUpperCase() + tempRange.replace('_', ' ').slice(1)
  };
  result.weather_conditions = weatherConditions;

  return result;
}

// Запускаем сервер
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info(`Сервер запущен на ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
