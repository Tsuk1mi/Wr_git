"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, X, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  getFavoriteCities,
  removeFromFavorites,
  sortFavoriteCities,
  type FavoriteCity
} from '@/lib/favorites';

interface FavoriteCitiesProps {
  className?: string;
  limit?: number;
  onSelect?: (city: FavoriteCity) => void;
}

export default function FavoriteCities({ className, limit = 5, onSelect }: FavoriteCitiesProps) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'addedAt'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Загружаем избранные города из localStorage
  useEffect(() => {
    const favorites = getFavoriteCities();
    const sortedFavorites = sortFavoriteCities(favorites, sortBy, sortOrder);
    setFavorites(sortedFavorites.slice(0, limit));
  }, [limit, sortBy, sortOrder]);

  // Обработчик удаления города из избранного
  const handleRemove = (cityId: string) => {
    const updatedFavorites = removeFromFavorites(cityId);
    const sortedFavorites = sortFavoriteCities(updatedFavorites, sortBy, sortOrder);
    setFavorites(sortedFavorites.slice(0, limit));
  };

  // Обработчик изменения сортировки
  const handleSortChange = (newSortBy: 'name' | 'addedAt') => {
    if (newSortBy === sortBy) {
      // Если тот же столбец, инвертируем порядок сортировки
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Если другой столбец, устанавливаем его и сбрасываем порядок на значение по умолчанию
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'name' ? 'asc' : 'desc');
    }
  };

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardHeader className="bg-muted/30 p-4">
        <CardTitle className="flex items-center text-lg">
          <Heart className="w-5 h-5 mr-2 text-primary" />
          Избранные города

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => handleSortChange('name')}
            >
              <span className={sortBy === 'name' ? 'font-bold' : ''}>
                По имени {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => handleSortChange('addedAt')}
            >
              <span className={sortBy === 'addedAt' ? 'font-bold' : ''}>
                По дате {sortBy === 'addedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {favorites.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>У вас пока нет избранных городов</p>
            <p className="text-sm mt-2">Добавляйте города в избранное, чтобы быстро получать прогноз погоды</p>
          </div>
        ) : (
          <ul className="divide-y">
            {favorites.map((city) => (
              <li key={city.id} className="p-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {onSelect ? (
                      <button
                        onClick={() => onSelect(city)}
                        className="flex items-center text-left hover:text-primary transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-2 opacity-70" />
                        <span className="font-medium">{city.name}</span>
                      </button>
                    ) : (
                      <Link
                        href={`/weather/${city.id}`}
                        className="flex items-center hover:text-primary transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-2 opacity-70" />
                        <span className="font-medium">{city.name}</span>
                      </Link>
                    )}
                    <div className="flex gap-1 mt-1 ml-6">
                      <Badge variant="outline" className="text-xs">
                        {city.country}
                      </Badge>
                      {city.region && (
                        <Badge variant="outline" className="text-xs">
                          {city.region}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(city.id)}
                    title="Удалить из избранного"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {favorites.length > 0 && (
          <div className="p-3 bg-muted/10 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                const allFavorites = getFavoriteCities();
                const sortedFavorites = sortFavoriteCities(allFavorites, sortBy, sortOrder);
                setFavorites(sortedFavorites.slice(0, limit));
              }}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Обновить список
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
