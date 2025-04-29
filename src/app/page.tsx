import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CitySearch from "@/components/city-search";
import { CloudSun, Compass, Wind, Thermometer, Droplets, Map, Sun, PanelTopOpen } from "lucide-react";
import HomepageClient from "./homepage-client";

export const metadata: Metadata = {
  title: "Weather & Clothing - Прогноз погоды с рекомендациями по одежде",
  description: "Получите актуальный прогноз погоды и персонализированные рекомендации по одежде для вашего региона",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Героический раздел с градиентным фоном */}
        <section className="relative w-full overflow-hidden py-16 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-zinc-900 dark:to-zinc-800">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
            <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-indigo-400 blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-sky-400 blur-3xl animate-pulse" />
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-blue-600 to-sky-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-sky-400">
                  Weather & Clothing
                </h1>
                <p className="mx-auto max-w-[800px] text-zinc-700 md:text-xl dark:text-zinc-300">
                  Узнайте, какая погода ожидается и получите персонализированные рекомендации по одежде для максимального комфорта
                </p>
              </div>
              <div className="w-full max-w-md space-y-4 mt-8">
                <CitySearch />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Найдите свой город и получите точный прогноз</p>
              </div>
            </div>
          </div>
        </section>

        {/* Клиентские компоненты с интерактивностью */}
        <HomepageClient />

        {/* Секция "Почему выбирают нас" с иконками */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold leading-tight">
                Почему выбирают Weather & Clothing
              </h2>
              <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
                Наш сервис не просто показывает погоду, но и помогает вам подготовиться к ней
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center p-6 text-center hover:bg-blue-50/50 rounded-xl transition-colors dark:hover:bg-blue-900/10">
                <div className="mb-4 bg-blue-100 p-3 rounded-full dark:bg-blue-900/40">
                  <Thermometer className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Точные данные</h3>
                <p className="text-muted-foreground">Получайте актуальную информацию о погоде на основе OpenWeatherMap API</p>
              </div>

              <div className="flex flex-col items-center p-6 text-center hover:bg-green-50/50 rounded-xl transition-colors dark:hover:bg-green-900/10">
                <div className="mb-4 bg-green-100 p-3 rounded-full dark:bg-green-900/40">
                  <CloudSun className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Прогноз на неделю</h3>
                <p className="text-muted-foreground">Планируйте свою неделю заранее с детальным прогнозом погоды</p>
              </div>

              <div className="flex flex-col items-center p-6 text-center hover:bg-purple-50/50 rounded-xl transition-colors dark:hover:bg-purple-900/10">
                <div className="mb-4 bg-purple-100 p-3 rounded-full dark:bg-purple-900/40">
                  <Compass className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Рекомендации по одежде</h3>
                <p className="text-muted-foreground">Узнайте, что надеть в зависимости от погоды и вашей активности</p>
              </div>

              <div className="flex flex-col items-center p-6 text-center hover:bg-amber-50/50 rounded-xl transition-colors dark:hover:bg-amber-900/10">
                <div className="mb-4 bg-amber-100 p-3 rounded-full dark:bg-amber-900/40">
                  <Wind className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Ощущаемая температура</h3>
                <p className="text-muted-foreground">Учитываем ветер, влажность и другие факторы для точных рекомендаций</p>
              </div>
            </div>
          </div>
        </section>

        {/* Как это работает - секция с шагами */}
        <section className="w-full py-16 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Как это работает
              </h2>
              <p className="max-w-[85%] text-muted-foreground sm:text-lg">
                Weather & Clothing предоставляет не только точный прогноз погоды, но и рекомендации по подбору одежды в зависимости от погодных условий и вашей активности
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-background rounded-xl p-8 shadow-sm border relative transform transition-transform hover:scale-105">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold">1</div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-center mb-4">Выберите город</h3>
                  <p className="text-muted-foreground text-center">
                    Введите название вашего города или выберите из списка популярных городов
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-xl p-8 shadow-sm border relative transform transition-transform hover:scale-105">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold">2</div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-center mb-4">Уточните активность</h3>
                  <p className="text-muted-foreground text-center">
                    Выберите тип вашей активности: прогулка, спорт, работа или отдых
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-xl p-8 shadow-sm border relative transform transition-transform hover:scale-105">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold">3</div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-center mb-4">Получите рекомендации</h3>
                  <p className="text-muted-foreground text-center">
                    Мы покажем актуальный прогноз погоды и посоветуем, как одеться для максимального комфорта
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
