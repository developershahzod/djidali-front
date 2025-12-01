# Локальная разработка djidali-front

## Настройка для локальной разработки

### 1. Создайте файл `.env` в корне `djidali-front/`:

```bash
# Скопируйте env.example в .env
cp env.example .env
```

Содержимое `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_IMAGE_BASE_URL=http://localhost:3000
```

### 2. Запустите backend

Убедитесь, что backend работает на порту `3000`:

```bash
cd apps/backend
npm run dev
# Или через Docker
docker-compose up backend
```

### 3. Запустите frontend

```bash
cd djidali-front
npm run dev
```

Frontend откроется на `http://localhost:5173` (стандартный порт Vite).

## Как работает проксирование

В `vite.config.ts` настроен прокси:
- Все запросы к `/api/*` автоматически перенаправляются на `http://localhost:3000`
- Изображения загружаются через тот же прокси

## Проверка изображений

Если изображения не отображаются:

1. **Проверьте, что backend запущен**:
   ```bash
   curl http://localhost:3000/api/uploads/tours/[filename]
   ```

2. **Проверьте переменные окружения**:
   ```bash
   echo $VITE_API_BASE_URL
   echo $VITE_IMAGE_BASE_URL
   ```

3. **Перезапустите Vite после изменения .env**:
   ```bash
   # Vite нужно перезапустить, чтобы подхватить изменения в .env
   npm run dev
   ```

4. **Откройте DevTools → Network** и проверьте:
   - Запросы должны идти на `http://localhost:5173/api/uploads/...`
   - Vite автоматически проксирует их на `http://localhost:3000/api/uploads/...`

## Production

Для production не нужен `.env` файл - приложение автоматически использует:
- `VITE_API_BASE_URL=https://demo-api.djidali.uz/api`
- `VITE_IMAGE_BASE_URL=https://demo-api.djidali.uz`

Эти значения прописаны как fallback в коде.










