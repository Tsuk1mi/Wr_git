import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Загрузка переменных окружения из .env файла
load_dotenv()

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Импорт роутеров
from backend.app.routers import weather, recommendations

app = FastAPI(
    title="WeatherWear API",
    description="API для сервиса WeatherWear - прогноз погоды с рекомендациями по одежде",
    version="0.1.0"
)

# Настройка CORS для взаимодействия с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # Локальный адрес фронтенда
        "http://frontend:3000",      # Адрес в Docker-сети
        "http://127.0.0.1:3000",     # Альтернативный локальный адрес
        "*"                          # Разрешаем все домены для разработки
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(weather.router)
app.include_router(recommendations.router)

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API WeatherWear!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
