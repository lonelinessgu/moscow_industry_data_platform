import logging
import warnings

def setup_logging():
    # Игнорировать конкретное предупреждение Pydantic
    warnings.filterwarnings("ignore",
                           message=".*PydanticSerializationUnexpectedValue.*role.*input_value='user'.*")

    # Уровень логирования для passlib - только ошибки
    logging.getLogger("passlib").setLevel(logging.ERROR)