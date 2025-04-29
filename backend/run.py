import uvicorn
import os
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

if __name__ == "__main__":
    # Запуск сервера FastAPI
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("DEBUG", "False").lower() == "true" else False
    )
