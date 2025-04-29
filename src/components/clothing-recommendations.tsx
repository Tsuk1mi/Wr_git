"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ActivityType, ClothingItem } from "@/types";
import { useUserPreferences, PreferencesButton } from "./user-preferences";
import { RecommendationSkeleton } from "./loading-ui";
import type { ClothingRecommendations } from "@/types";

type ActivityIconType = "walk" | "sport" | "work" | "casual";

interface ClothingRecommendationsProps {
  recommendations: ClothingRecommendations;
  isLoading?: boolean;
}

export default function ClothingRecommendationsDisplay({
  recommendations,
  isLoading = false
}: ClothingRecommendationsProps) {
  const [activeActivity, setActiveActivity] = useState<ActivityType>("walk");
  const { preferences } = useUserPreferences();
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<ClothingRecommendations>(recommendations);

  // Применяем пользовательские предпочтения к рекомендациям
  useEffect(() => {
    if (!recommendations) {
      setPersonalizedRecommendations(recommendations);
      return;
    }

    const customized = { ...recommendations };

    // Для каждого типа активности
    Object.keys(customized).forEach((activityKey) => {
      const activity = activityKey as ActivityType;
      const activityRecommendations = { ...customized[activity] };

      // Учитываем чувствительность к температуре
      if (preferences.temperatureSensitivity !== 0) {
        // Если человек мерзнет (значения -1, -2), добавляем более теплые вещи
        if (preferences.temperatureSensitivity < 0) {
          // Добавляем дополнительные слои
          if (!activityRecommendations.layers.includes("Термобелье") && preferences.temperatureSensitivity <= -2) {
            activityRecommendations.layers.push("Термобелье");
          }
          if (!activityRecommendations.layers.includes("Утепленная подкладка") && preferences.temperatureSensitivity <= -1) {
            activityRecommendations.layers.push("Утепленная подкладка");
          }
        }
        // Если человеку жарко (значения 1, 2), убираем лишние слои
        else if (preferences.temperatureSensitivity > 0) {
          activityRecommendations.layers = activityRecommendations.layers.filter(
            layer => !["Термобелье", "Утепленная подкладка", "Теплый свитер"].includes(layer)
          );

          // Заменяем теплые вещи на более легкие
          activityRecommendations.upper = activityRecommendations.upper.map(item =>
            item === "Теплая куртка" ? "Легкая куртка" :
            item === "Шерстяной свитер" ? "Тонкий свитер" :
            item === "Плотная рубашка" ? "Легкая рубашка" :
            item
          );

          // При очень высокой чувствительности к жаре
          if (preferences.temperatureSensitivity >= 2) {
            activityRecommendations.upper = activityRecommendations.upper.filter(
              item => !["Свитер", "Толстовка", "Флисовая кофта"].includes(item)
            );
          }
        }
      }

      // Учитываем защиту от дождя
      if (preferences.rainProtection > 0) {
        if (preferences.rainProtection === 2) {
          // Максимальная защита
          if (!activityRecommendations.accessories.includes("Зонт")) {
            activityRecommendations.accessories.push("Зонт");
          }

          // Обновляем верхнюю одежду на водонепроницаемую
          const hasWaterproofJacket = activityRecommendations.upper.some(
            item => item.includes("непромокаем") || item.includes("дожд")
          );

          if (!hasWaterproofJacket) {
            activityRecommendations.upper = activityRecommendations.upper.map(item =>
              item.includes("куртка") || item.includes("пальто") ?
              "Водонепроницаемая " + item.toLowerCase() : item
            );
          }
        }
      }

      // Учитываем защиту от ветра
      if (preferences.windProtection > 0) {
        if (preferences.windProtection === 2) {
          // Максимальная защита от ветра
          const hasWindproofItem = activityRecommendations.upper.some(
            item => item.includes("ветрозащит") || item.includes("ветро")
          );

          if (!hasWindproofItem) {
            activityRecommendations.accessories.push("Ветрозащитная повязка");
            activityRecommendations.upper = activityRecommendations.upper.map(item =>
              item.includes("куртка") ? "Ветрозащитная " + item.toLowerCase() : item
            );
          }
        }
      }

      // Учитываем стиль одежды
      if (preferences.formalStyle) {
        // Заменяем повседневную одежду на более формальную
        activityRecommendations.upper = activityRecommendations.upper.map(item =>
          item === "Свитер" ? "Кардиган" :
          item === "Толстовка" ? "Пиджак" :
          item === "Футболка" ? "Рубашка" :
          item === "Легкая куртка" ? "Пальто" :
          item
        );

        activityRecommendations.lower = activityRecommendations.lower.map(item =>
          item === "Джинсы" ? "Брюки" :
          item === "Спортивные штаны" ? "Классические брюки" :
          item
        );
      }

      // Учитываем ограниченную подвижность
      if (preferences.limitedMobility) {
        // Убираем сложную в надевании одежду
        activityRecommendations.layers = activityRecommendations.layers.filter(
          layer => !["Несколько слоев"].includes(layer)
        );

        // Добавляем удобную одежду
        activityRecommendations.general.push("Удобная и легко надеваемая одежда");

        // Заменяем обувь на более удобную
        activityRecommendations.footwear = activityRecommendations.footwear.map(item =>
          item.includes("сапоги") ? "Удобные сапоги на молнии" :
          item.includes("ботинки") ? "Удобные ботинки на липучках" :
          item
        );
      }

      customized[activity] = activityRecommendations;
    });

    setPersonalizedRecommendations(customized);
  }, [recommendations, preferences]);

  if (isLoading) {
    return <RecommendationSkeleton />;
  }

  if (!recommendations || !personalizedRecommendations) {
    return <div className="p-4 text-center text-muted-foreground">Рекомендации недоступны</div>;
  }

  return (
    <Card className="shadow-sm mt-6">
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-lg font-semibold">Рекомендации по одежде</h2>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Tabs
            value={activeActivity}
            onValueChange={(v) => setActiveActivity(v as ActivityType)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="walk">Прогулка</TabsTrigger>
              <TabsTrigger value="sport">Спорт</TabsTrigger>
              <TabsTrigger value="work">Работа</TabsTrigger>
              <TabsTrigger value="casual">Дома</TabsTrigger>
            </TabsList>
          </Tabs>
          <PreferencesButton />
        </div>
      </div>

      <Separator />

      <div className="p-4">
        {personalizedRecommendations[activeActivity]?.general?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Общие рекомендации:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalizedRecommendations[activeActivity].general.map((item) => (
                <Badge key={item} variant="outline" className="py-1.5 text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Слои одежды */}
        {personalizedRecommendations[activeActivity]?.layers?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Слои одежды:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalizedRecommendations[activeActivity].layers.map((item) => (
                <Badge key={item} variant="secondary" className="py-1.5 text-sm bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Верхняя одежда */}
        {personalizedRecommendations[activeActivity]?.upper?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Верхняя одежда:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalizedRecommendations[activeActivity].upper.map((item) => (
                <Badge key={item} className="py-1.5 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Нижняя одежда */}
        {personalizedRecommendations[activeActivity]?.lower?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Нижняя одежда:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalizedRecommendations[activeActivity].lower.map((item) => (
                <Badge key={item} className="py-1.5 text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Обувь */}
        {personalizedRecommendations[activeActivity]?.footwear?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Обувь:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {personalizedRecommendations[activeActivity].footwear.map((item) => (
                <Badge key={item} className="py-1.5 text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Аксессуары */}
        {personalizedRecommendations[activeActivity]?.accessories?.length > 0 && (
          <div>
            <p className="font-medium text-sm text-muted-foreground mb-2">
              Аксессуары:
            </p>
            <div className="flex flex-wrap gap-2">
              {personalizedRecommendations[activeActivity].accessories.map((item) => (
                <Badge key={item} variant="outline" className="py-1.5 text-sm border-purple-200 bg-purple-100/50 text-purple-800 hover:bg-purple-200 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
