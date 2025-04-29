import type { NextApiRequest, NextApiResponse } from 'next';
import seedDatabase from '@/lib/db/seed';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Проверяем, что запрос выполняется через POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  // Проверяем наличие секретного ключа для безопасности
  const { secret } = req.body;

  // Секретный ключ для инициализации базы данных
  // В реальном приложении следует использовать env переменные
  const SEED_SECRET = process.env.SEED_SECRET || 'weatherwear-seed-secret';

  if (secret !== SEED_SECRET) {
    return res.status(401).json({ message: 'Неверный секретный ключ' });
  }

  try {
    // Заполняем базу данных
    await seedDatabase();

    return res.status(200).json({
      message: 'База данных успешно инициализирована',
      success: true
    });
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    return res.status(500).json({
      message: 'Ошибка при инициализации базы данных',
      error: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
}
