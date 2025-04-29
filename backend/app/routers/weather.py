from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any, List
import logging
import re
from backend.app.dependencies import get_openweather_client
from backend.api.openweather_client import OpenWeatherClient
from backend.api.openweather_adapter import adapt_city_search, adapt_current_weather, adapt_forecast

router = APIRouter(
    prefix="/weather",
    tags=["weather"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.get("/search", response_model=List[Dict[str, Any]])
async def search_city(
    query: str = Query(..., description="Строка поиска города"),
    openweather_client: OpenWeatherClient = Depends(get_openweather_client)
):
    """
    Поиск города по названию
    """
    try:
        results = await openweather_client.search_city(query)
        return adapt_city_search(results)
    except Exception as e:
        logger.exception(f"Ошибка при поиске города: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при поиске города: {str(e)}")

@router.get("/current/{city_id}", response_model=Dict[str, Any])
async def get_current_weather(
    city_id: str,
    openweather_client: OpenWeatherClient = Depends(get_openweather_client)
):
    """
    Получить текущую погоду для указанного города

    city_id имеет формат lat{широта}_lon{долгота}
    """
    try:
        # Извлекаем координаты из city_id
        lat_lon_match = re.match(r"lat([-\d.]+)_lon([-\d.]+)", city_id)
        if not lat_lon_match:
            raise HTTPException(status_code=400, detail="Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}")

        lat = float(lat_lon_match.group(1))
        lon = float(lat_lon_match.group(2))

        weather_data = await openweather_client.get_current_weather(lat, lon)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Данные о погоде не найдены")

        return adapt_current_weather(weather_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception(f"Ошибка при получении текущей погоды: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении текущей погоды: {str(e)}")

@router.get("/forecast/{city_id}", response_model=Dict[str, Any])
async def get_weather_forecast(
    city_id: str,
    days: int = Query(7, ge=1, le=10, description="Количество дней прогноза"),
    openweather_client: OpenWeatherClient = Depends(get_openweather_client)
):
    """
    Получить прогноз погоды для указанного города

    city_id имеет формат lat{широта}_lon{долгота}
    """
    try:
        # Извлекаем координаты из city_id
        lat_lon_match = re.match(r"lat([-\d.]+)_lon([-\d.]+)", city_id)
        if not lat_lon_match:
            raise HTTPException(status_code=400, detail="Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}")

        lat = float(lat_lon_match.group(1))
        lon = float(lat_lon_match.group(2))

        forecast_data = await openweather_client.get_forecast(lat, lon, days=days)
        if not forecast_data:
            raise HTTPException(status_code=404, detail="Данные о прогнозе погоды не найдены")

        return adapt_forecast(forecast_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception(f"Ошибка при получении прогноза погоды: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении прогноза погоды: {str(e)}")
