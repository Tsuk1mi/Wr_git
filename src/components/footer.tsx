import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, MapPin, Mail, Phone, CloudSun } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Информация о компании */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <Image
                src="/images/logo.png"
                alt="WeatherWear Logo"
                width={60}
                height={60}
                className="animate-pulse-soft drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-sky-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-sky-400">
                  Weather
                </span>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text dark:from-green-400 dark:to-teal-400 -mt-1">
                  Clothing
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Получайте точные рекомендации по одежде, основанные на текущей погоде и вашей активности
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                href="/map"
                className="text-sm px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                <CloudSun className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                Карта погоды
              </Link>
              <Link
                href="/compare"
                className="text-sm px-4 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                Сравнение
              </Link>
            </div>
          </div>

          {/* Навигация */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-medium text-lg mb-5 relative">
              Навигация
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary/70"></span>
            </h3>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Главная
              </Link>
              <Link
                href="/map"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Карта погоды
              </Link>
              <Link
                href="/compare"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Сравнение городов
              </Link>
              <Link
                href="/faq"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                FAQ
              </Link>
              <Link
                href="/feedback"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Отзывы
              </Link>
            </div>
          </div>

          {/* Правовая информация */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-medium text-lg mb-5 relative">
              Правовая информация
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary/70"></span>
            </h3>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Условия использования
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Политика конфиденциальности
              </Link>
              <Link
                href="/licenses"
                className="hover:text-foreground transition-colors hover:translate-x-1 transform duration-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-70"></span>
                Лицензии
              </Link>
            </div>
          </div>

          {/* Контакты */}
          <div className="flex flex-col items-center md:items-start md:col-span-3 lg:col-span-1">
            <h3 className="font-medium text-lg mb-5 relative">
              Контакты
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary/70"></span>
            </h3>
            <div className="grid gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Москва, ул. Погодная, 14</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span>info@weatherwear.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-8 h-8 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>+7 (495) 123-45-67</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm text-muted-foreground mb-6 md:mb-0">
            &copy; {new Date().getFullYear()} WeatherWear. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Посетить GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Посетить Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
