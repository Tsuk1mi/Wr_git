#!/bin/bash

# Перейдем в директорию проекта
cd "$(dirname "$0")"

echo "=== Weather & Clothing App - Инструмент запуска ==="
echo "Устанавливаем зависимости и запускаем приложение..."

# Цвета для консоли
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Установка зависимостей для фронтенда...${NC}"
bun install

echo -e "${BLUE}Создание .env.local с настройками API...${NC}"
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

echo -e "${BLUE}Настройка и запуск бэкенда...${NC}"
cd backend

# Установка зависимостей для бэкенда
echo -e "${BLUE}Установка зависимостей для API-сервера...${NC}"
bun add fastify@latest @fastify/cors node-fetch --silent

# Запускаем бэкенд в фоновом режиме
echo -e "${GREEN}Запуск API-сервера...${NC}"
bun run server.js &
BACKEND_PID=$!

# Возвращаемся в корневую директорию
cd ..

# Задержка для запуска бэкенда
sleep 2

# Проверяем, что backend запущен
echo -e "${BLUE}Проверка работоспособности API...${NC}"
API_CHECK=$(curl -s http://localhost:3001/ || echo "failed")
if [[ $API_CHECK == *"failed"* ]]; then
  echo -e "${RED}Не удалось подключиться к API. Проверьте наличие ошибок выше.${NC}"
  kill $BACKEND_PID
  exit 1
else
  echo -e "${GREEN}API успешно запущен!${NC}"
fi

# Запускаем фронтенд
echo -e "${GREEN}Запуск фронтенда...${NC}"
echo -e "${YELLOW}Веб-приложение будет доступно по адресу: http://localhost:3000${NC}"
bun run dev &
FRONTEND_PID=$!

# Функция для корректного завершения процессов
cleanup() {
    echo -e "\n${BLUE}Остановка процессов...${NC}"
    kill $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Перехватываем сигналы завершения
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Все компоненты запущены! Нажмите Ctrl+C для завершения работы.${NC}"

# Ожидаем завершения процессов
wait $BACKEND_PID $FRONTEND_PID
