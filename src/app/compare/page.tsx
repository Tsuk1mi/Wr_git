"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CityComparisonSelector from "@/components/city-comparison-selector";
import WeatherCard from "@/components/weather-card";
import type { City, WeatherData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComparePage() {
  const [city1Data, setCity1Data] = useState<{ city: City; weather: WeatherData | null }>({
    city: null,
    weather: null,
  });
  const [city2Data, setCity2Data] = useState<{ city: City; weather: WeatherData | null }>({
    city: null,
    weather: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (city1: City, city2: City) => {
    setIsLoading(true);
    setError(null);

    try {
      // Загружаем данные для первого города
      const weatherResponse1 = await fetch(`/api/weather/current/${city1.id}`);
      if (!weatherResponse1.ok) {
        throw new Error(`Не удалось загрузить данные для города ${city1.name}`);
      }
      const weatherData1 = await weatherResponse1.json();

      // Загружаем данные для второго города
      const weatherResponse2 = await fetch(`/api/weather/current/${city2.id}`);
      if (!weatherResponse2.ok) {
        throw new Error(`Не удалось загрузить данные для города ${city2.name}`);
      }
      const weatherData2 = await weatherResponse2.json();

      // Обновляем состояние
      setCity1Data({ city: city1, weather: weatherData1 });
      setCity2Data({ city: city2, weather: weatherData2 });
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
      setError(`Ошибка при загрузке данных: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Расчет разницы температур
  const calculateTempDifference = () => {
    if (!city1Data.weather || !city2Data.weather) return null;

    const temp1 = city1Data.weather.temperature.air.C;
    const temp2 = city2Data.weather.temperature.air.C;
    return temp1 - temp2;
  };

  // Расчет разницы ощущаемых температур
  const calculateFeelsLikeDifference = () => {
    if (!city1Data.weather || !city2Data.weather) return null;

    const feelsLike1 = city1Data.weather.temperature.comfort.C;
    const feelsLike2 = city2Data.weather.temperature.comfort.C;
    return feelsLike1 - feelsLike2;
  };

  // Температурная разница с правильным форматированием
  const formatTempDifference = (diff: number) => {
    if (diff === 0) return "одинаковая";
    return diff > 0 ? `на ${Math.abs(diff)}°C теплее` : `на ${Math.abs(diff)}°C холоднее`;
  };

  const tempDiff = calculateTempDifference();
  const feelsLikeDiff = calculateFeelsLikeDifference();

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Сравнение погоды в городах</h1>
          <p className="text-muted-foreground mb-8">
            Выберите два города для сравнения погодных условий и рекомендаций по одежде
          </p>

          <CityComparisonSelector onCompare={handleCompare} />

          {isLoading && (
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-600">Ошибка</h2>
                  <p className="mt-2">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && city1Data.weather && city2Data.weather && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Результаты сравнения</h2>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">Основные различия</h3>
                    <ul className="space-y-2">
                      <li>
                        <span className="font-medium">Температура: </span>
                        В городе {city1Data.city.name} {formatTempDifference(tempDiff)} чем в
                        городе {city2Data.city.name} ({city1Data.weather.temperature.air.C}°C vs{" "}
                        {city2Data.weather.temperature.air.C}°C)
                      </li>
                      <li>
                        <span className="font-medium">Ощущаемая температура: </span>
                        В городе {city1Data.city.name} ощущается {formatTempDifference(feelsLikeDiff)} чем в
                        городе {city2Data.city.name} ({city1Data.weather.temperature.comfort.C}°C vs{" "}
                        {city2Data.weather.temperature.comfort.C}°C)
                      </li>
                      <li>
                        <span className="font-medium">Влажность: </span>
                        {Math.abs(city1Data.weather.humidity - city2Data.weather.humidity) < 5
                          ? "Примерно одинаковая в обоих городах"
                          : `В городе ${
                              city1Data.weather.humidity > city2Data.weather.humidity
                                ? city1Data.city.name
                                : city2Data.city.name
                            } влажность выше`}{" "}
                        ({city1Data.weather.humidity}% vs {city2Data.weather.humidity}%)
                      </li>
                      <li>
                        <span className="font-medium">Ветер: </span>
                        {Math.abs(city1Data.weather.wind.speed - city2Data.weather.wind.speed) < 2
                          ? "Скорость ветра примерно одинаковая"
                          : `В городе ${
                              city1Data.weather.wind.speed > city2Data.weather.wind.speed
                                ? city1Data.city.name
                                : city2Data.city.name
                            } ветер сильнее`}{" "}
                        ({city1Data.weather.wind.speed} м/с vs {city2Data.weather.wind.speed} м/с)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="current">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="current" className="flex-1">
                    Текущая погода
                  </TabsTrigger>
                  <TabsTrigger value="recommendation" className="flex-1">
                    Рекомендации
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">{city1Data.city.name}</h3>
                        <WeatherCard weatherData={city1Data.weather} showDetails={true} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">{city2Data.city.name}</h3>
                        <WeatherCard weatherData={city2Data.weather} showDetails={true} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendation">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Подходит для {city1Data.city.name}</h3>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Верхняя одежда: </span>
                            {city1Data.weather.temperature.air.C > 20
                              ? "Легкая одежда, футболка"
                              : city1Data.weather.temperature.air.C > 15
                              ? "Легкая куртка или кофта"
                              : city1Data.weather.temperature.air.C > 5
                              ? "Демисезонная куртка"
                              : "Теплая зимняя куртка"}
                          </p>
                          <p>
                            <span className="font-medium">Обувь: </span>
                            {city1Data.weather.temperature.air.C > 20
                              ? "Легкая обувь, сандалии"
                              : city1Data.weather.temperature.air.C > 10
                              ? "Кроссовки, легкие ботинки"
                              : "Утепленная обувь, ботинки"}
                          </p>
                          {city1Data.weather.temperature.air.C < 10 && (
                            <p>
                              <span className="font-medium">Дополнительно: </span>
                              Шапка, перчатки, шарф
                            </p>
                          )}
                          {city1Data.precipitation?.type === "rain" && (
                            <p className="text-blue-500">Не забудьте зонт - ожидается дождь!</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Подходит для {city2Data.city.name}</h3>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Верхняя одежда: </span>
                            {city2Data.weather.temperature.air.C > 20
                              ? "Легкая одежда, футболка"
                              : city2Data.weather.temperature.air.C > 15
                              ? "Легкая куртка или кофта"
                              : city2Data.weather.temperature.air.C > 5
                              ? "Демисезонная куртка"
                              : "Теплая зимняя куртка"}
                          </p>
                          <p>
                            <span className="font-medium">Обувь: </span>
                            {city2Data.weather.temperature.air.C > 20
                              ? "Легкая обувь, сандалии"
                              : city2Data.weather.temperature.air.C > 10
                              ? "Кроссовки, легкие ботинки"
                              : "Утепленная обувь, ботинки"}
                          </p>
                          {city2Data.weather.temperature.air.C < 10 && (
                            <p>
                              <span className="font-medium">Дополнительно: </span>
                              Шапка, перчатки, шарф
                            </p>
                          )}
                          {city2Data.precipitation?.type === "rain" && (
                            <p className="text-blue-500">Не забудьте зонт - ожидается дождь!</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
