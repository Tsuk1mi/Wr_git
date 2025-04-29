module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/src/lib/db/connect.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "connectToDatabase": (()=>connectToDatabase),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://weatherwear:weatherwear123@cluster0.mongodb.net/weatherwear';
// Инициализация глобальной переменной
global.mongoose = global.mongoose || {
    conn: null,
    promise: null
};
async function connectToDatabase() {
    // Если уже подключились, возвращаем соединение
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }
    // Если процесс подключения уже начат, ждем его завершения
    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false
        };
        console.log('Connecting to MongoDB...');
        global.mongoose.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            console.log('Connected to MongoDB');
            return mongoose;
        }).catch((error)=>{
            console.error('Error connecting to MongoDB:', error);
            throw error;
        });
    }
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
}
const __TURBOPACK__default__export__ = connectToDatabase;
}}),
"[project]/src/lib/db/models/ClothingRecommendation.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
/**
 * Схема для рекомендаций по одежде
 * Включает детализированные рекомендации для различных температурных диапазонов,
 * типов активности и погодных условий
 */ const ClothingRecommendationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    // Категория температуры (freezing, cold, cool, mild, warm, hot и т.д.)
    tempRange: {
        type: String,
        required: true,
        enum: [
            'extreme_freezing',
            'freezing',
            'very_cold',
            'cold',
            'cool',
            'mild',
            'warm',
            'hot',
            'very_hot',
            'extreme_hot',
            'spring_transition',
            'fall_transition',
            'winter_transition',
            'summer_transition' // Переходная погода лето (умеренно-жарко)
        ]
    },
    // Минимальная и максимальная температура диапазона (в °C)
    minTemp: {
        type: Number,
        required: true
    },
    maxTemp: {
        type: Number,
        required: true
    },
    // Тип активности (прогулка, спорт, работа, отдых)
    activityType: {
        type: String,
        required: true,
        enum: [
            'walk',
            'sport',
            'work',
            'leisure'
        ]
    },
    // Рекомендуемая одежда
    recommendations: {
        // Обязательные предметы одежды
        essential: [
            {
                type: String
            }
        ],
        // Рекомендуемые предметы одежды
        recommended: [
            {
                type: String
            }
        ],
        // Дополнительные аксессуары
        accessories: [
            {
                type: String
            }
        ],
        // Предметы, которых следует избегать
        avoid: [
            {
                type: String
            }
        ]
    },
    // Модификаторы для разных погодных условий
    weatherModifiers: [
        {
            // Тип погодного условия (дождь, снег, ветер и т.д.)
            condition: {
                type: String,
                enum: [
                    'rain',
                    'light_rain',
                    'heavy_rain',
                    'snow',
                    'light_snow',
                    'heavy_snow',
                    'strong_wind',
                    'fog',
                    'high_humidity',
                    'high_uv',
                    'thunderstorm',
                    'hail',
                    'sleet',
                    'freezing_rain',
                    'variable'
                ]
            },
            // Предметы одежды, которые нужно добавить при таком условии
            add: [
                {
                    type: String
                }
            ],
            // Предметы, которых следует избегать при таком условии
            avoid: [
                {
                    type: String
                }
            ]
        }
    ],
    // Описание сезона
    season: {
        type: String,
        enum: [
            'winter',
            'spring',
            'summer',
            'fall',
            'transition'
        ]
    },
    // Дополнительная информация (например, советы по слоям одежды)
    tips: [
        {
            type: String
        }
    ],
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
ClothingRecommendationSchema.index({
    tempRange: 1,
    activityType: 1
});
// Перед обновлением записи обновляем дату updatedAt
ClothingRecommendationSchema.pre('findOneAndUpdate', function() {
    this.set({
        updatedAt: new Date()
    });
});
// Создаем модель, если она еще не существует
const ClothingRecommendation = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ClothingRecommendation || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('ClothingRecommendation', ClothingRecommendationSchema);
const __TURBOPACK__default__export__ = ClothingRecommendation;
}}),
"[project]/src/pages/api/recommendations/[cityId].ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$connect$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db/connect.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db/models/ClothingRecommendation.ts [api] (ecmascript)");
;
;
async function handler(req, res) {
    // Только GET запросы
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Метод не разрешен'
        });
    }
    // Извлекаем параметры
    const { cityId } = req.query;
    const activityType = req.query.activity_type || 'walk';
    if (!cityId) {
        return res.status(400).json({
            message: 'cityId обязателен'
        });
    }
    try {
        // Подключаемся к базе данных
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$connect$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        // Сначала получаем данные о погоде через прокси OpenWeather API
        const weatherResponse = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/weather/current/${cityId}`);
        if (!weatherResponse.ok) {
            throw new Error(`Ошибка получения данных о погоде: ${weatherResponse.statusText}`);
        }
        const weatherData = await weatherResponse.json();
        // Определяем температуру для выбора рекомендаций
        const temperature = weatherData.temperature?.air?.C || 0;
        const feelsLike = weatherData.temperature?.comfort?.C || temperature;
        // Используем температуру "ощущается как" для рекомендаций
        const effectiveTemp = feelsLike;
        // Находим соответствующие рекомендации в базе данных
        // Ищем по температурному диапазону и типу активности
        let clothingRecommendation = await findRecommendationByTemperature(effectiveTemp, activityType);
        // Если ничего не найдено, используем рекомендации для прогулки
        if (!clothingRecommendation && activityType !== 'walk') {
            clothingRecommendation = await findRecommendationByTemperature(effectiveTemp, 'walk');
        }
        // Если все еще ничего не найдено, возвращаем ошибку
        if (!clothingRecommendation) {
            return res.status(404).json({
                message: 'Рекомендации не найдены для указанной температуры и типа активности'
            });
        }
        // Обрабатываем модификаторы погоды (дождь, снег, ветер и т.д.)
        const finalRecommendations = applyWeatherModifiers(clothingRecommendation.recommendations, clothingRecommendation.weatherModifiers || [], weatherData);
        // Формируем ответ
        const result = {
            weather: weatherData,
            recommendations: {
                ...finalRecommendations,
                temperature: {
                    actual: temperature,
                    feels_like: feelsLike,
                    range: clothingRecommendation.tempRange.replace(/_/g, ' ')
                },
                weather_conditions: getWeatherConditions(weatherData),
                season: clothingRecommendation.season,
                tips: clothingRecommendation.tips || []
            }
        };
        return res.status(200).json(result);
    } catch (error) {
        console.error('Ошибка при получении рекомендаций:', error);
        return res.status(500).json({
            message: 'Ошибка при получении рекомендаций',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
/**
 * Функция для поиска рекомендаций по температуре
 */ async function findRecommendationByTemperature(temperature, activityType) {
    // Ищем рекомендации для данной температуры и типа активности
    const recommendationsByTemperature = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].find({
        minTemp: {
            $lte: temperature
        },
        maxTemp: {
            $gt: temperature
        },
        activityType
    }).exec();
    // Если есть рекомендации, возвращаем первую
    if (recommendationsByTemperature.length > 0) {
        return recommendationsByTemperature[0];
    }
    // Проверяем, находимся ли мы в переходном сезоне (весна/осень)
    const month = new Date().getMonth() + 1; // JavaScript месяцы начинаются с 0
    // Весна (март-май)
    if (month >= 3 && month <= 5) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOne({
            tempRange: 'spring_transition',
            activityType
        }).exec();
    }
    // Осень (сентябрь-ноябрь)
    if (month >= 9 && month <= 11) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOne({
            tempRange: 'fall_transition',
            activityType
        }).exec();
    }
    // Если переходный сезон не определен, ищем ближайший температурный диапазон
    if (temperature < -25) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOne({
            tempRange: 'extreme_freezing',
            activityType
        }).exec();
    } else if (temperature >= 35) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$models$2f$ClothingRecommendation$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOne({
            tempRange: 'extreme_hot',
            activityType
        }).exec();
    }
    return null;
}
/**
 * Функция для применения модификаторов погоды к рекомендациям
 */ function applyWeatherModifiers(baseRecommendations, weatherModifiers, weatherData) {
    const result = {
        essential: [
            ...baseRecommendations.essential || []
        ],
        recommended: [
            ...baseRecommendations.recommended || []
        ],
        accessories: [
            ...baseRecommendations.accessories || []
        ],
        avoid: [
            ...baseRecommendations.avoid || []
        ]
    };
    // Получаем текущие погодные условия
    const conditions = getWeatherConditions(weatherData);
    // Применяем модификаторы для текущих погодных условий
    for (const condition of conditions){
        const modifier = weatherModifiers.find((m)=>m.condition === condition);
        if (modifier) {
            // Добавляем элементы "add" в аксессуары, если их еще нет в списке
            for (const item of modifier.add || []){
                if (!result.essential.includes(item) && !result.recommended.includes(item) && !result.accessories.includes(item)) {
                    result.accessories.push(item);
                }
            }
            // Добавляем элементы "avoid" в список того, что следует избегать
            for (const item of modifier.avoid || []){
                if (!result.avoid.includes(item)) {
                    result.avoid.push(item);
                }
            }
        }
    }
    return result;
}
/**
 * Функция для определения погодных условий
 */ function getWeatherConditions(weatherData) {
    const conditions = [];
    // Проверяем осадки
    const precipitation = weatherData.precipitation || {};
    if (precipitation.type === 'rain') {
        if (precipitation.intensity > 5) {
            conditions.push('heavy_rain');
        } else if (precipitation.intensity > 0) {
            conditions.push('light_rain');
        }
        conditions.push('rain');
    } else if (precipitation.type === 'snow') {
        if (precipitation.intensity > 5) {
            conditions.push('heavy_snow');
        } else if (precipitation.intensity > 0) {
            conditions.push('light_snow');
        }
        conditions.push('snow');
    }
    // Проверяем ветер
    const wind = weatherData.wind || {};
    if (wind.speed > 8) {
        conditions.push('strong_wind');
    }
    // Проверяем другие явления
    const phenomena = weatherData.phenomena || {};
    if (phenomena.fog) {
        conditions.push('fog');
    }
    if (phenomena.thunder) {
        conditions.push('thunderstorm');
    }
    // Проверяем влажность
    if (weatherData.humidity > 80) {
        conditions.push('high_humidity');
    }
    // Проверяем УФ-индекс
    if (weatherData.uv_index > 5) {
        conditions.push('high_uv');
    }
    // Если резкие колебания температуры в течение дня
    if (weatherData.daily_temp_range && weatherData.daily_temp_range > 10) {
        conditions.push('variable');
    }
    return conditions;
}
}}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/src/pages/api/recommendations/[cityId].ts [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$recommendations$2f5b$cityId$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/api/recommendations/[cityId].ts [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$recommendations$2f5b$cityId$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$recommendations$2f5b$cityId$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/recommendations/[cityId]",
        pathname: "/api/recommendations/[cityId]",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$recommendations$2f5b$cityId$5d2e$ts__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a8902eb7._.js.map