from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de la base de datos
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "barberin")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "12345")
DB_PORT = os.getenv("DB_PORT", "3306")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Crear motor de base de datos
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,  # Cambiar a True para ver las consultas SQL
    pool_pre_ping=True,
    pool_recycle=300
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para verificar conexión
def test_connection():
    try:
        connection = engine.connect()
        print("✅ Conexión a la base de datos exitosa!")
        connection.close()
        return True
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return False