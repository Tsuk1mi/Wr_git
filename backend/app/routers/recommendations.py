import logging
import re
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Depends, Query

from backend.app.dependencies import get_clothing_recommendation_service, get_openweather_client
from backend.api.openweather_adapter import adapt_current_weather, adapt_forecast
from backend.api.openweather_client import OpenWeatherClient
from backend.services.clothing_recommendations import ClothingRecommendationService

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.get("/{city_id}", response_model=Dict[str, Any])
async def get_clothing_recommendations(
    city_id: str,
    activity_type: str = Query("walk", description="Тип активности (walk, sport, work, leisure)"),
    openweather_client: OpenWeatherClient = Depends(get_openweather_client),
    recommendation_service: ClothingRecommendationService = Depends(get_clothing_recommendation_service)
):
    """
    Получить рекомендации по одежде на основе текущей погоды для указанного города и типа активности

    city_id имеет формат lat{широта}_lon{долгота}
    """
    try:
        # Извлекаем координаты из city_id
        lat_lon_match = re.match(r"lat([-\d.]+)_lon([-\d.]+)", city_id)
        if not lat_lon_match:
            raise HTTPException(status_code=400, detail="Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}")

        lat = float(lat_lon_match.group(1))
        lon = float(lat_lon_match.group(2))

        # Получаем текущую погоду
        weather_data = await openweather_client.get_current_weather(lat, lon)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Данные о погоде не найдены")

        # Адаптируем данные к формату, ожидаемому сервисом рекомендаций
        adapted_weather = adapt_current_weather(weather_data)

        # Получаем рекомендации по одежде
        recommendations = recommendation_service.get_recommendations(adapted_weather, activity_type)

        # Добавляем информацию о погоде в ответ
        result = {
            "weather": adapted_weather,
            "recommendations": recommendations
        }

        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception(f"Ошибка при получении рекомендаций по одежде: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении рекомендаций по одежде: {str(e)}")

@router.get("/forecast/{city_id}", response_model=Dict[str, Any])
async def get_forecast_recommendations(
    city_id: str,
    days: int = Query(3, ge=1, le=7, description="Количество дней прогноза"),
    activity_type: str = Query("walk", description="Тип активности (walk, sport, work, leisure)"),
    openweather_client: OpenWeatherClient = Depends(get_openweather_client),
    recommendation_service: ClothingRecommendationService = Depends(get_clothing_recommendation_service)
):
    """
    Получить рекомендации по одежде на основе прогноза погоды для указанного города и типа активности

    city_id имеет формат lat{широта}_lon{долгота}
    """
    try:
        # Извлекаем координаты из city_id
        lat_lon_match = re.match(r"lat([-\d.]+)_lon([-\d.]+)", city_id)
        if not lat_lon_match:
            raise HTTPException(status_code=400, detail="Некорректный формат city_id. Ожидается формат lat{широта}_lon{долгота}")

        lat = float(lat_lon_match.group(1))
        lon = float(lat_lon_match.group(2))

        # Получаем прогноз погоды
        forecast_data = await openweather_client.get_forecast(lat, lon, cnt=days)
        if not forecast_data:
            raise HTTPException(status_code=404, detail="Данные о прогнозе погоды не найдены")

        # Адаптируем данные к формату, ожидаемому сервисом рекомендаций
        adapted_forecast = adapt_forecast(forecast_data)

        # Получаем рекомендации для каждого дня прогноза
        daily_recommendations = []

        for day_data in adapted_forecast.get("days", []):
            # Получаем рекомендации для данного дня
            day_recommendations = recommendation_service.get_recommendations(day_data, activity_type)

            # Формируем результат для данного дня
            day_result = {
                "date": day_data.get("date", ""),
                "weather": day_data,
                "recommendations": day_recommendations
            }

            daily_recommendations.append(day_result)

        return {
            "city_id": city_id,
            "activity_type": activity_type,
            "daily_recommendations": daily_recommendations
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception(f"Ошибка при получении рекомендаций по прогнозу: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении рекомендаций по прогнозу: {str(e)}")
