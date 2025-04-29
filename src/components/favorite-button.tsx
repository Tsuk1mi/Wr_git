"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { addToFavorites, removeFromFavorites, isCityInFavorites } from '@/lib/favorites';
import { toast } from './ui/use-toast';

interface FavoriteButtonProps {
  cityId: string;
  cityName: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function FavoriteButton({
  cityId,
  cityName,
  country,
  region = '',
  latitude,
  longitude,
  variant = 'outline',
  size = 'default',
  className = ''
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Проверяем, находится ли город в избранном при загрузке компонента
  useEffect(() => {
    setIsFavorite(isCityInFavorites(cityId));
  }, [cityId]);

  // Обработчик добавления/удаления из избранного
  const toggleFavorite = () => {
    if (isFavorite) {
      // Удаляем из избранного
      removeFromFavorites(cityId);
      setIsFavorite(false);
      toast({
        title: 'Город удален из избранного',
        description: `${cityName} удален из списка избранных городов`,
        variant: 'default'
      });
    } else {
      // Добавляем в избранное
      addToFavorites({
        id: cityId,
        name: cityName,
        country,
        region,
        latitude,
        longitude
      });
      setIsFavorite(true);
      toast({
        title: 'Город добавлен в избранное',
        description: `${cityName} добавлен в список избранных городов`,
        variant: 'default'
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFavorite}
      className={`group ${className}`}
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Heart
        className={`${
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
        } ${
          isFavorite
            ? 'fill-primary text-primary'
            : 'fill-none text-muted-foreground group-hover:text-primary'
        } transition-all`}
      />
      {size !== 'icon' && (
        <span className="ml-2">
          {isFavorite ? 'В избранном' : 'В избранное'}
        </span>
      )}
    </Button>
  );
}
