FROM node:18-alpine

WORKDIR /app

# Устанавливаем необходимые зависимости
RUN apk add --no-cache curl unzip

# Устанавливаем bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Копируем package.json и bun.lock
COPY package.json ./
COPY bun.lock* ./

# Устанавливаем зависимости
RUN bun install

# Копируем исходный код
COPY . .

# Создаем .env файл для Next.js с URL API
RUN echo "NEXT_PUBLIC_API_URL=http://backend:8000" > .env.local

# Порт для Next.js
EXPOSE 3000

# Запускаем Next.js в режиме разработки
CMD ["bun", "run", "dev"]
