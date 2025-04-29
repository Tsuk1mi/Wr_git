"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CloudSun, Compass, Wind, Thermometer, Map, Sun, PanelTopOpen, Navigation } from "lucide-react";
import GeoLocationButton from "@/components/geo-location-button";
import { POPULAR_CITIES } from "@/config/constants";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/hooks";
import { City } from "@/types";
import api from "@/lib/api";

export default function HomepageClient() {
  const [hasCheckedGeoLocation, setHasCheckedGeoLocation] = useLocalStorage('hasCheckedGeoLocation', false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  // Автоматическое определение местоположения при первом посещении
  useEffect(() => {
    if (!hasCheckedGeoLocation && 'geolocation' in navigator) {
      setIsCheckingLocation(true);

      const geoLocationTimer = setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const weatherData = await api.getWeatherByCoordinates(latitude, longitude);

              if (weatherData && weatherData.id) {
                window.location.href = `/weather/${weatherData.id}`;
              }
            } catch (error) {
              console.error("Ошибка при автоматическом определении местоположения:", error);
            } finally {
              setHasCheckedGeoLocation(true);
              setIsCheckingLocation(false);
            }
          },
          (error) => {
            console.log("Пользователь отклонил геолокацию или произошла ошибка:", error);
            setHasCheckedGeoLocation(true);
            setIsCheckingLocation(false);
          },
          { timeout: 5000, maximumAge: 0 }
        );
      }, 1500); // Задержка для загрузки страницы

      return () => clearTimeout(geoLocationTimer);
    }
  }, [hasCheckedGeoLocation, setHasCheckedGeoLocation]);

  return (
    <>
      {/* Секция с кнопками быстрого доступа */}
      <section className="w-full py-8 bg-gradient-to-b from-white to-blue-50 dark:from-zinc-900 dark:to-zinc-800/80">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/map">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 transition-all hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/30"
              >
                <Map className="h-8 w-8 text-blue-500" />
                <span>Карта погоды</span>
              </Button>
            </Link>
            <Link href="/weather/4368">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 transition-all hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30"
              >
                <CloudSun className="h-8 w-8 text-green-500" />
                <span>Текущая погода</span>
              </Button>
            </Link>
            <GeoLocationButton
              className="w-full h-24 flex flex-col items-center justify-center gap-2 transition-all hover:bg-cyan-50 hover:border-cyan-300 dark:hover:bg-cyan-950/30"
              buttonText="Моё местоположение"
            />
            <Link href="/compare">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 transition-all hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30"
              >
                <PanelTopOpen className="h-8 w-8 text-purple-500" />
                <span>Сравнение городов</span>
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 transition-all hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/30"
              >
                <Sun className="h-8 w-8 text-amber-500" />
                <span>Частые вопросы</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Популярные города */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 text-center mb-10">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Популярные города
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Выберите город из списка популярных или воспользуйтесь поиском выше
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {POPULAR_CITIES.map((city) => (
              <Link key={city.id} href={`/weather/${city.id}`}>
                <Button
                  variant="outline"
                  className="w-full h-14 text-base hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/30 dark:hover:text-sky-400 transition-all"
                >
                  {city.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
