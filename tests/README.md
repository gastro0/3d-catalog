# Тесты сайта и API на pytest

Три проверки работающего приложения:

- Главная страница открывается, содержит заголовок, поиск и ссылки навигации.
- Страница категорий открывается, содержит поиск и ссылки на 19 категорий.
- `GET /health` возвращает HTTP 200 и JSON с `status: "ok"` и булевым
  `storageConfigured`. Подключённый Supabase для этой проверки не требуется.

Тесты написаны как функции pytest с обычными `assert`.
Авторизацию и загрузку моделей они не проверяют. Page Object читает HTML
через HTTP без выполнения JavaScript: ввода в поиск и интерактивной фильтрации
в этих проверках нет.

Структура:

```text
requirements-test.txt         # зависимость pytest
pytest.ini                    # где искать тесты и параметры pytest
tests/
  config.py                   # адреса сайта и API, таймаут HTTP-запросов
  conftest.py                 # фикстуры home_page и categories_page
  pages/
    base_page.py              # HTTP-запросы и разбор HTML
    home_page.py              # Page Object главной страницы
    categories_page.py        # Page Object страницы категорий
  test_site.py                # проверки страниц
  test_api_health.py          # API-тест GET /health
```

Фикстуры в `conftest.py` создают и открывают отдельную страницу для каждого
теста. pytest передаёт готовый Page Object в аргумент функции с таким же именем.
Адреса страниц и поиск элементов находятся в Page Object, проверки — в тестах.

На Windows из корня проекта создай окружение и установи зависимость:

```bash
python -m venv .venv
./.venv/Scripts/python.exe -m pip install --no-cache-dir -r requirements-test.txt
```

Если окружение уже создано, первую команду повторять не нужно.
Окружение находится в папке проекта на D: и исключено из Git.

Запусти приложение в отдельном терминале, если оно ещё не запущено:

```bash
npm run dev
```

После готовности сайта и API запусти все тесты из корня проекта в Git Bash:

```bash
./.venv/Scripts/python.exe -m pytest -v
```

Только API-тест (достаточно работающего `npm run dev:api`):

```bash
./.venv/Scripts/python.exe -m pytest tests/test_api_health.py -v
```

Только проверки страниц (достаточно работающего `npm run dev:web`):

```bash
./.venv/Scripts/python.exe -m pytest tests/test_site.py -v
```

В VS Code выбери интерпретатор `.venv/Scripts/python.exe` для запуска pytest.

В `tests/config.py` заданы адрес сайта `http://127.0.0.1:3000`,
адрес API `http://127.0.0.1:7777` и таймаут 60 секунд.
Адреса можно переопределить переменными `SITE_URL` и `API_URL`.
Например, в Git Bash:

```bash
API_URL=http://127.0.0.1:8888 ./.venv/Scripts/python.exe -m pytest tests/test_api_health.py -v
```

Для GitHub Actions после подготовки Python установи зависимости командой
`python -m pip install -r requirements-test.txt`, а после запуска и готовности
приложения выполни `python -m pytest -v`. Файл workflow настраивается отдельно.

Если соответствующий сервер выключен, возвращает ошибку или ожидаемые элементы
и данные отсутствуют, тесты завершатся с ошибкой.
