/**
 * Интерфейс для данных о городе
 */
export interface FavoriteCity {
  id: string;        // ID города в формате lat{широта}_lon{долгота}
  name: string;      // Название города
  country: string;   // Код страны
  region?: string;   // Регион/область (опционально)
  latitude: number;  // Широта
  longitude: number; // Долгота
  addedAt: number;   // Временная метка добавления
}

/**
 * Ключ для хранения в localStorage
 */
const FAVORITES_STORAGE_KEY = 'weatherwear_favorite_cities';

/**
 * Получить список избранных городов из localStorage
 */
export function getFavoriteCities(): FavoriteCity[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedData = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!storedData) {
    return [];
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error parsing favorite cities from localStorage:', error);
    return [];
  }
}

/**
 * Добавить город в избранное
 */
export function addToFavorites(city: Omit<FavoriteCity, 'addedAt'>): FavoriteCity[] {
  const favorites = getFavoriteCities();

  // Проверяем, есть ли уже этот город в избранном
  const exists = favorites.some(fav => fav.id === city.id);

  if (!exists) {
    // Добавляем новый город с временной меткой
    const newCity: FavoriteCity = {
      ...city,
      addedAt: Date.now()
    };

    const updatedFavorites = [...favorites, newCity];

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }

    return updatedFavorites;
  }

  return favorites;
}

/**
 * Удалить город из избранного
 */
export function removeFromFavorites(cityId: string): FavoriteCity[] {
  const favorites = getFavoriteCities();

  // Фильтруем список, исключая город с указанным ID
  const updatedFavorites = favorites.filter(city => city.id !== cityId);

  // Сохраняем в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  }

  return updatedFavorites;
}

/**
 * Проверить, находится ли город в избранном
 */
export function isCityInFavorites(cityId: string): boolean {
  const favorites = getFavoriteCities();
  return favorites.some(city => city.id === cityId);
}

/**
 * Получить избранный город по его ID
 */
export function getFavoriteCityById(cityId: string): FavoriteCity | undefined {
  const favorites = getFavoriteCities();
  return favorites.find(city => city.id === cityId);
}

/**
 * Сортировать избранные города
 */
export function sortFavoriteCities(
  cities: FavoriteCity[],
  sortBy: 'name' | 'addedAt' = 'addedAt',
  order: 'asc' | 'desc' = 'desc'
): FavoriteCity[] {
  return [...cities].sort((a, b) => {
    if (sortBy === 'name') {
      return order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return order === 'asc'
        ? a.addedAt - b.addedAt
        : b.addedAt - a.addedAt;
    }
  });
}

/**
 * Очистить все избранные города
 */
export function clearAllFavorites(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }
}
