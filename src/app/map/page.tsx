"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LoaderCircle } from "lucide-react";

// Динамически загружаем компонент карты на стороне клиента (без SSR)
const WeatherMap = dynamic(() => import("@/components/weather-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[70vh] bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Загрузка карты погоды...</p>
      </div>
    </div>
  ),
});

const mapLayers = [
  { id: "temp_new", name: "Температура" },
  { id: "precipitation_new", name: "Осадки" },
  { id: "clouds_new", name: "Облачность" },
  { id: "wind_new", name: "Ветер" },
  { id: "pressure_new", name: "Давление" },
];

export default function WeatherMapPage() {
  const [activeLayer, setActiveLayer] = useState("temp_new");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки карты
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-6 space-y-6">
      {/* Навигация */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Вернуться на главную
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">Карта погоды</CardTitle>
          <p className="text-muted-foreground">
            Интерактивная карта погоды с различными слоями данных
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs
            value={activeLayer}
            onValueChange={setActiveLayer}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 mb-6">
              {mapLayers.map((layer) => (
                <TabsTrigger
                  key={layer.id}
                  value={layer.id}
                  className="data-[state=active]:bg-primary/10"
                >
                  {layer.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Отображаем карту для активного слоя */}
            <WeatherMap layer={activeLayer} />
          </Tabs>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Карта отображает данные в реальном времени на основе данных OpenWeather.</p>
            <p className="mt-2">
              Вы можете переключать слои карты и использовать элементы управления для навигации по карте.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
