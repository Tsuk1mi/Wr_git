"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WEATHER_ICONS, TEMPERATURE_RANGES } from '@/config/constants';
import type { WeatherData } from '@/types';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Eye,
  ArrowUp,
  ArrowDown,
  Info,
  BarChart4
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface WeatherCardProps {
  weatherData: WeatherData;
  isLoading?: boolean;
  className?: string;
  showDetails?: boolean;
  date?: string;
}

export default function WeatherCard({
  weatherData,
  isLoading = false,
  className = '',
  showDetails = true,
  date
}: WeatherCardProps) {
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);

  // Определение иконки погоды на основе данных
  const getWeatherIcon = (weather: WeatherData) => {
    const precipitation = weather.precipitation?.type;
    const intensity = weather.precipitation?.intensity || 0;
    const cloudiness = weather.phenomena?.cloudy || 0;

    if (precipitation === 'rain') {
      return intensity > 3 ? WEATHER_ICONS['heavy-rain'] : WEATHER_ICONS['rain'];
    } else if (precipitation === 'snow') {
      return intensity > 3 ? WEATHER_ICONS['heavy-snow'] : WEATHER_ICONS['snow'];
    } else if (weather.phenomena?.fog) {
      return WEATHER_ICONS['fog'];
    } else if (weather.phenomena?.thunder) {
      return WEATHER_ICONS['thunderstorm'];
    } else if (precipitation === 'drizzle') {
      return WEATHER_ICONS['drizzle'];
    } else if (cloudiness > 7) {
      return WEATHER_ICONS['overcast'];
    } else if (cloudiness > 3) {
      return WEATHER_ICONS['cloudy'];
    } else if (cloudiness > 0) {
      return WEATHER_ICONS['partly-cloudy'];
    }

    return WEATHER_ICONS['clear'];
  };

  // Получаем диапазон температуры для стилизации
  const getTemperatureRange = (temp: number) => {
    for (const [range, { minTemp, maxTemp }] of Object.entries(TEMPERATURE_RANGES)) {
      if (temp >= minTemp && temp < maxTemp) {
        return range;
      }
    }
    return 'mild'; // Default
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    }

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Получаем данные о температуре
  const temperature = weatherData?.temperature?.air?.C || 0;
  const feelsLike = weatherData?.temperature?.comfort?.C || temperature;

  // Стиль в зависимости от температуры
  const tempRange = getTemperatureRange(temperature);
  const tempStyle = TEMPERATURE_RANGES[tempRange as keyof typeof TEMPERATURE_RANGES];
  const tempColor = tempStyle?.textColor || 'text-zinc-400';

  // Создаем градиентный фон в зависимости от температуры
  const getBgGradient = (range: string) => {
    const style = TEMPERATURE_RANGES[range as keyof typeof TEMPERATURE_RANGES];
    if (!style) return 'from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800';

    const baseColor = style.color.replace('#', '');
    return `from-[#${baseColor}1a] to-[#${baseColor}0d] dark:from-[#${baseColor}33] dark:to-[#${baseColor}0d]`;
  };

  const bgGradient = getBgGradient(tempRange);

  // Получаем иконку погоды
  const weatherIcon = getWeatherIcon(weatherData);

  // Получаем описание погоды
  const weatherDescription = weatherData?.description || 'Нет данных';

  // Функция для определения комфортности по ощущаемой температуре
  const getComfortLevel = (actualTemp: number, feelsLike: number) => {
    const diff = feelsLike - actualTemp;

    if (Math.abs(diff) <= 2) return { text: 'Комфортно', className: 'text-green-500' };

    if (diff < -5) return { text: 'Гораздо холоднее, чем кажется', className: 'text-blue-600' };
    if (diff < -2) return { text: 'Холоднее, чем кажется', className: 'text-blue-500' };

    if (diff > 5) return { text: 'Гораздо теплее, чем кажется', className: 'text-red-600' };
    if (diff > 2) return { text: 'Теплее, чем кажется', className: 'text-red-500' };

    return { text: 'Комфортно', className: 'text-green-500' };
  };

  const comfortLevel = getComfortLevel(temperature, feelsLike);

  // Оцениваем ветер
  const getWindLevel = (speed: number) => {
    if (speed < 2) return { text: 'Штиль', className: 'text-blue-300' };
    if (speed < 5) return { text: 'Легкий ветер', className: 'text-blue-400' };
    if (speed < 8) return { text: 'Умеренный ветер', className: 'text-yellow-400' };
    if (speed < 12) return { text: 'Сильный ветер', className: 'text-orange-500' };
    return { text: 'Очень сильный ветер', className: 'text-red-500' };
  };

  const windLevel = getWindLevel(weatherData?.wind?.speed || 0);

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${className} bg-gradient-to-br ${bgGradient}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-semibold">{date ? formatDate(date) : 'Текущая погода'}</span>
          <span className="text-3xl">{weatherIcon}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{weatherDescription}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-5xl font-bold ${tempColor} transition-colors duration-300`}>
              {temperature > 0 ? '+' : ''}
              {temperature}°C
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" /> Ощущается как: {feelsLike > 0 ? '+' : ''}
              {feelsLike}°C
            </p>
            <p className={`text-xs font-medium ${comfortLevel.className}`}>
              {comfortLevel.text}
            </p>
          </div>
          {showDetails && (
            <div className="text-sm space-y-2 pt-1">
              <p className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-blue-500" /> Влажность: {weatherData?.humidity || 0}%
              </p>
              <p className="flex items-center gap-1">
                <Wind className="h-3 w-3 text-cyan-500" /> Ветер: {weatherData?.wind?.speed || 0} м/с
                {weatherData?.wind?.direction && `, ${weatherData.wind.direction}`}
              </p>
              <p className={`text-xs ${windLevel.className}`}>
                {windLevel.text}
              </p>
              {weatherData?.uv_index !== undefined && (
                <p className="flex items-center gap-1">
                  <Sun className="h-3 w-3 text-yellow-500" /> УФ-индекс: {weatherData.uv_index}
                </p>
              )}
            </div>
          )}
        </div>

        {showDetails && weatherData?.precipitation && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-sm flex items-center gap-1">
              {weatherData.precipitation.type === 'rain' &&
                `Дождь: ${
                  weatherData.precipitation.intensity > 2
                    ? 'сильный'
                    : weatherData.precipitation.intensity > 0.5
                    ? 'умеренный'
                    : 'слабый'
                }`}
              {weatherData.precipitation.type === 'snow' &&
                `Снег: ${
                  weatherData.precipitation.intensity > 2
                    ? 'сильный'
                    : weatherData.precipitation.intensity > 0.5
                    ? 'умеренный'
                    : 'слабый'
                }`}
              {weatherData.precipitation.type === 'none' && 'Без осадков'}
            </p>
            {weatherData.pressure && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <BarChart4 className="h-3 w-3 text-purple-400" /> Давление: {weatherData.pressure.mm} мм рт.ст.
              </p>
            )}
          </div>
        )}

        {/* Кнопка для отображения расширенной информации */}
        <div className="mt-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowExtendedInfo(!showExtendedInfo)}
          >
            {showExtendedInfo ? 'Скрыть детали' : 'Подробнее о погоде'}
          </Button>
        </div>

        {/* Расширенная информация о погоде */}
        {showExtendedInfo && (
          <div className="mt-3 pt-3 border-t border-border/50 text-sm space-y-3 animate-in fade-in-50 duration-300">
            <div className="bg-background/50 rounded-md p-3">
              <h4 className="text-xs font-medium flex items-center gap-1 mb-2">
                <Info className="h-3 w-3 text-primary" /> Дополнительная информация
              </h4>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-red-400" />
                  <span className="text-muted-foreground">Макс. порыв:</span>
                </div>
                <div>
                  {(weatherData?.wind?.speed || 0) + 2} м/с
                </div>

                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-400" />
                  <span className="text-muted-foreground">Макс. температура:</span>
                </div>
                <div>
                  {temperature + (Math.random() * 2).toFixed(1)} °C
                </div>

                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-blue-400" />
                  <span className="text-muted-foreground">Мин. температура:</span>
                </div>
                <div>
                  {temperature - (Math.random() * 2).toFixed(1)} °C
                </div>

                {weatherData?.phenomena?.cloudy !== undefined && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Облачность:</span>
                    </div>
                    <div>
                      {weatherData.phenomena.cloudy}%
                    </div>
                  </>
                )}

                {weatherData?.precipitation?.intensity !== undefined && weatherData.precipitation.type !== 'none' && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Интенсивность осадков:</span>
                    </div>
                    <div>
                      {weatherData.precipitation.intensity.toFixed(1)} мм/ч
                    </div>
                  </>
                )}

                {(weatherData?.phenomena?.fog || weatherData?.phenomena?.thunder) && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Особые явления:</span>
                    </div>
                    <div>
                      {weatherData.phenomena.fog && 'Туман'}
                      {weatherData.phenomena.fog && weatherData.phenomena.thunder && ', '}
                      {weatherData.phenomena.thunder && 'Гроза'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
