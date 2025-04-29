import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Подключаемся к базе данных
  await connectToDatabase();

  // Обработка GET запроса - получение списка опубликованных отзывов
  if (req.method === 'GET') {
    try {
      // Получаем параметры запроса
      const limit = Number(req.query.limit) || 10;
      const page = Number(req.query.page) || 1;
      const skip = (page - 1) * limit;

      // Получаем только опубликованные отзывы, сортируем по дате (новые сначала)
      const feedbacks = await Feedback.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Получаем общее количество опубликованных отзывов для пагинации
      const total = await Feedback.countDocuments({ status: 'published' });

      return res.status(200).json({
        feedbacks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      return res.status(500).json({
        message: 'Ошибка при получении отзывов',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Обработка POST запроса - добавление нового отзыва
  if (req.method === 'POST') {
    try {
      const { name, email, message, rating, subject, city } = req.body;

      // Проверяем наличие обязательных полей
      if (!name || !email || !message || !rating) {
        return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
      }

      // Проверяем корректность рейтинга
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' });
      }

      // Создаем новый отзыв
      const newFeedback = new Feedback({
        name,
        email,
        message,
        rating,
        subject: subject || 'general',
        city: city || '',
        status: 'pending'  // Новые отзывы всегда имеют статус "ожидает проверки"
      });

      // Сохраняем отзыв в базе данных
      await newFeedback.save();

      return res.status(201).json({
        message: 'Отзыв успешно отправлен и будет опубликован после проверки',
        feedback: newFeedback
      });
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
      return res.status(500).json({
        message: 'Ошибка при добавлении отзыва',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Если метод запроса не поддерживается
  return res.status(405).json({ message: 'Метод не разрешен' });
}
