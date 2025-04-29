"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Loader2, MapPin, Navigation, CircleAlert } from 'lucide-react';
import api from '@/lib/api';
import type { City } from '@/types';
import { POPULAR_CITIES } from '@/config/constants';
import { useRouter } from 'next/navigation';

export interface CitySearchProps {
  onSelectCity?: (city: City) => void;
  minimal?: boolean;
}

export default function CitySearch({ onSelectCity, minimal = false }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const router = useRouter();

  const searchCities = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await api.searchCity(searchQuery);
      setCities(results);
    } catch (err) {
      console.error('Ошибка поиска города:', err);
      setError('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchCities(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchCities]);

  const handleCitySelect = (city: City) => {
    setQuery('');
    setCities([]);
    setIsOpen(false);

    if (onSelectCity) {
      onSelectCity(city);
    } else {
      router.push(`/weather/${city.id}`);
    }
  };

  // Закрываем выпадающее меню при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.city-search-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Функция для отображения поля поиска
  const handleSearchFocus = () => {
    setIsOpen(true);
  };

  // Функция для определения местоположения пользователя
  const handleGeolocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Геолокация не поддерживается вашим браузером');
      return;
    }

    setIsGeolocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const weatherData = await api.getWeatherByCoordinates(latitude, longitude);

          if (weatherData && weatherData.id) {
            const city: City = {
              id: weatherData.id,
              name: weatherData.name,
              country: weatherData.country,
              lat: latitude,
              lon: longitude
            };

            handleCitySelect(city);
          } else {
            setError('Не удалось получить данные о погоде для текущего местоположения');
          }
        } catch (err) {
          console.error('Ошибка получения погоды по координатам:', err);
          setError('Не удалось определить ваше местоположение. Пожалуйста, попробуйте позже.');
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        console.error('Ошибка геолокации:', error);
        let errorMessage = 'Не удалось определить ваше местоположение.';

        if (error.code === 1) {
          errorMessage = 'Доступ к геолокации запрещен. Пожалуйста, разрешите доступ к вашему местоположению.';
        } else if (error.code === 2) {
          errorMessage = 'Информация о местоположении недоступна.';
        } else if (error.code === 3) {
          errorMessage = 'Время ожидания определения местоположения истекло.';
        }

        setError(errorMessage);
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className={`city-search-container relative ${minimal ? 'w-full' : 'w-full max-w-md mx-auto'}`}>
      <div className="relative">
        {minimal ? (
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Поиск города..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchFocus}
              className={`rounded-full h-8 pl-8 ${isOpen ? 'w-full' : ''} transition-all`}
            />
            <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
              {isLoading || isGeolocating ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={handleGeolocation}
              disabled={isGeolocating || isLoading}
              title="Определить моё местоположение"
            >
              <Navigation className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Введите название города..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 flex-shrink-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              onClick={handleGeolocation}
              disabled={isGeolocating || isLoading}
              title="Определить моё местоположение"
            >
              {isGeolocating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-1.5 animate-fadeIn">
          <CircleAlert className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {isOpen && (
        <>
          {cities.length > 0 && (
            <Card className={`${minimal ? 'absolute z-50 w-full' : 'mt-2'} p-2 max-h-60 overflow-y-auto animate-fadeIn`}>
              <ul className="space-y-1">
                {cities.map((city) => (
                  <li key={city.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left font-normal group"
                      onClick={() => handleCitySelect(city)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      {city.name}
                      {city.region && <span className="text-muted-foreground ml-1 text-sm">({city.region})</span>}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {!query && !cities.length && !minimal && (
            <div className="mt-4 animate-fadeIn">
              <h3 className="text-sm font-medium mb-2">Популярные города:</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((city) => (
                  <Button
                    key={city.id}
                    variant="outline"
                    size="sm"
                    className="group"
                    onClick={() => handleCitySelect(city)}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1 group-hover:text-primary transition-colors" />
                    {city.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
