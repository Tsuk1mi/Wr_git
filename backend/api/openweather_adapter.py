from typing import Dict, Any, List
from datetime import datetime
from itertools import groupby

def adapt_city_search(openweather_cities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Преобразует результат поиска городов из OpenWeather в формат, совместимый с приложением

    Args:
        openweather_cities: Список городов от OpenWeather API

    Returns:
        List[Dict[str, Any]]: Список городов в формате приложения
    """
    return [
        {
            "id": f"lat{city.get('lat')}_lon{city.get('lon')}",  # Создаем уникальный ID из координат
            "name": city.get("name", ""),
            "country": city.get("country", ""),
            "region": city.get("state", ""),
            "latitude": city.get("lat"),
            "longitude": city.get("lon")
        }
        for city in openweather_cities
    ]

def adapt_current_weather(weather_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Преобразует данные о текущей погоде из OpenWeather в формат, совместимый с приложением

    Args:
        weather_data: Данные о погоде от OpenWeather API

    Returns:
        Dict[str, Any]: Данные о погоде в формате приложения
    """
    if not weather_data:
        return {}

    # Извлекаем основные данные
    main = weather_data.get("main", {})
    wind = weather_data.get("wind", {})
    weather_desc = weather_data.get("weather", [{}])[0] if weather_data.get("weather") else {}
    rain = weather_data.get("rain", {})
    snow = weather_data.get("snow", {})
    clouds = weather_data.get("clouds", {})

    # Определяем тип осадков
    precipitation_type = None
    precipitation_intensity = 0

    if rain and rain.get("1h", 0) > 0:
        precipitation_type = "rain"
        precipitation_intensity = rain.get("1h", 0)
    elif snow and snow.get("1h", 0) > 0:
        precipitation_type = "snow"
        precipitation_intensity = snow.get("1h", 0)

    # Определяем наличие тумана или грозы
    is_fog = any(w.get("id", 0) in [701, 741] for w in weather_data.get("weather", []))
    is_thunder = any(w.get("id", 0) in range(200, 299) for w in weather_data.get("weather", []))

    return {
        "temperature": {
            "air": {
                "C": main.get("temp", 0)
            },
            "comfort": {
                "C": main.get("feels_like", 0)
            }
        },
        "humidity": main.get("humidity", 0),
        "precipitation": {
            "type": precipitation_type or "none",
            "intensity": precipitation_intensity
        } if precipitation_type else None,
        "wind": {
            "speed": wind.get("speed", 0),
            "direction": get_wind_direction(wind.get("deg", 0))
        },
        "pressure": {
            "mm": round(main.get("pressure", 0) * 0.750062, 1),  # гПа в мм рт.ст.
            "hpa": main.get("pressure", 0)
        },
        "phenomena": {
            "fog": is_fog,
            "thunder": is_thunder,
            "cloudy": clouds.get("all", 0)
        },
        "description": weather_desc.get("description", ""),
        "date": weather_data.get("dt_txt", "") or datetime.fromtimestamp(weather_data.get("dt", 0)).strftime("%Y-%m-%d %H:%M:%S")
    }

def adapt_forecast(forecast_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Преобразует данные о прогнозе погоды из OpenWeather в формат, совместимый с приложением

    Args:
        forecast_data: Данные о прогнозе от OpenWeather API

    Returns:
        Dict[str, Any]: Данные о прогнозе в формате приложения
    """
    if not forecast_data or "list" not in forecast_data:
        return {"days": []}

    result = {"days": []}

    # Получаем все прогнозы из списка
    forecasts = forecast_data.get("list", [])

    # Группируем прогнозы по дате (без учета времени)
    def get_date(forecast):
        dt_txt = forecast.get("dt_txt", "")
        return dt_txt.split()[0] if dt_txt else ""

    # Сортируем и группируем прогнозы по дате
    forecasts.sort(key=get_date)
    grouped_forecasts = groupby(forecasts, key=get_date)

    for date, day_forecasts in grouped_forecasts:
        # Преобразуем итератор в список для работы с ним
        day_forecasts_list = list(day_forecasts)

        # Берем полуденный прогноз как наиболее репрезентативный для дня
        # Ищем запись, ближайшую к полудню (12:00)
        noon_forecast = None
        min_diff = float('inf')

        for forecast in day_forecasts_list:
            dt_txt = forecast.get("dt_txt", "")
            if not dt_txt:
                continue

            time_part = dt_txt.split()[1]
            hour = int(time_part.split(":")[0])
            diff = abs(hour - 12)

            if diff < min_diff:
                min_diff = diff
                noon_forecast = forecast

        # Если не нашли прогноз на полдень, берем первый для данного дня
        representative_forecast = noon_forecast or day_forecasts_list[0]

        # Адаптируем выбранный прогноз
        adapted_forecast = adapt_current_weather(representative_forecast)

        # Убедимся, что дата установлена
        if not adapted_forecast.get("date"):
            adapted_forecast["date"] = date

        result["days"].append(adapted_forecast)

    return result

def get_wind_direction(degrees: float) -> str:
    """
    Преобразует угол направления ветра в текстовое представление

    Args:
        degrees: Угол направления ветра в градусах

    Returns:
        str: Текстовое представление направления ветра
    """
    directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]
    index = round(degrees / 45) % 8
    return directions[index]
