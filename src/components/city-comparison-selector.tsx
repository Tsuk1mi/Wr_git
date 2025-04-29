"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CitySearch from '@/components/city-search';
import { ArrowRight, RefreshCw } from 'lucide-react';
import type { City } from '@/types';

interface CityComparisonSelectorProps {
  onCompare: (city1: City, city2: City) => void;
}

export default function CityComparisonSelector({ onCompare }: CityComparisonSelectorProps) {
  const [firstCity, setFirstCity] = useState<City | null>(null);
  const [secondCity, setSecondCity] = useState<City | null>(null);

  const handleCompare = () => {
    if (firstCity && secondCity) {
      onCompare(firstCity, secondCity);
    }
  };

  const handleReset = () => {
    setFirstCity(null);
    setSecondCity(null);
  };

  const handleSelectFirstCity = (city: City) => {
    setFirstCity(city);
  };

  const handleSelectSecondCity = (city: City) => {
    setSecondCity(city);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-7 items-center">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2">Первый город</label>
            <CitySearch onSelectCity={handleSelectFirstCity} />
            {firstCity && (
              <p className="mt-2 text-sm font-medium">{firstCity.name}</p>
            )}
          </div>

          <div className="flex justify-center md:col-span-1">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2">Второй город</label>
            <CitySearch onSelectCity={handleSelectSecondCity} />
            {secondCity && (
              <p className="mt-2 text-sm font-medium">{secondCity.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={handleCompare}
            disabled={!firstCity || !secondCity}
          >
            Сравнить
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!firstCity && !secondCity}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
