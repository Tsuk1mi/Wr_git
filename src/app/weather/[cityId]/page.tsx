"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import WeatherCard from "@/components/weather-card";
import ClothingRecommendations from "@/components/clothing-recommendations";
import ActivitySelector from "@/components/activity-selector";
import type { ActivityType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, RefreshCw, MapPin } from "lucide-react";
import Link from "next/link";

export default function WeatherPage() {
  const { cityId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [forecastRecommendations, setForecastRecommendations] = useState<any[]>([]);
  const [activityType, setActivityType] = useState<ActivityType>("walk");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Загрузка данных о погоде и рекомендаций
  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Получаем данные о погоде и рекомендации через API
        const weatherResponse = await fetch(`/api/weather/current/${cityId}`);
        if (!weatherResponse.ok) {
          throw new Error("Ошибка при получении данных о погоде");
        }
        const currentWeather = await weatherResponse.json();

        // Получаем прогноз погоды
        const forecastResponse = await fetch(`/api/weather/forecast/${cityId}?days=3`);
        if (!forecastResponse.ok) {
          throw new Error("Ошибка при получении прогноза погоды");
        }
        const forecast = await forecastResponse.json();

        // Получаем рекомендации по одежде
        const recommendationsResponse = await fetch(
          `src/app/api/recommendations/forecast/${cityId}?activity_type=${activityType}`
        );
        if (!recommendationsResponse.ok) {
          throw new Error("Ошибка при получении рекомендаций");
        }
        const recommendationsData = await recommendationsResponse.json();

        // Загружаем рекомендации для прогноза на будущие дни
        const forecastRecsPromises = forecast.map((dayData: any) =>
          fetch(
            `/api/recommendations/forecast/${cityId}?date=${dayData.date}&activity_type=${activityType}`
          )
            .then((response) => {
              if (!response.ok) return null;
              return response.json();
            })
            .catch(() => null)
        );

        const forecastRecommendationsData = await Promise.all(forecastRecsPromises);

        // Получаем название города из популярных городов или используем ID
        const { POPULAR_CITIES } = await import("@/config/constants");
        const city = POPULAR_CITIES.find((c) => c.id.toString() === (cityId as string));
        setCityName(city ? city.name : `Город с ID ${cityId}`);

        setWeatherData(currentWeather);
        setForecastData(forecast);
        setRecommendations(recommendationsData.recommendations);
        setForecastRecommendations(
          forecastRecommendationsData
            .filter(Boolean)
            .map((item: any) => item?.recommendations || null)
        );
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError("Не удалось загрузить данные о погоде. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
  }, [cityId, activityType]);

  const handleActivityChange = (value: ActivityType) => {
    setActivityType(value);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Повторное получение данных о погоде
    fetch(`/api/weather/current/${cityId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Ошибка при обновлении данных");
        return response.json();
      })
      .then((currentWeather) => {
        setWeatherData(currentWeather);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        console.error("Ошибка обновления данных:", err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад</span>
            </Link>
            {!isLoading && lastUpdated && (
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-all"
                disabled={refreshing}
                aria-label="Обновить данные о погоде"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Обновить</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
              <Skeleton className="h-12 w-1/2 mt-6" />
              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-600">Ошибка</h2>
                  <p className="mt-2">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span>{cityName}</span>
                </h1>
                {lastUpdated && (
                  <div className="text-sm text-muted-foreground">
                    Последнее обновление: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <ActivitySelector defaultValue={activityType} onChange={handleActivityChange} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {weatherData && <WeatherCard weatherData={weatherData} showDetails={true} />}

                {recommendations && (
                  <ClothingRecommendations recommendations={recommendations} />
                )}
              </div>

              <Separator className="my-8" />

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Прогноз на ближайшие дни
                </h2>

                <Tabs defaultValue="weather" className="mt-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="weather">Погода</TabsTrigger>
                    <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weather" className="mt-2 animate-fadeIn">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {forecastData.map((day, index) => (
                        <WeatherCard
                          key={day.date || index}
                          weatherData={day}
                          date={day.date}
                          showDetails={false}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-2 animate-fadeIn">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {forecastData.map((day, index) => {
                        const forecatRec = forecastRecommendations[index];

                        if (forecatRec) {
                          return (
                            <Card key={day.date || index}>
                              <CardContent className="p-4">
                                <h3 className="font-medium text-lg mb-2 border-b pb-1">
                                  {new Date(day.date).toLocaleDateString("ru-RU", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </h3>

                                <div className="space-y-3 text-sm">
                                  {forecatRec.essential && forecatRec.essential.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-primary">
                                        Необходимые вещи:
                                      </h4>
                                      <ul className="pl-2 mt-1 space-y-1">
                                        {forecatRec.essential.slice(0, 3).map((item: string, i: number) => (
                                          <li key={`essential-${i}`} className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary inline-block"></span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {forecatRec.accessories && forecatRec.accessories.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-blue-500">Аксессуары:</h4>
                                      <ul className="pl-2 mt-1 space-y-1">
                                        {forecatRec.accessories.slice(0, 2).map((item: string, i: number) => (
                                          <li key={`acc-${i}`} className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-blue-500 inline-block"></span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        }

                        // Запасной вариант, если нет рекомендаций для конкретного дня
                        return (
                          <Card key={day.date || index}>
                            <CardContent className="p-4">
                              <h3 className="font-medium mb-2">
                                {new Date(day.date).toLocaleDateString("ru-RU", {
                                  weekday: "long",
                                  day: "numeric",
                                })}
                              </h3>
                              <ul className="text-sm space-y-1">
                                <li>
                                  • Верхняя одежда:{" "}
                                  {day.temperature.air.C > 15
                                    ? "легкая куртка или ветровка"
                                    : "куртка"}
                                </li>
                                <li>
                                  • Основная одежда:{" "}
                                  {day.temperature.air.C > 20
                                    ? "легкая одежда"
                                    : "комфортная одежда средней плотности"}
                                </li>
                                {day.precipitation?.type === "rain" && (
                                  <li className="text-blue-500">• Не забудьте зонт</li>
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
