# routes/user_modules/create_user
from fastapi import APIRouter, HTTPException, status
from pydantic import field_validator
from tortoise.contrib.pydantic import pydantic_model_creator
from backend.models.users_roles import UserRole
from backend.auth.add_users import handle_create_user_request
from backend.models.users import User
from typing import Any

router = APIRouter()

# Создаем базовую модель с помощью pydantic_model_creator
BaseCreateUserRequest = pydantic_model_creator(
    User,
    name="BaseCreateUserRequest",
    exclude=("id", "status", "hashed_password") #Убираю данные поля из-за ненадобности
)


# Создаем кастомную модель с валидацией, наследующую базовые поля
class CreateUserRequest(BaseCreateUserRequest):
    password: str

    @field_validator('role')
    def validate_role(cls, v: Any) -> str:
        print(f"Валидация role: входное значение {repr(v)}, тип {type(v)}")  # Отладка
        try:
            role_enum = UserRole(v)
            print(f"Успешно создан enum: {role_enum}, значение: {role_enum.value}")  # Отладка
            return role_enum.value
        except ValueError as e:
            print(f"Ошибка валидации: {e}")  # Отладка
            valid_roles = [role.value for role in UserRole]
            raise ValueError(f"Недопустимая роль. Допустимые значения: {valid_roles}")


@router.post("/create_user",
    response_model=dict,
    responses={
        200: {"description": "Успешное создание пользователя"},
        404: {"description": "Пользователь не создан"},
        422: {"description": "Ошибки валидации"},
        500: {"description": "Ошибка сервера"}
    },
    description="""
## Создание пользователя

Эндпоинт `/create_user` реализует механизм регистрации нового пользователя.
При успешной обработке запроса создаётся запись в БД с хешированным паролем и указанной ролью.

### Тип запроса
POST

### Параметры запроса
- `login` (string): Уникальное имя пользователя.
- `password` (string): Пароль пользователя. Должен содержать минимум 8 символов.
- `role` (string): Роль пользователя. Должна соответствовать одному из допустимых значений.

### Формат запроса
```json
{
  "login": "string",
  "password": "string",
  "role": "string"
}
"""
)
async def create_user(user_data: CreateUserRequest):
    try:
        return await handle_create_user_request(user_data.model_dump())
    except HTTPException:
        raise  # Пробрасываем HTTPException как есть (middleware его перехватит)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка сервера при создании пользователя"
        )