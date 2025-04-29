module.exports = {

"[project]/.next-internal/server/app/api/weather/current/[cityId]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/weather/current/[cityId]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// OpenWeatherMap API ключ
const API_KEY = process.env.OPENWEATHER_API_KEY || 'f34e61eb7108bf62fb3ed7e7e9a37aaa'; // Используем публичный API ключ для тестирования
async function GET(request, { params }) {
    const cityId = params.cityId;
    try {
        // Запрос текущей погоды из OpenWeatherMap API
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric&lang=ru`);
        if (!weatherResponse.ok) {
            throw new Error(`OpenWeatherMap API вернул статус: ${weatherResponse.status}`);
        }
        const openWeatherData = await weatherResponse.json();
        // Преобразуем данные из OpenWeatherMap API в наш формат
        const weatherData = {
            temperature: {
                air: {
                    C: Math.round(openWeatherData.main.temp),
                    F: Math.round(openWeatherData.main.temp * 9 / 5 + 32)
                },
                comfort: {
                    C: Math.round(openWeatherData.main.feels_like),
                    F: Math.round(openWeatherData.main.feels_like * 9 / 5 + 32)
                }
            },
            humidity: openWeatherData.main.humidity,
            precipitation: {
                type: getPrecipitationType(openWeatherData.weather[0].id),
                intensity: getPrecipitationIntensity(openWeatherData.weather[0].id)
            },
            wind: {
                speed: openWeatherData.wind.speed,
                direction: getWindDirection(openWeatherData.wind.deg)
            },
            pressure: {
                mm: Math.round(openWeatherData.main.pressure * 0.750062),
                hpa: openWeatherData.main.pressure
            },
            uv_index: 3,
            phenomena: {
                fog: openWeatherData.weather[0].id >= 700 && openWeatherData.weather[0].id < 800,
                thunder: openWeatherData.weather[0].id >= 200 && openWeatherData.weather[0].id < 300,
                cloudy: getCloudiness(openWeatherData.clouds.all)
            },
            description: openWeatherData.weather[0].description
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(weatherData);
    } catch (error) {
        console.error('Ошибка при получении данных о погоде:', error);
        // В случае ошибки, возвращаем мок данных с сообщением об ошибке
        const mockWeatherData = {
            temperature: {
                air: {
                    C: 15,
                    F: 59
                },
                comfort: {
                    C: 13,
                    F: 55
                }
            },
            humidity: 65,
            precipitation: {
                type: 'none',
                intensity: 0
            },
            wind: {
                speed: 3.5,
                direction: 'северо-западный'
            },
            pressure: {
                mm: 750,
                hpa: 1000
            },
            uv_index: 3,
            phenomena: {
                fog: false,
                thunder: false,
                cloudy: 50
            },
            description: 'Ошибка получения данных, используется резервный прогноз'
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockWeatherData);
    }
}
// Вспомогательные функции для преобразования данных
function getPrecipitationType(weatherId) {
    if (weatherId >= 200 && weatherId < 600) {
        if (weatherId >= 300 && weatherId < 400) {
            return 'drizzle';
        } else if (weatherId >= 500 && weatherId < 600) {
            return 'rain';
        } else if (weatherId >= 600 && weatherId < 700) {
            return 'snow';
        }
        return 'rain';
    }
    return 'none';
}
function getPrecipitationIntensity(weatherId) {
    if (weatherId >= 500 && weatherId < 510) {
        const intensity = weatherId - 500;
        return Math.min(intensity / 2, 3); // Нормализуем до шкалы 0-3
    }
    if (weatherId >= 600 && weatherId < 610) {
        const intensity = weatherId - 600;
        return Math.min(intensity / 2, 3);
    }
    return 0;
}
function getWindDirection(degrees) {
    const directions = [
        'северный',
        'северо-восточный',
        'восточный',
        'юго-восточный',
        'южный',
        'юго-западный',
        'западный',
        'северо-западный'
    ];
    return directions[Math.round(degrees / 45) % 8];
}
function getCloudiness(cloudPercent) {
    return cloudPercent;
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__18fc3cb1._.js.map