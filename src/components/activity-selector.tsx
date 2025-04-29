"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ActivityType } from '@/types';
import { ACTIVITY_TYPES } from '@/config/constants';
import { Card } from '@/components/ui/card';
import { Umbrella, Wind, Thermometer } from 'lucide-react';

interface ActivitySelectorProps {
  defaultValue?: ActivityType;
  onChange?: (value: ActivityType) => void;
}

export default function ActivitySelector({
  defaultValue = 'walk',
  onChange
}: ActivitySelectorProps) {
  const [activity, setActivity] = useState<ActivityType>(defaultValue);

  const handleActivityChange = (value: string) => {
    const activityValue = value as ActivityType;
    setActivity(activityValue);
    if (onChange) {
      onChange(activityValue);
    }
  };

  // Получаем подходящую информацию для текущей активности
  const getActivityInfo = (activity: ActivityType) => {
    switch(activity) {
      case 'walk':
        return {
          title: 'Прогулка',
          description: 'Рекомендации для комфортной ежедневной прогулки',
          icon: <Umbrella className="h-4 w-4 text-blue-500" />
        };
      case 'sport':
        return {
          title: 'Спорт',
          description: 'Рекомендации для активного отдыха и спорта',
          icon: <Wind className="h-4 w-4 text-green-500" />
        };
      case 'work':
        return {
          title: 'Работа',
          description: 'Рекомендации для рабочего дня и офиса',
          icon: <Thermometer className="h-4 w-4 text-amber-500" />
        };
      case 'leisure':
        return {
          title: 'Отдых',
          description: 'Рекомендации для отдыха и развлечений',
          icon: <Umbrella className="h-4 w-4 text-purple-500" />
        };
      default:
        return {
          title: 'Прогулка',
          description: 'Рекомендации для комфортной ежедневной прогулки',
          icon: <Umbrella className="h-4 w-4 text-blue-500" />
        };
    }
  };

  const activityInfo = getActivityInfo(activity);

  return (
    <Card className="w-full p-4 bg-gradient-to-r from-muted/50 to-background transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-md font-medium flex items-center gap-2">
            {activityInfo.icon}
            <span>Тип активности: <span className="text-primary">{activityInfo.title}</span></span>
          </h3>
          <p className="text-xs text-muted-foreground hidden md:block">{activityInfo.description}</p>
        </div>

        <Tabs
          defaultValue={activity}
          onValueChange={handleActivityChange}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto bg-background/40 backdrop-blur-sm rounded-md">
            {ACTIVITY_TYPES.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex items-center gap-1 data-[state=active]:animate-pulse transition-all"
              >
                <span className="text-lg">{type.icon}</span>
                <span className="hidden sm:inline text-xs md:text-sm">{type.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </Card>
  );
}
