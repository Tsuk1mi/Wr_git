module.exports = {

"[project]/.next-internal/server/app/api/weather/forecast/[cityId]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/weather/forecast/[cityId]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "dynamic": (()=>dynamic)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic'; // ✅ важно для корректной работы параметров
const API_KEY = process.env.OPENWEATHER_API_KEY || 'c4b2992878138ac1210bc925ac188097';
async function GET(request, context) {
    const { cityId } = context.params;
    const searchParams = request.nextUrl.searchParams;
    const days = Number.parseInt(searchParams.get('days') || '5', 10);
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=ru`);
        if (!forecastResponse.ok) {
            throw new Error(`OpenWeatherMap API вернул статус: ${forecastResponse.status}`);
        }
        const openWeatherData = await forecastResponse.json();
        const dailyForecasts = groupForecastByDay(openWeatherData.list);
        const limitedForecasts = dailyForecasts.slice(0, days);
        const forecastData = limitedForecasts.map((dayForecast)=>{
            const midDayForecast = dayForecast.find((item)=>item.dt_txt.includes('12:00:00')) || dayForecast[Math.floor(dayForecast.length / 2)];
            return {
                temperature: {
                    air: {
                        C: Math.round(midDayForecast.main.temp),
                        F: Math.round(midDayForecast.main.temp * 9 / 5 + 32)
                    },
                    comfort: {
                        C: Math.round(midDayForecast.main.feels_like),
                        F: Math.round(midDayForecast.main.feels_like * 9 / 5 + 32)
                    }
                },
                humidity: midDayForecast.main.humidity,
                precipitation: {
                    type: getPrecipitationType(midDayForecast.weather[0].id),
                    intensity: getPrecipitationIntensity(midDayForecast.weather[0].id)
                },
                wind: {
                    speed: midDayForecast.wind.speed,
                    direction: getWindDirection(midDayForecast.wind.deg)
                },
                pressure: {
                    mm: Math.round(midDayForecast.main.pressure * 0.750062),
                    hpa: midDayForecast.main.pressure
                },
                uv_index: 3,
                phenomena: {
                    fog: midDayForecast.weather[0].id >= 700 && midDayForecast.weather[0].id < 800,
                    thunder: midDayForecast.weather[0].id >= 200 && midDayForecast.weather[0].id < 300,
                    cloudy: midDayForecast.clouds.all
                },
                description: midDayForecast.weather[0].description,
                date: midDayForecast.dt_txt.split(' ')[0]
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(forecastData);
    } catch (error) {
        console.error('Ошибка при получении прогноза погоды:', error);
        const forecastData = [];
        for(let i = 0; i < days; i++){
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            forecastData.push({
                temperature: {
                    air: {
                        C: 15 + i,
                        F: 59 + i * 2
                    },
                    comfort: {
                        C: 13 + i,
                        F: 55 + i * 2
                    }
                },
                humidity: 65,
                precipitation: {
                    type: i % 3 === 0 ? 'rain' : 'none',
                    intensity: i % 3 === 0 ? 1 : 0
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
                date: dateStr,
                description: 'Нет данных (использованы резервные)'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(forecastData);
    }
}
// Вспомогательные функции
function groupForecastByDay(forecastList) {
    const days = {};
    forecastList.forEach((item)=>{
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(item);
    });
    return Object.values(days);
}
function getPrecipitationType(weatherId) {
    if (weatherId >= 300 && weatherId < 400) return 'drizzle';
    if (weatherId >= 500 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    return 'none';
}
function getPrecipitationIntensity(weatherId) {
    if (weatherId >= 500 && weatherId < 510) return Math.min((weatherId - 500) / 2, 3);
    if (weatherId >= 600 && weatherId < 610) return Math.min((weatherId - 600) / 2, 3);
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
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5a3cd3e8._.js.map