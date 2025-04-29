"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/lib/hooks";
import { Thermometer, Wind, Droplets, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Типы для пользовательских предпочтений
export interface UserPreferences {
  temperatureSensitivity: number; // от -2 до 2, где -2 - мерзнет, 2 - жарко
  rainProtection: number; // от 0 до 2, 0 - игнорировать, 2 - максимальная защита
  windProtection: number; // от 0 до 2, 0 - игнорировать, 2 - максимальная защита
  formalStyle: boolean; // формальный стиль одежды
  limitedMobility: boolean; // ограниченная подвижность, учитывать для рекомендаций
}

// Значения по умолчанию
const defaultPreferences: UserPreferences = {
  temperatureSensitivity: 0,
  rainProtection: 1,
  windProtection: 1,
  formalStyle: false,
  limitedMobility: false
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    "user-clothing-preferences",
    defaultPreferences
  );

  return {
    preferences,
    setPreferences,
    resetPreferences: () => setPreferences(defaultPreferences)
  };
}

interface UserPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserPreferencesPanel({ isOpen, onClose }: UserPreferencesProps) {
  const { preferences, setPreferences, resetPreferences } = useUserPreferences();
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  // Обновляем локальные предпочтения при изменении глобальных
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Применяем изменения
  const applyChanges = () => {
    setPreferences(localPreferences);
    onClose();
  };

  // Сбрасываем значения и закрываем панель
  const resetAndClose = () => {
    resetPreferences();
    onClose();
  };

  const getSensitivityLabel = (value: number) => {
    switch (value) {
      case -2: return "Сильно мерзну";
      case -1: return "Немного мерзну";
      case 0: return "Нейтрально";
      case 1: return "Немного жарко";
      case 2: return "Очень жарко";
      default: return "Нейтрально";
    }
  };

  const getProtectionLabel = (value: number) => {
    switch (value) {
      case 0: return "Игнорировать";
      case 1: return "Средняя";
      case 2: return "Максимальная";
      default: return "Средняя";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="text-2xl">Персональные настройки</CardTitle>
            <CardDescription>Настройте рекомендации по одежде под свои предпочтения</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature-sensitivity" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  Чувствительность к температуре
                </Label>
                <span className="text-sm font-medium">
                  {getSensitivityLabel(localPreferences.temperatureSensitivity)}
                </span>
              </div>
              <Slider
                id="temperature-sensitivity"
                min={-2}
                max={2}
                step={1}
                value={[localPreferences.temperatureSensitivity]}
                onValueChange={(value) => setLocalPreferences(prev => ({
                  ...prev,
                  temperatureSensitivity: value[0]
                }))}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Мерзну</span>
                <span>Нейтрально</span>
                <span>Жарко</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rain-protection" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Защита от дождя
                </Label>
                <span className="text-sm font-medium">
                  {getProtectionLabel(localPreferences.rainProtection)}
                </span>
              </div>
              <Slider
                id="rain-protection"
                min={0}
                max={2}
                step={1}
                value={[localPreferences.rainProtection]}
                onValueChange={(value) => setLocalPreferences(prev => ({
                  ...prev,
                  rainProtection: value[0]
                }))}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Игнорировать</span>
                <span>Средняя</span>
                <span>Максимальная</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="wind-protection" className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  Защита от ветра
                </Label>
                <span className="text-sm font-medium">
                  {getProtectionLabel(localPreferences.windProtection)}
                </span>
              </div>
              <Slider
                id="wind-protection"
                min={0}
                max={2}
                step={1}
                value={[localPreferences.windProtection]}
                onValueChange={(value) => setLocalPreferences(prev => ({
                  ...prev,
                  windProtection: value[0]
                }))}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Игнорировать</span>
                <span>Средняя</span>
                <span>Максимальная</span>
              </div>
            </div>

            <div className="flex flex-col space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="formal-style" className="flex items-center gap-2 cursor-pointer">
                  Формальный стиль одежды
                </Label>
                <Switch
                  id="formal-style"
                  checked={localPreferences.formalStyle}
                  onCheckedChange={(checked) => setLocalPreferences(prev => ({
                    ...prev,
                    formalStyle: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="limited-mobility" className="flex items-center gap-2 cursor-pointer">
                  Ограниченная подвижность
                </Label>
                <Switch
                  id="limited-mobility"
                  checked={localPreferences.limitedMobility}
                  onCheckedChange={(checked) => setLocalPreferences(prev => ({
                    ...prev,
                    limitedMobility: checked
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={resetAndClose}
            >
              Сбросить
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button
                onClick={applyChanges}
              >
                Применить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PreferencesButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-4 w-4" />
        <span>Настройки</span>
      </Button>

      <UserPreferencesPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
