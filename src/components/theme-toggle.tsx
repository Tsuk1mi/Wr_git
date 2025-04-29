import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, SunMoon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Hydration fix - монтируем компонент только на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Переключить тему"
      className={`relative overflow-hidden ${
        theme === "dark"
          ? "hover:bg-blue-50 dark:hover:bg-blue-900/20"
          : "hover:bg-amber-50 dark:hover:bg-amber-900/20"
      } transition-colors duration-300`}
    >
      {/* Абсолютно позиционированный индикатор для создания эффекта свечения */}
      <span
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-blue-400/10 dark:bg-blue-400/5"
            : "bg-amber-400/10 dark:bg-amber-400/5"
        } opacity-0 ${
          isHovered ? "opacity-100" : ""
        } transition-opacity duration-300 rounded-full`}
      />

      {/* Анимированная иконка */}
      <div className="relative z-10 w-5 h-5 flex items-center justify-center">
        {theme === "dark" ? (
          <div className="animate-scale-in">
            <Sun className="h-5 w-5 text-blue-500 animate-pulse-soft" />
          </div>
        ) : (
          <div className="animate-scale-in">
            <Moon className="h-5 w-5 text-amber-500" />
          </div>
        )}
      </div>

      {/* Текстовая метка (видна только при наведении) */}
      <span
        className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
          theme === "dark" ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
        } opacity-0 ${isHovered ? "opacity-100" : ""} transition-opacity duration-300`}
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </span>
    </Button>
  );
}
