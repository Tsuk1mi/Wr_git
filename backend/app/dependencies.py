import os
from typing import Optional
from backend.api.openweather_client import OpenWeatherClient
from backend.services.clothing_recommendations import ClothingRecommendationService

# Глобальные экземпляры клиентов
_openweather_client: Optional[OpenWeatherClient] = None
_clothing_recommendation_service: Optional[ClothingRecommendationService] = None

def get_openweather_client() -> OpenWeatherClient:
    """
    Получить экземпляр клиента OpenWeather API
    """
    global _openweather_client
    if _openweather_client is None:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        _openweather_client = OpenWeatherClient(api_key)
    return _openweather_client

def get_clothing_recommendation_service() -> ClothingRecommendationService:
    """
    Получить экземпляр сервиса рекомендаций по одежде
    """
    global _clothing_recommendation_service
    if _clothing_recommendation_service is None:
        _clothing_recommendation_service = ClothingRecommendationService()
    return _clothing_recommendation_service
