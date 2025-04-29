import mongoose, { Schema } from 'mongoose';

/**
 * Схема для хранения отзывов пользователей
 */
const FeedbackSchema = new Schema({
  // Имя пользователя
  name: {
    type: String,
    required: [true, 'Имя обязательно для заполнения'],
    trim: true,
    maxlength: [50, 'Имя не может превышать 50 символов']
  },

  // Email пользователя
  email: {
    type: String,
    required: [true, 'Email обязателен для заполнения'],
    match: [/^\S+@\S+\.\S+$/, 'Пожалуйста, укажите корректный email'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email не может превышать 100 символов']
  },

  // Текст отзыва
  message: {
    type: String,
    required: [true, 'Текст отзыва обязателен для заполнения'],
    minlength: [10, 'Текст отзыва должен содержать не менее 10 символов'],
    maxlength: [1000, 'Текст отзыва не может превышать 1000 символов']
  },

  // Оценка (от 1 до 5)
  rating: {
    type: Number,
    required: [true, 'Оценка обязательна'],
    min: [1, 'Минимальная оценка - 1'],
    max: [5, 'Максимальная оценка - 5']
  },

  // Дата создания отзыва
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Статус отзыва (ожидает проверки/опубликован/отклонен)
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending'
  },

  // Тема отзыва
  subject: {
    type: String,
    enum: ['app_usability', 'recommendations_quality', 'weather_accuracy', 'general', 'suggestion'],
    default: 'general'
  },

  // Город пользователя (опционально)
  city: {
    type: String,
    trim: true
  },

  // Ответ администратора (если есть)
  adminReply: {
    text: { type: String },
    createdAt: { type: Date }
  }
});

// Индексы для быстрого поиска и сортировки
FeedbackSchema.index({ createdAt: -1 }); // Сортировка по дате создания (новые сначала)
FeedbackSchema.index({ status: 1 }); // Поиск по статусу
FeedbackSchema.index({ rating: -1 }); // Сортировка по рейтингу

// Создаем модель, если она еще не существует
const Feedback = mongoose.models.Feedback ||
  mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
