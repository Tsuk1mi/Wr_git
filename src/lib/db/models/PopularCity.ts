import mongoose, { Schema } from 'mongoose';

/**
 * Схема для хранения популярных городов
 */
const PopularCitySchema = new Schema({
  // Уникальный идентификатор города (в формате OpenWeather)
  cityId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Название города
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Страна
  country: {
    type: String,
    required: true,
    trim: true
  },

  // Координаты
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },

  // Регион/область (опционально)
  region: {
    type: String,
    trim: true
  },

  // Порядок для отображения (меньшее число = выше в списке)
  displayOrder: {
    type: Number,
    default: 999
  },

  // Количество поисковых запросов этого города
  searchCount: {
    type: Number,
    default: 0
  },

  // Метка времени последнего обновления
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы для быстрого поиска и сортировки
PopularCitySchema.index({ displayOrder: 1 }); // Сортировка по порядку отображения
PopularCitySchema.index({ searchCount: -1 }); // Сортировка по популярности
PopularCitySchema.index({ name: 1 }); // Поиск по названию

// Перед обновлением записи обновляем дату updatedAt
PopularCitySchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Создаем модель, если она еще не существует
const PopularCity = mongoose.models.PopularCity ||
  mongoose.model('PopularCity', PopularCitySchema);

export default PopularCity;
