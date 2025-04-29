import mongoose, { Schema } from 'mongoose';

/**
 * Схема для рекомендаций по одежде
 * Включает детализированные рекомендации для различных температурных диапазонов,
 * типов активности и погодных условий
 */
const ClothingRecommendationSchema = new Schema({
  // Категория температуры (freezing, cold, cool, mild, warm, hot и т.д.)
  tempRange: {
    type: String,
    required: true,
    enum: [
      'extreme_freezing', // Экстремально холодно ниже -25°C
      'freezing',         // Очень холодно -25°C до -10°C
      'very_cold',        // Холодно -10°C до 0°C
      'cold',             // Прохладно 0°C до 10°C
      'cool',             // Умеренно прохладно 10°C до 15°C
      'mild',             // Умеренно 15°C до 20°C
      'warm',             // Тепло 20°C до 25°C
      'hot',              // Жарко 25°C до 30°C
      'very_hot',         // Очень жарко 30°C до 35°C
      'extreme_hot',      // Экстремально жарко выше 35°C
      'spring_transition', // Переходная погода весна (холодно-умеренно)
      'fall_transition',   // Переходная погода осень (умеренно-холодно)
      'winter_transition', // Переходная погода зима (холодно-очень холодно)
      'summer_transition'  // Переходная погода лето (умеренно-жарко)
    ]
  },

  // Минимальная и максимальная температура диапазона (в °C)
  minTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },

  // Тип активности (прогулка, спорт, работа, отдых)
  activityType: {
    type: String,
    required: true,
    enum: ['walk', 'sport', 'work', 'leisure']
  },

  // Рекомендуемая одежда
  recommendations: {
    // Обязательные предметы одежды
    essential: [{ type: String }],

    // Рекомендуемые предметы одежды
    recommended: [{ type: String }],

    // Дополнительные аксессуары
    accessories: [{ type: String }],

    // Предметы, которых следует избегать
    avoid: [{ type: String }]
  },

  // Модификаторы для разных погодных условий
  weatherModifiers: [{
    // Тип погодного условия (дождь, снег, ветер и т.д.)
    condition: {
      type: String,
      enum: [
        'rain', 'light_rain', 'heavy_rain',
        'snow', 'light_snow', 'heavy_snow',
        'strong_wind', 'fog', 'high_humidity',
        'high_uv', 'thunderstorm', 'hail',
        'sleet', 'freezing_rain', 'variable'
      ]
    },

    // Предметы одежды, которые нужно добавить при таком условии
    add: [{ type: String }],

    // Предметы, которых следует избегать при таком условии
    avoid: [{ type: String }]
  }],

  // Описание сезона
  season: {
    type: String,
    enum: ['winter', 'spring', 'summer', 'fall', 'transition']
  },

  // Дополнительная информация (например, советы по слоям одежды)
  tips: [{ type: String }],

  // Дата создания записи
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Дата последнего обновления
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы для быстрого поиска по температурному диапазону и типу активности
ClothingRecommendationSchema.index({ tempRange: 1, activityType: 1 });

// Перед обновлением записи обновляем дату updatedAt
ClothingRecommendationSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Создаем модель, если она еще не существует
const ClothingRecommendation = mongoose.models.ClothingRecommendation ||
  mongoose.model('ClothingRecommendation', ClothingRecommendationSchema);

export default ClothingRecommendation;
