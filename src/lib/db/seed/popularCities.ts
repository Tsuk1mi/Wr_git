import { connectToDatabase } from '../connect';
import PopularCity from '../models/PopularCity';

/**
 * Данные популярных городов для начального заполнения
 */
export const popularCitiesData = [
  {
    cityId: 'lat55.7558_lon37.6173',
    name: 'Москва',
    country: 'RU',
    region: 'Москва',
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6173
    },
    displayOrder: 1,
    searchCount: 1000
  },
  {
    cityId: 'lat59.9386_lon30.3141',
    name: 'Санкт-Петербург',
    country: 'RU',
    region: 'Санкт-Петербург',
    coordinates: {
      latitude: 59.9386,
      longitude: 30.3141
    },
    displayOrder: 2,
    searchCount: 950
  },
  {
    cityId: 'lat56.8519_lon60.6122',
    name: 'Екатеринбург',
    country: 'RU',
    region: 'Свердловская область',
    coordinates: {
      latitude: 56.8519,
      longitude: 60.6122
    },
    displayOrder: 3,
    searchCount: 800
  },
  {
    cityId: 'lat55.0084_lon82.9357',
    name: 'Новосибирск',
    country: 'RU',
    region: 'Новосибирская область',
    coordinates: {
      latitude: 55.0084,
      longitude: 82.9357
    },
    displayOrder: 4,
    searchCount: 750
  },
  {
    cityId: 'lat55.7879_lon49.1233',
    name: 'Казань',
    country: 'RU',
    region: 'Республика Татарстан',
    coordinates: {
      latitude: 55.7879,
      longitude: 49.1233
    },
    displayOrder: 5,
    searchCount: 700
  },
  {
    cityId: 'lat51.5287398_lon-0.2664035',
    name: 'Лондон',
    country: 'GB',
    region: 'Англия',
    coordinates: {
      latitude: 51.5287398,
      longitude: -0.2664035
    },
    displayOrder: 6,
    searchCount: 650
  },
  {
    cityId: 'lat48.8534_lon2.3488',
    name: 'Париж',
    country: 'FR',
    region: 'Иль-де-Франс',
    coordinates: {
      latitude: 48.8534,
      longitude: 2.3488
    },
    displayOrder: 7,
    searchCount: 600
  },
  {
    cityId: 'lat40.7128_lon-74.006',
    name: 'Нью-Йорк',
    country: 'US',
    region: 'Нью-Йорк',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006
    },
    displayOrder: 8,
    searchCount: 550
  },
  {
    cityId: 'lat55.0415_lon82.9346',
    name: 'Новосибирск',
    country: 'RU',
    region: 'Новосибирская область',
    coordinates: {
      latitude: 55.0415,
      longitude: 82.9346
    },
    displayOrder: 9,
    searchCount: 500
  },
  {
    cityId: 'lat56.3287_lon44.002',
    name: 'Нижний Новгород',
    country: 'RU',
    region: 'Нижегородская область',
    coordinates: {
      latitude: 56.3287,
      longitude: 44.002
    },
    displayOrder: 10,
    searchCount: 450
  },
  {
    cityId: 'lat55.1598_lon61.4026',
    name: 'Челябинск',
    country: 'RU',
    region: 'Челябинская область',
    coordinates: {
      latitude: 55.1598,
      longitude: 61.4026
    },
    displayOrder: 11,
    searchCount: 400
  },
  {
    cityId: 'lat54.9924_lon73.3686',
    name: 'Омск',
    country: 'RU',
    region: 'Омская область',
    coordinates: {
      latitude: 54.9924,
      longitude: 73.3686
    },
    displayOrder: 12,
    searchCount: 350
  }
];

/**
 * Функция для заполнения базы данных начальными популярными городами
 */
export async function seedPopularCities() {
  try {
    await connectToDatabase();

    // Удаляем все существующие популярные города
    await PopularCity.deleteMany({});

    // Добавляем новые популярные города
    await PopularCity.insertMany(popularCitiesData);

    console.log('База данных успешно заполнена популярными городами');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    throw error;
  }
}
