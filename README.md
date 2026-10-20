# ModelHub · каталог 3D-моделей

Next.js + React на клиенте, NestJS API и Supabase для аккаунтов, метаданных и файлов.

## Быстрый запуск

Нужны Node.js 22.12+ и npm 10+. Все команды выполняются из корня проекта.

```powershell
npm.cmd ci
npm.cmd run dev
```

В PowerShell используется `npm.cmd`, чтобы запуск не зависел от политики исполнения `npm.ps1`. В других оболочках можно использовать `npm`.

- Сайт: http://localhost:3000
- API: http://localhost:7777/health
- Swagger: http://localhost:7777/swagger

Без ключей Supabase главная страница, категории, переключение темы и языка доступны; каталог покажет состояние недоступности, вход будет отключён. Фиктивные модели в базу не добавляются.

## Подключение Supabase

1. Создайте проект Supabase или используйте существующий.
2. Выполните [SQL-миграцию](supabase/migrations/202610200001_catalog.sql) в SQL Editor. Она создаёт таблицу `models`, индексы, RLS и приватный bucket `models`. Для исходной схемы переименовывает поля и дополняет метаданные, сохраняя строки и пути файлов. Перед применением к существующей базе сделайте резервную копию и проверьте [совместимость](docs/architecture.md).
3. Создайте конфигурации из примеров:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

Если файл `apps/api/.env` уже существует, отредактируйте его, не заменяйте: локальная конфигурация из исходной папки бэкенда сохранена.

В `apps/api/.env` задайте:

```dotenv
PORT=7777
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_SERVICE_ROLE_KEY
SUPABASE_BUCKET=models
MAX_UPLOAD_BYTES=26214400
```

В `apps/web/.env.local` задайте URL и публичный anon key **того же проекта**:

```dotenv
API_URL=http://127.0.0.1:7777
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Service role key используется только API. Файлы `.env*`, кроме примеров, исключены из Git.

4. В Supabase Auth настройте Site URL `http://localhost:3000` и разрешённые Redirect URLs. По умолчанию регистрация может требовать подтверждения email.
5. Перезапустите `npm.cmd run dev`. Зарегистрируйтесь, подтвердите email, войдите и загрузите модель.

Для `GLTF` с внешними текстурами и `OBJ` с материалами загружайте ZIP со всеми зависимостями. Самостоятельные GLB, STL и FBX можно загружать отдельным файлом. Лимит интерфейса — 25 МБ; серверный лимит задаётся отдельно и не должен превышать лимит bucket.

## Команды

| Команда                    | Действие                                                                  |
| -------------------------- | ------------------------------------------------------------------------- |
| `npm.cmd run dev`          | Одновременно запускает web и API, останавливает оба при завершении одного |
| `npm.cmd run dev:web`      | Только Next.js                                                            |
| `npm.cmd run dev:api`      | Только NestJS с перезапуском при изменениях                               |
| `npm.cmd run typecheck`    | TypeScript обоих приложений                                               |
| `npm.cmd run build`        | Production-сборка обоих приложений                                        |
| `npm.cmd run format:check` | Проверка форматирования                                                   |
| `npm.cmd run format`       | Форматирование исходников                                                 |

В репозитории один `package-lock.json`. Используйте `npm.cmd ci` для воспроизводимой установки, а `npm.cmd install` — при изменении зависимостей.

Для production после сборки запустите в двух процессах:

```powershell
npm.cmd run start --workspace=@modelhub/api
npm.cmd run start --workspace=@modelhub/web
```

`API_URL` задаётся при сборке web: Next.js проксирует `/api/*` на API. Браузеру не нужен отдельный API origin. При публикации настройте HTTPS, адреса Supabase Auth и переменные окружения на сервере.

## Структура

```text
apps/
  web/
    pages/                 маршруты Next.js Pages Router
    components/layout/     общая оболочка, шапка и подвал
    components/ui/         иконки и доступный диалог
    features/auth/         вход и регистрация
    features/catalog/      каталог, категории, карточки и загрузка
    providers/             сессия, язык, тема и избранное
    lib/                   HTTP и браузерный Supabase
    types/                 тип модели
    styles/                единые стили и адаптивность
    public/categories/     изображения категорий
  api/
    src/catalog/           чтение, загрузка, скачивание и удаление
    src/auth/guards/       проверка Supabase access token
    src/supabase/          единый серверный клиент
    src/config/            проверка настроек
supabase/migrations/        схема метаданных и хранилища
docs/                      устройство проекта и результаты разбора
```

Подробности, ограничения и совместимость: [архитектура](docs/architecture.md). Исходные проблемы и выполненные исправления: [разбор проекта](docs/project-review.md).
