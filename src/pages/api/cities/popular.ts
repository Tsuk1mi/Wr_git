import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db/connect';
import PopularCity from '@/lib/db/models/PopularCity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    // Получаем параметры запроса
    const limit = Number(req.query.limit) || 10;

    // Получаем популярные города, сортируем по порядку отображения
    const cities = await PopularCity.find({})
      .sort({ displayOrder: 1 })
      .limit(limit)
      .lean();

    return res.status(200).json(cities);
  } catch (error) {
    console.error('Ошибка при получении популярных городов:', error);
    return res.status(500).json({
      message: 'Ошибка при получении популярных городов',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
