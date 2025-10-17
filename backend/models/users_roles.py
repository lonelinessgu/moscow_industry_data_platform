# models/user_roles
import os
from enum import Enum

# Загружаем переменную напрямую
ALLOWED_ROLES_STR = os.getenv("ALLOWED_ROLES", "admin,user,guest")
ALLOWED_ROLES = [role.strip() for role in ALLOWED_ROLES_STR.split(",")]

# Создаем enum динамически
UserRole = Enum("UserRole", {role: role for role in ALLOWED_ROLES}, type=str)