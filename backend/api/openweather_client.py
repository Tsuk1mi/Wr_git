import os
import aiohttp
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)

class OpenWeatherClient:
    """
    Клиент для работы с API OpenWeather (https://openweathermap.org/api)
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5/"
        self.geocode_url = "https://api.openweathermap.org/geo/1.0/direct"
        if not self.api_key:
            logger.warning("OPENWEATHER_API_KEY не указан. Некоторые функции могут быть недоступны.")

    async def search_city(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Поиск города по названию

        Args:
            query: Строка поиска (название города)
            limit: Максимальное количество результатов

        Returns:
            Список найденных городов
        """
        params = {
            "q": query,
            "limit": limit,
            "appid": self.api_key
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(self.geocode_url, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.error(f"Ошибка поиска города OpenWeather: {response.status}, {await response.text()}")
                    return []

    async def get_current_weather(self, lat: float, lon: float, units: str = "metric") -> Dict[str, Any]:
        """
        Получить текущую погоду по координатам

        Args:
            lat: Широта
            lon: Долгота
            units: Единицы измерения (metric - Цельсий, standard - Кельвин, imperial - Фаренгейт)

        Returns:
            Информация о текущей погоде
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "lang": "ru",
            "units": units
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}weather", params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.error(f"Ошибка получения текущей погоды OpenWeather: {response.status}, {await response.text()}")
                    return {}

    async def get_forecast(self, lat: float, lon: float, units: str = "metric", cnt: int = 7) -> Dict[str, Any]:
        """
        Получить прогноз погоды на несколько дней

        Использует бесплатный endpoint 'forecast', который возвращает прогноз с шагом 3 часа.
        Для получения данных по дням нужно группировать результаты по дате.

        Args:
            lat: Широта
            lon: Долгота
            units: Единицы измерения (metric - Цельсий, standard - Кельвин, imperial - Фаренгейт)
            cnt: Количество записей (шаг 3 часа, максимум 40 записей = 5 дней)

        Returns:
            Прогноз погоды с шагом 3 часа
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "lang": "ru",
            "units": units,
            "cnt": min(cnt * 8, 40)  # 8 трехчасовых интервалов в дне, максимум 40 (5 дней)
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}forecast", params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.error(f"Ошибка получения прогноза погоды OpenWeather: {response.status}, {await response.text()}")
                    return {}
