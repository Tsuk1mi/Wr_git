"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import { Home, Info, MessageSquare, GitCompare, Map, Menu, X, Heart, Search } from "lucide-react";
import CitySearch from "./city-search";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import FavoriteCities from "./favorite-cities";
import { getFavoriteCities } from "@/lib/favorites";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);

  // Эффект для отслеживания скролла страницы
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Проверяем наличие избранных городов
  useEffect(() => {
    const favorites = getFavoriteCities();
    setHasFavorites(favorites.length > 0);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur shadow-sm" : "bg-background"
      } supports-[backdrop-filter]:bg-background/60`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-auto w-auto">
              <Image
                src="/images/logo.png"
                alt="WeatherWear Logo"
                width={128}
                height={128}
                className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight select-none bg-gradient-to-r from-blue-600 to-sky-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-sky-400">
                Weather
              </span>
              <span className="font-extrabold text-xl tracking-tight select-none bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text dark:from-green-400 dark:to-teal-400 -mt-1">
                Clothing
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base font-semibold flex-1">
          <Link
            href="/"
            className="nav-link flex items-center gap-1.5"
          >
            <Home className="h-5 w-5" />
            <span>Главная</span>
            {isActive("/") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-fadeIn" />
            )}
          </Link>
          <Link
            href="/map"
            className="nav-link flex items-center gap-1.5"
          >
            <Map className="h-5 w-5" />
            <span>Карта</span>
            {isActive("/map") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-fadeIn" />
            )}
          </Link>
          <Link
            href="/compare"
            className="nav-link flex items-center gap-1.5"
          >
            <GitCompare className="h-5 w-5" />
            <span>Сравнение</span>
            {isActive("/compare") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-fadeIn" />
            )}
          </Link>
          <Link
            href="/feedback"
            className="nav-link flex items-center gap-1.5"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Отзывы</span>
            {isActive("/feedback") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-fadeIn" />
            )}
          </Link>
          <Link
            href="/faq"
            className="nav-link flex items-center gap-1.5"
          >
            <Info className="h-5 w-5" />
            <span>FAQ</span>
            {isActive("/faq") && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-fadeIn" />
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex flex-1 justify-end mr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Переключить меню"
            className="h-10 w-10"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 animate-scale-in" />
            ) : (
              <Menu className="h-6 w-6 animate-scale-in" />
            )}
          </Button>
        </div>

        {/* Search and Theme Toggle */}
        <div className="flex flex-1 items-center justify-end space-x-3">
          <div className="hidden sm:flex w-full max-w-[220px] relative">
            <CitySearch minimal={true} />
            {hasFavorites && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-10 top-0 h-10 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                onClick={() => setShowFavorites(!showFavorites)}
                title={showFavorites ? "Скрыть избранное" : "Показать избранное"}
              >
                <Heart className={`h-5 w-5 text-red-500 transition-all ${showFavorites ? 'fill-red-500 scale-110' : ''}`} />
              </Button>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Выпадающий список избранных городов */}
      {showFavorites && (
        <div className="absolute right-4 top-16 w-72 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <div className="glassmorphism rounded-xl overflow-hidden">
            <FavoriteCities
              limit={5}
              onSelect={() => setShowFavorites(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-slide-in-left">
          <nav className="container flex flex-col py-4 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-6 w-6 text-blue-500" />
              <span className={isActive("/") ? "font-semibold" : ""}>Главная</span>
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Map className="h-6 w-6 text-emerald-500" />
              <span className={isActive("/map") ? "font-semibold" : ""}>Карта</span>
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitCompare className="h-6 w-6 text-purple-500" />
              <span className={isActive("/compare") ? "font-semibold" : ""}>Сравнение</span>
            </Link>
            <Link
              href="/feedback"
              className="flex items-center gap-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <span className={isActive("/feedback") ? "font-semibold" : ""}>Отзывы</span>
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-3 p-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-6 w-6 text-amber-500" />
              <span className={isActive("/faq") ? "font-semibold" : ""}>FAQ</span>
            </Link>
            <div className="p-3">
              <div className="relative">
                <CitySearch minimal={false} />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            {hasFavorites && (
              <div className="p-3">
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted/50 py-2 px-3 flex items-center gap-2 border-b">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Избранные города</span>
                  </div>
                  <FavoriteCities
                    limit={3}
                    onSelect={() => setMobileMenuOpen(false)}
                  />
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
