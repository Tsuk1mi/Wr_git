import { type NextRequest, NextResponse } from 'next/server';

/**
 * API-маршрут для получения текущей погоды по координатам
 * @param request - Запрос с параметрами lat (широта) и lon (долгота)
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const redirect = searchParams.get('redirect') === 'true';

    // Проверяем наличие обязательных параметров
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Требуются параметры lat и lon' },
        { status: 400 }
      );
    }

    // Формируем URL для запроса к бэкенду
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/weather?lat=${lat}&lon=${lon}`);

    // Если ответ от бэкенд-сервиса не успешный
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Ошибка получения данных о погоде' },
        { status: response.status }
      );
    }

    // Обрабатываем данные
    const data = await response.json();

    // Если запрошено перенаправление, перенаправляем на страницу погоды для найденного города
    if (redirect && data && data.id) {
      return NextResponse.redirect(new URL(`/weather/${data.id}`, request.nextUrl.origin));
    }

    // В противном случае возвращаем данные как JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка при получении погоды по координатам:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
