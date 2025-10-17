# middleware/logger
import logging
import time
import os
from collections import Counter
from pathlib import Path
from fastapi import Request
from starlette.responses import FileResponse, StreamingResponse

PROJECT_ROOT = Path(__file__).parents[2]
LOG_DIR = Path(os.getenv("DB_DATA_DIR", PROJECT_ROOT / "logs"))
LOG_DIR.mkdir(exist_ok=True)

middleware_logger = logging.getLogger("middleware")

# Список URL для исключения при статусе 200
try:
    from backend.routes.logging_config import EXCLUDED_200_URLS

    if EXCLUDED_200_URLS:
        middleware_logger.info(
            f"Следующие маршруты не будут записаны при статусе 200(success.log):\n{', '.join(EXCLUDED_200_URLS)}")
    else:
        middleware_logger.info("Нет маршрутов для исключения из success.log")
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    EXCLUDED_200_URLS = []
except Exception as e:
    print(f"UNEXPECTED ERROR: {e}")
    EXCLUDED_200_URLS = []

# Форматтер для логов
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Основной логгер для всех запросов
logger = logging.getLogger("request_logger")
logger.setLevel(logging.INFO)
logger.propagate = False  # Отключаем распространение в корневой логгер

# Создаем обработчики - только нужные файлы
handlers = {
    "success": logging.FileHandler(LOG_DIR / "success.log", encoding='utf-8'),  # Только 2xx статусы
    "errors": logging.FileHandler(LOG_DIR / "errors.log", encoding='utf-8'),  # Все ошибки 4xx и 5xx
    "console": logging.StreamHandler(),  # Добавляем обработчик для консоли
}

# Настраиваем форматер для всех обработчиков
for handler in handlers.values():
    handler.setFormatter(formatter)


# Создаем фильтры
class SuccessFileFilter(logging.Filter):
    """Фильтр для success.log - только 2xx статусы по неисключенным путям"""

    def filter(self, record):
        # Получаем URL из сообщения лога (если это словарь)
        if hasattr(record, 'msg') and isinstance(record.msg, dict):
            url_path = record.msg.get('path', '')
            status_code = record.msg.get('status', 0)

            # Записываем в success.log только 2xx статусы по неисключенным путям
            # Проверка на точное совпадение или использование startswith, если пути параметризованы
            # Например: "/api/logs/download/success.log" in EXCLUDED_200_URLS или
            # any(url_path.startswith(p) for p in EXCLUDED_200_URLS_PATTERNS)
            is_excluded = any(url_path.startswith(p.split('{')[0]) for p in EXCLUDED_200_URLS if '{' in p) or (
                        url_path in EXCLUDED_200_URLS)

            if 200 <= status_code < 300 and not is_excluded:
                return True
            return False
        return False


class ErrorsFileFilter(logging.Filter):
    """Фильтр для errors.log - только 4xx и 5xx статусы"""

    def filter(self, record):
        # Получаем URL из сообщения лога (если это словарь)
        if hasattr(record, 'msg') and isinstance(record.msg, dict):
            status_code = record.msg.get('status', 0)
            # Записываем в errors.log только ошибки
            return 400 <= status_code < 600
        return False


class ConsoleFilter(logging.Filter):
    """Фильтр для консоли - показывает все запросы"""

    def filter(self, record):
        return True


# Применяем фильтры
handlers["success"].addFilter(SuccessFileFilter())
handlers["errors"].addFilter(ErrorsFileFilter())
handlers["console"].addFilter(ConsoleFilter())

# Привязываем обработчики к логгеру
logger.addHandler(handlers["success"])
logger.addHandler(handlers["errors"])
logger.addHandler(handlers["console"])


def process_string(s):
    """Обработка длинных строк со статистикой"""
    if not isinstance(s, str):
        return s

    if len(s) <= 256:
        return s

    truncated = s[:255]
    analysis_part = s[:25000]
    counts = Counter(analysis_part)

    most_common = counts.most_common(1)[0] if counts else None
    stats_lines = []

    if most_common:
        stats_lines.append(f"Самый частый символ: '{most_common[0]}' x {most_common[1]}")

    all_counts = [f"{char}: {cnt}" for char, cnt in counts.items()]
    stats_lines.append(f"Все символы: {', '.join(all_counts)}")

    return f"{truncated}\n[СТАТИСТИКА: {', '.join(stats_lines)}]"


def process_log_dict(log_dict):
    """Рекурсивная обработка строк в структурах данных"""
    if isinstance(log_dict, str):
        return process_string(log_dict)
    elif isinstance(log_dict, dict):
        return {key: process_log_dict(value) for key, value in log_dict.items()}
    elif isinstance(log_dict, (list, tuple)):
        return [process_log_dict(item) for item in log_dict]
    return log_dict


async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Определение IP клиента
    client_ip = (
            request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
            or request.headers.get("X-Real-IP", "")
            or request.headers.get("CF-Connecting-IP", "")
            or request.client.host
    )

    # Чтение тела запроса
    content_type = request.headers.get("content-type", "")
    try:
        request_body = await request.json()
    except Exception:
        try:
            request_body = (await request.body()).decode("utf-8")
        except:
            request_body = "<unable to decode>"

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000
    url_path = request.url.path

    # Если ответ - FileResponse или StreamingResponse, не обрабатываем его тело
    if isinstance(response, (FileResponse, StreamingResponse)):
        # Для FileResponse/StreamingResponse не логируем request_body из ответа,
        # так как он может быть большим или потоковым.
        # Вместо этого используем маркер.
        log_request_body = request_body  # Оставляем тело запроса как есть
        log_response_body_marker = "<FILE_DATA>"  # Маркер для тела ответа-файла
    else:
        # Для обычных ответов оставляем старую логику
        # В текущем коде тело ответа не логируется.
        log_request_body = request_body
        log_response_body_marker = None

    # Формируем данные для лога
    log_data = {
        "method": request.method,
        "path": url_path,
        "client_ip": client_ip,
        "status": response.status_code,
        "time_ms": f"{process_time:.2f}",
        "content_type": content_type,
        "request_body": log_request_body,
    }
    # Добавляем маркер для FileResponse, если нужно
    if log_response_body_marker:
        log_data["response_body"] = log_response_body_marker

    # Обрабатываем данные перед логированием (только request_body)
    processed_log = process_log_dict(log_data)

    # Определяем категорию статуса
    status_category = f"{response.status_code // 100}xx"

    # Логируем один раз — фильтры сами решат, куда писать
    # Фильтры EXCLUDED_200_URLS по-прежнему работают
    extra = {"status_category": status_category}
    logger.info(processed_log, extra=extra)

    return response