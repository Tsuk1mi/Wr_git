"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Navigation } from "lucide-react";
import { useState } from "react";

interface GeoLocationButtonProps {
  variant?: "outline" | "default" | "secondary";
  size?: "icon" | "default" | "sm" | "lg";
  className?: string;
  buttonText?: string;
  iconSize?: number;
  iconColor?: string;
}

export default function GeoLocationButton({
  variant = "outline",
  size = "default",
  className = "",
  buttonText = "Моё местоположение",
  iconSize = 8,
  iconColor = "text-cyan-500"
}: GeoLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeolocation = () => {
    if (!('geolocation' in navigator)) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.location.href = `/api/weather/current/coordinates?lat=${latitude.toFixed(4)}&lon=${longitude.toFixed(4)}&redirect=true`;
      },
      (error) => {
        console.error("Ошибка геолокации:", error);
        let errorMessage = "Не удалось определить местоположение.";

        if (error.code === 1) {
          errorMessage = "Доступ к геолокации запрещен. Пожалуйста, разрешите доступ к вашему местоположению.";
        } else if (error.code === 2) {
          errorMessage = "Информация о местоположении недоступна.";
        } else if (error.code === 3) {
          errorMessage = "Время ожидания определения местоположения истекло.";
        }

        alert(errorMessage);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleGeolocation}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className={`h-${iconSize} w-${iconSize} animate-spin`} />
      ) : (
        <Navigation className={`h-${iconSize} w-${iconSize} ${iconColor}`} />
      )}
      {buttonText && <span>{buttonText}</span>}
    </Button>
  );
}
