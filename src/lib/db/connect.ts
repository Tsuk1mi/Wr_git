import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://weatherwear:weatherwear123@cluster0.mongodb.net/weatherwear';

/**
 * Глобальная переменная для хранения состояния подключения к БД
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Инициализация глобальной переменной
global.mongoose = global.mongoose || { conn: null, promise: null };

/**
 * Функция для подключения к базе данных MongoDB
 * Использует схему синглтона для избежания лишних подключений
 */
export async function connectToDatabase() {
  // Если уже подключились, возвращаем соединение
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Если процесс подключения уже начат, ждем его завершения
  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB...');
    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase;
