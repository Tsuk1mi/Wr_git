"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Locate,
  ZoomIn,
  ZoomOut,
  Info,
  Layers,
  X,
  Map as MapIcon
} from "lucide-react";

interface WeatherMapProps {
  layer: string;
  width?: string;
  height?: string;
  zoom?: number;
  lat?: number;
  lon?: number;
}

export default function WeatherMap({
  layer = "temp_new",
  width = "100%",
  height = "70vh",
  zoom = 4,
  lat = 55.7558,
  lon = 37.6173
}: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [layersOpen, setLayersOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<{lat: number, lon: number, name?: string} | null>(null);
  const [locationWeather, setLocationWeather] = useState<any>(null);

  // Загружаем карту OpenLayers при монтировании компонента
  useEffect(() => {
    let map: any;

    // Динамически загружаем OpenLayers
    const loadMap = async () => {
      try {
        // Проверяем, загружена ли библиотека
        if (typeof window !== 'undefined' && !window.ol) {
          // Загружаем стили OpenLayers
          const linkEl = document.createElement('link');
          linkEl.rel = 'stylesheet';
          linkEl.href = 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/ol.css';
          document.head.appendChild(linkEl);

          // Загружаем скрипт OpenLayers
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/dist/ol.js';
          script.async = true;

          // Ждем загрузки скрипта
          await new Promise((resolve) => {
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }

        // Создаем карту, когда OpenLayers загружен
        if (window.ol && mapRef.current) {
          const { Map, View, Overlay } = window.ol;
          const { Tile, Vector } = window.ol.layer;
          const { OSM, XYZ, Vector: VectorSource } = window.ol.source;
          const { fromLonLat, toLonLat } = window.ol.proj;
          const { Point } = window.ol.geom;
          const { Feature } = window.ol;
          const { Style, Icon, Fill, Stroke, Text } = window.ol.style;

          // Создаем базовый слой OpenStreetMap
          const osmLayer = new Tile({
            source: new OSM({
              attributions: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            }),
            visible: true,
            zIndex: 0
          });

          // Создаем слой данных о погоде
          const weatherLayer = new Tile({
            source: new XYZ({
              url: `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=92bd556782d315772d2adc1076a51af5`,
              attributions: 'Weather data © <a href="https://openweathermap.org/">OpenWeather</a>',
              tileSize: 256
            }),
            visible: true,
            zIndex: 1
          });

          // Создаем и настраиваем карту
          map = new Map({
            target: mapRef.current,
            layers: [osmLayer, weatherLayer],
            view: new View({
              center: fromLonLat([lon, lat]),
              zoom: zoom,
              maxZoom: 19,
              minZoom: 2
            }),
            controls: []
          });

          // Добавляем обработчик клика на карту
          map.on('click', async (evt: any) => {
            const coordinate = evt.coordinate;
            const lonLat = toLonLat(coordinate);
            const clickedLon = lonLat[0];
            const clickedLat = lonLat[1];

            try {
              // Запрос на получение данных о погоде в точке клика
              const response = await fetch(`/api/weather/current/coordinates?lat=${clickedLat.toFixed(4)}&lon=${clickedLon.toFixed(4)}`);
              if (response.ok) {
                const data = await response.json();

                // Отображаем информацию о месте и погоде
                setHoveredLocation({
                  lat: clickedLat,
                  lon: clickedLon,
                  name: data.name || `Координаты: ${clickedLat.toFixed(2)}, ${clickedLon.toFixed(2)}`
                });
                setLocationWeather(data);
                setInfoOpen(true);
              }
            } catch (error) {
              console.error("Error fetching location weather:", error);
            }
          });

          // Обработчик события изменения зума
          map.getView().on('change:resolution', () => {
            setCurrentZoom(Math.round(map.getView().getZoom()));
          });

          setMapInstance(map);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    loadMap();

    // Очистка при размонтировании
    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [lat, lon, zoom]);

  // Обновляем слой карты при изменении параметра layer
  useEffect(() => {
    if (mapInstance && isLoaded) {
      const { XYZ } = window.ol.source;
      const weatherLayer = mapInstance.getLayers().getArray()[1];

      weatherLayer.setSource(
        new XYZ({
          url: `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=92bd556782d315772d2adc1076a51af5`,
          attributions: 'Weather data © <a href="https://openweathermap.org/">OpenWeather</a>',
          tileSize: 256
        })
      );
    }
  }, [layer, mapInstance, isLoaded]);

  // Функция для приближения карты
  const handleZoomIn = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      view.animate({
        zoom: view.getZoom() + 1,
        duration: 300
      });
    }
  };

  // Функция для отдаления карты
  const handleZoomOut = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      view.animate({
        zoom: view.getZoom() - 1,
        duration: 300
      });
    }
  };

  // Функция для определения местоположения пользователя
  const handleLocate = () => {
    if (mapInstance && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const { fromLonLat } = window.ol.proj;

          mapInstance.getView().animate({
            center: fromLonLat([longitude, latitude]),
            zoom: 10,
            duration: 1000
          });

          // Запрашиваем данные о погоде для текущей геолокации
          fetch(`/api/weather/current/coordinates?lat=${latitude.toFixed(4)}&lon=${longitude.toFixed(4)}`)
            .then(response => response.json())
            .then(data => {
              setHoveredLocation({
                lat: latitude,
                lon: longitude,
                name: data.name || `Ваше местоположение`
              });
              setLocationWeather(data);
              setInfoOpen(true);
            })
            .catch(error => {
              console.error("Error fetching location weather:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Функция для отображения описания слоев
  const getLayerDescription = (layerId: string) => {
    switch(layerId) {
      case 'temp_new': return 'Температура воздуха на карте представлена с помощью цветовой шкалы от синего (холодно) до красного (жарко).';
      case 'precipitation_new': return 'Интенсивность осадков с цветовой шкалой от светло-голубого (слабый дождь/снег) до фиолетового (сильные осадки).';
      case 'clouds_new': return 'Процент облачности отображается от белого (чистое небо) до темно-серого (полностью облачно).';
      case 'wind_new': return 'Скорость ветра показана от светло-зеленого (легкий ветерок) до темно-оранжевого (сильный ветер).';
      case 'pressure_new': return 'Атмосферное давление представлено от фиолетового (низкое) до желтого (высокое).';
      default: return 'Информация о данном слое отсутствует.';
    }
  };

  return (
    <div className="relative">
      {/* Карта */}
      <div
        ref={mapRef}
        style={{ width, height }}
        className="rounded-md overflow-hidden border"
      />

      {/* Элементы управления картой */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/90 shadow hover:bg-background"
          onClick={handleZoomIn}
          title="Приблизить"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/90 shadow hover:bg-background"
          onClick={handleZoomOut}
          title="Отдалить"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/90 shadow hover:bg-background"
          onClick={handleLocate}
          title="Мое местоположение"
        >
          <Locate className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-background/90 shadow hover:bg-background"
          onClick={() => setLayersOpen(!layersOpen)}
          title="Информация о слоях"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Индикатор зума */}
      <div className="absolute bottom-4 left-4 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium">
        Масштаб: {currentZoom}
      </div>

      {/* Информация о слоях */}
      {layersOpen && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-sm border animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium flex items-center gap-1.5">
              <MapIcon className="h-4 w-4 text-primary" /> Информация о слоях
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLayersOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mb-3 text-muted-foreground">
            Текущий слой: <span className="font-medium">{
              layer === 'temp_new' ? 'Температура' :
              layer === 'precipitation_new' ? 'Осадки' :
              layer === 'clouds_new' ? 'Облачность' :
              layer === 'wind_new' ? 'Ветер' :
              layer === 'pressure_new' ? 'Давление' : layer
            }</span>
          </p>
          <div className="text-sm space-y-2">
            <p>{getLayerDescription(layer)}</p>
            <p className="text-xs text-muted-foreground mt-3">Клик по карте покажет подробную информацию о погоде в выбранной точке.</p>
          </div>
        </div>
      )}

      {/* Информация о погоде в точке */}
      {infoOpen && locationWeather && (
        <div className="absolute bottom-14 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-md shadow-lg max-w-sm border animate-in fade-in slide-in-from-right duration-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-1.5">
              <Info className="h-4 w-4 text-primary" /> {hoveredLocation?.name || "Информация о погоде"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setInfoOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <p className="flex items-center gap-1 text-muted-foreground">Температура:</p>
              <p className="font-medium">{locationWeather.temperature?.air?.C}°C</p>

              <p className="flex items-center gap-1 text-muted-foreground">Ощущается как:</p>
              <p className="font-medium">{locationWeather.temperature?.comfort?.C}°C</p>

              <p className="flex items-center gap-1 text-muted-foreground">Влажность:</p>
              <p className="font-medium">{locationWeather.humidity}%</p>

              <p className="flex items-center gap-1 text-muted-foreground">Ветер:</p>
              <p className="font-medium">{locationWeather.wind?.speed} м/с, {locationWeather.wind?.direction}</p>

              {locationWeather.precipitation && (
                <>
                  <p className="flex items-center gap-1 text-muted-foreground">Осадки:</p>
                  <p className="font-medium">
                    {locationWeather.precipitation.type === 'rain' && 'Дождь'}
                    {locationWeather.precipitation.type === 'snow' && 'Снег'}
                    {locationWeather.precipitation.type === 'none' && 'Нет'}
                    {locationWeather.precipitation.type !== 'none' && `, ${locationWeather.precipitation.intensity} мм/ч`}
                  </p>
                </>
              )}

              {locationWeather.pressure && (
                <>
                  <p className="flex items-center gap-1 text-muted-foreground">Давление:</p>
                  <p className="font-medium">{locationWeather.pressure.mm} мм рт.ст.</p>
                </>
              )}
            </div>

            <div className="text-xs text-muted-foreground mt-3">
              <p>Координаты: {hoveredLocation?.lat.toFixed(4)}, {hoveredLocation?.lon.toFixed(4)}</p>
              {locationWeather.description && (
                <p className="font-medium mt-1">{locationWeather.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
