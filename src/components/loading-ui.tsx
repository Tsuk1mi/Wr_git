"use client";

import { cn } from "@/lib/utils";
import { Loader2, Cloud, Thermometer, CloudRain, Sun } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizes[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function WeatherLoadingPlaceholder() {
  const [loadingStage, setLoadingStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const loadingMessages = [
    "Проверяем погоду...",
    "Анализируем температуру...",
    "Оцениваем осадки...",
    "Готовим рекомендации..."
  ];

  const loadingIcons = [
    <Cloud key="cloud" className="text-blue-500 animate-pulse" />,
    <Thermometer key="thermometer" className="text-red-500 animate-pulse" />,
    <CloudRain key="rain" className="text-cyan-500 animate-pulse" />,
    <Sun key="sun" className="text-amber-500 animate-pulse" />
  ];

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="h-16 w-16 flex items-center justify-center">
        {loadingIcons[loadingStage]}
      </div>
      <p className="text-center min-h-6">
        {loadingMessages[loadingStage]}
      </p>
    </div>
  );
}

interface WeatherCardSkeletonProps {
  count?: number;
}

export function WeatherCardSkeleton({ count = 1 }: WeatherCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg p-6 border shadow-sm animate-pulse-slow"
        >
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-12 w-[80px] mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-[80px] rounded-md" />
            <Skeleton className="h-8 w-[80px] rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      <Skeleton className="h-5 w-[250px]" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-[100px] rounded-full" />
        <Skeleton className="h-8 w-[120px] rounded-full" />
        <Skeleton className="h-8 w-[80px] rounded-full" />
        <Skeleton className="h-8 w-[140px] rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-8 w-[90px] rounded-full" />
        <Skeleton className="h-8 w-[110px] rounded-full" />
      </div>
    </div>
  );
}

export function CitySearchSkeleton() {
  return (
    <div className="py-4 space-y-2">
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-8 w-[90px] rounded-md" />
        <Skeleton className="h-8 w-[120px] rounded-md" />
        <Skeleton className="h-8 w-[100px] rounded-md" />
        <Skeleton className="h-8 w-[80px] rounded-md" />
      </div>
    </div>
  );
}
