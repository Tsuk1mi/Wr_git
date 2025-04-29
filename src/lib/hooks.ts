"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Хук для работы с localStorage с типизацией
 * @param key Ключ для хранения значения
 * @param initialValue Начальное значение
 * @returns [value, setValue] - тьюпл со значением и функцией изменения
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Получаем значение из localStorage или используем начальное значение
  const readValue = useCallback((): T => {
    // Проверяем, доступен ли localStorage
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Ошибка чтения localStorage ключа "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // Состояние для хранения текущего значения
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Инициализируем состояние из localStorage при монтировании
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Возвращаем функцию, которая обновляет состояние и localStorage
  const setValue = useCallback(
    (value: T) => {
      // Проверяем, доступен ли localStorage
      if (typeof window === "undefined") {
        console.warn(`Не удалось сохранить "${key}" в localStorage, window is undefined.`);
        return;
      }

      try {
        // Сохраняем в состояние
        setStoredValue(value);

        // Сохраняем в localStorage
        window.localStorage.setItem(key, JSON.stringify(value));

        // Вызываем событие изменения localStorage, чтобы уведомить другие компоненты
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`Ошибка сохранения "${key}" в localStorage:`, error);
      }
    },
    [key]
  );

  // Синхронизируем значение при изменении localStorage в других вкладках
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Прослушиваем событие storage
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}

/**
 * Хук для отслеживания состояния медиа-запроса
 * @param query Медиа-запрос, например "(max-width: 768px)"
 * @returns boolean - результат медиа-запроса
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Хук для определения устройства пользователя
 * @returns Object с информацией об устройстве
 */
export function useDevice() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return { isMobile, isTablet, isDesktop };
}

/**
 * Хук для обнаружения режима темной темы у пользователя
 * @returns boolean - использует ли пользователь темную тему
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}
