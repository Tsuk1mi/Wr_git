import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы - WeatherWear",
  description: "Ответы на часто задаваемые вопросы о сервисе WeatherWear",
};

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h1>
          <Separator className="my-4" />

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Как работает WeatherWear?</h2>
              <p className="text-muted-foreground">
                WeatherWear анализирует данные о погоде в выбранном городе и предлагает рекомендации
                по одежде, которая подойдет для текущих погодных условий. Вы можете выбрать тип
                активности (прогулка, спорт, работа, отдых), и рекомендации будут адаптированы под ваши потребности.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Откуда берутся данные о погоде?</h2>
              <p className="text-muted-foreground">
                Мы используем данные нескольких метеорологических сервисов для обеспечения
                максимальной точности прогнозов. Основным источником данных являются
                метеорологические API, которые обновляют информацию каждый час.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Как формируются рекомендации по одежде?</h2>
              <p className="text-muted-foreground">
                Наши рекомендации основаны на анализе погодных условий: температуры, влажности,
                скорости ветра, осадков и УФ-индекса. Мы учитываем, как эти факторы влияют на
                ощущаемую температуру и комфорт человека в разных типах одежды. Рекомендации также
                адаптируются под тип вашей активности.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Что делать, если моего города нет в списке?</h2>
              <p className="text-muted-foreground">
                Воспользуйтесь поиском на главной странице. Мы поддерживаем тысячи городов по всему
                миру. Если ваш город действительно отсутствует, напишите нам через форму обратной
                связи, и мы добавим его в базу.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">WeatherWear бесплатен для использования?</h2>
              <p className="text-muted-foreground">
                Да, базовые функции WeatherWear доступны бесплатно для всех пользователей.
                В будущем мы планируем добавить премиум-возможности с расширенной персонализацией
                и дополнительными функциями для подписчиков.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Как я могу предложить улучшения для сервиса?</h2>
              <p className="text-muted-foreground">
                Мы всегда открыты для предложений! Вы можете отправить нам свои идеи и отзывы через
                страницу обратной связи. Мы внимательно читаем все сообщения и учитываем
                пожелания пользователей при разработке новых функций.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
