import asyncio
from tortoise import Tortoise
from backend.models.users import User

async def init():
    await Tortoise.init(
        db_url='sqlite://users.db',
        modules={'users_db': ['backend.models.users']}
    )
    await Tortoise.generate_schemas()

async def get_users():
    await init()
    users = await User.all()
    for user in users:
        print(f"ID: {user.id}, Логин: {user.login}, Роль: {user.role}, Статус: {user.status}")

asyncio.run(get_users())