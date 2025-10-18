import asyncio
from tortoise import Tortoise
from backend.models.companies import Company

async def init():
    await Tortoise.init(
        db_url='sqlite://companies.db', # Убедитесь, что путь к БД соответствует вашему проекту
        modules={'models': ['backend.models.companies']} # Используйте имя модуля, указанное в init
    )
    await Tortoise.generate_schemas()

async def get_companies():
    await init()
    companies = await Company.all()
    if not companies:
        print("В таблице companies нет записей.")
        return

    # Получаем имена полей модели
    fields = Company._meta.fields_map
    field_names = list(fields.keys())
    print(" | ".join(field_names).upper())
    print("-" * (len(" | ".join(field_names).upper()) + len(field_names) - 1)) # Линия разделитель

    for company in companies:
        row = []
        for field_name in field_names:
            value = getattr(company, field_name)
            # Преобразуем значение в строку, обрабатывая None
            row.append(str(value) if value is not None else "None")
        print(" | ".join(row))

asyncio.run(get_companies())