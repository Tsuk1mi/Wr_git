import { seedClothingRecommendations } from './clothingRecommendations';
import { seedPopularCities } from './popularCities';

/**
 * Функция для заполнения всей базы данных начальными данными
 */
export async function seedDatabase() {
  try {
    // Заполняем рекомендации по одежде
    await seedClothingRecommendations();

    // Заполняем популярные города
    await seedPopularCities();

    console.log('База данных успешно заполнена всеми начальными данными');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    throw error;
  }
}

export default seedDatabase;
