#auth\token.py
from datetime import datetime, timedelta, timezone
import os
from jose import jwt, JWTError
from fastapi import HTTPException, status
from pydantic import BaseModel

# Загрузка настроек из .env (конфигурация проекта)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Создаёт JWT-токен, включающий переданные данные и срок действия.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> TokenData:
    """
    Декодирует токен и возвращает данные в виде модели TokenData.
    Если токен истёк или некорректен — выбрасывается HTTPException.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
        return TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
