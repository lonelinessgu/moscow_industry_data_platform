# backend/routes/files_modules/upload.py

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
from backend.core.file_parser import process_pdf, process_word, process_excel
import io
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

upload_router = APIRouter()

@upload_router.post("/upload")
async def process_file_endpoint(file: UploadFile = File(...)):
    logger.info(f"Получен файл: {file.filename}, размер: {file.size}, тип: {file.content_type}")

    contents = await file.read()
    file_extension = file.filename.split('.')[-1].lower()
    logger.info(f"Расширение файла: {file_extension}")

    try:
        if file_extension == "xlsx":
            logger.info("Обработка Excel файла")
            df = pd.read_excel(io.BytesIO(contents), header=0)
            result = await process_excel(df) # Добавлен await
        elif file_extension == "docx":
            logger.info("Обработка Word файла")
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp_file:
                tmp_file.write(contents)
                tmp_path = tmp_file.name
            try:
                result = process_word(tmp_path)
            finally:
                os.unlink(tmp_path)
        elif file_extension == "pdf":
            logger.info("Обработка PDF файла")
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                tmp_file.write(contents)
                tmp_path = tmp_file.name
            try:
                result = process_pdf(tmp_path)
            finally:
                os.unlink(tmp_path)
        else:
            logger.error(f"Неподдерживаемый формат: {file_extension}")
            return JSONResponse(content={"error": f"Неподдерживаемый формат: {file_extension}"}, status_code=400)

        logger.info("Файл успешно обработан")
        return {"content": result}
    except Exception as e:
        logger.error(f"Ошибка при обработке файла {file.filename}: {str(e)}", exc_info=True)
        return JSONResponse(content={"error": f"Ошибка сервера: {str(e)}"}, status_code=500)