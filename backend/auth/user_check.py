#auth\user_check.py
import bcrypt
from typing import Optional
from backend.models.users import User

async def get_user_by_login(login: str) -> Optional[User]:
    return await User.filter(login=login).first()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # bcrypt.checkpw ожидает bytes, поэтому кодируем строки в байты
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        # Если произойдёт ошибка, то пароли не совпадают
        return False

def get_password_hash(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Возвращаем как строку
