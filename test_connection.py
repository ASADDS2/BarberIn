#!/usr/bin/env python3
"""
Script para probar la conexión a la base de datos MySQL
Ejecutar: python test_db_connection.py
"""

import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import pymysql
from datetime import datetime

# ========================================
# 🔧 CONFIGURACIÓN - MODIFICA ESTOS DATOS
# ========================================
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",          # 👈 CAMBIAR POR TU USUARIO
    "password": "1234",   # 👈 CAMBIAR POR TU CONTRASEÑA
    "database": "barberian_db"  # 👈 CAMBIAR POR TU BASE DE DATOS
}

def print_separator(title=""):
    """Imprime un separador visual"""
    print("\n" + "="*60)
    if title:
        print(f"  {title}")
        print("="*60)

def test_pymysql_connection():
    """Prueba la conexión directa con PyMySQL"""
    print_separator("PROBANDO CONEXIÓN DIRECTA CON PyMySQL")
    
    try:
        print("🔄 Intentando conectar con PyMySQL...")
        connection = pymysql.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
            charset='utf8mb4'
        )
        
        print("✅ ¡Conexión exitosa con PyMySQL!")
        
        # Probar una consulta simple
        cursor = connection.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        print(f"📊 Versión de MySQL: {version[0]}")
        
        cursor.execute("SELECT DATABASE()")
        db_name = cursor.fetchone()
        print(f"🗄️  Base de datos actual: {db_name[0]}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"📋 Número de tablas: {len(tables)}")
        if tables:
            print("🔍 Tablas encontradas:")
            for table in tables:
                print(f"   - {table[0]}")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión con PyMySQL:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        return False

def test_sqlalchemy_connection():
    """Prueba la conexión con SQLAlchemy"""
    print_separator("PROBANDO CONEXIÓN CON SQLAlchemy")
    
    # Crear la URL de conexión
    database_url = f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    print(f"🔗 URL de conexión: {database_url.replace(DB_CONFIG['password'], '*****')}")
    
    try:
        print("🔄 Creando engine de SQLAlchemy...")
        engine = create_engine(database_url)
        
        print("🔄 Probando conexión con SQLAlchemy...")
        with engine.connect() as connection:
            print("✅ ¡Conexión exitosa con SQLAlchemy!")
            
            # Probar consultas
            result = connection.execute(text("SELECT VERSION()"))
            version = result.fetchone()
            print(f"📊 Versión de MySQL: {version[0]}")
            
            result = connection.execute(text("SELECT COUNT(*) as tabla_count FROM information_schema.tables WHERE table_schema = :db_name"), 
                                      {"db_name": DB_CONFIG["database"]})
            count = result.fetchone()
            print(f"📋 Número de tablas en {DB_CONFIG['database']}: {count[0]}")
            
            # Mostrar tablas
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            if tables:
                print("🔍 Tablas encontradas:")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print("⚠️  No se encontraron tablas en la base de datos")
        
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ Error de SQLAlchemy:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Error general:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        return False

def test_database_permissions():
    """Prueba los permisos de la base de datos"""
    print_separator("PROBANDO PERMISOS DE BASE DE DATOS")
    
    try:
        connection = pymysql.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )
        
        cursor = connection.cursor()
        
        # Probar SELECT
        try:
            cursor.execute("SELECT 1")
            print("✅ Permisos SELECT: OK")
        except Exception as e:
            print(f"❌ Permisos SELECT: {e}")
        
        # Probar CREATE TABLE (crear tabla temporal)
        try:
            cursor.execute("""
                CREATE TEMPORARY TABLE test_permissions (
                    id INT PRIMARY KEY,
                    test_field VARCHAR(50)
                )
            """)
            print("✅ Permisos CREATE: OK")
            
            # Probar INSERT
            cursor.execute("INSERT INTO test_permissions (id, test_field) VALUES (1, 'test')")
            print("✅ Permisos INSERT: OK")
            
            # Probar UPDATE
            cursor.execute("UPDATE test_permissions SET test_field = 'updated' WHERE id = 1")
            print("✅ Permisos UPDATE: OK")
            
            # Probar DELETE
            cursor.execute("DELETE FROM test_permissions WHERE id = 1")
            print("✅ Permisos DELETE: OK")
            
            # Probar DROP
            cursor.execute("DROP TEMPORARY TABLE test_permissions")
            print("✅ Permisos DROP: OK")
            
        except Exception as e:
            print(f"❌ Error en permisos de modificación: {e}")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error probando permisos: {e}")
        return False

def show_diagnostics():
    """Muestra información de diagnóstico"""
    print_separator("INFORMACIÓN DE DIAGNÓSTICO")
    
    print(f"🐍 Versión de Python: {sys.version}")
    
    # Verificar dependencias instaladas
    dependencies = ['sqlalchemy', 'pymysql', 'fastapi', 'uvicorn', 'pydantic']
    
    for dep in dependencies:
        try:
            module = __import__(dep)
            version = getattr(module, '__version__', 'Desconocida')
            print(f"📦 {dep}: {version} ✅")
        except ImportError:
            print(f"📦 {dep}: NO INSTALADO ❌")
    
    print(f"⏰ Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    """Función principal"""
    print("🚀 INICIANDO PRUEBAS DE CONEXIÓN A LA BASE DE DATOS")
    print(f"🎯 Objetivo: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
    
    # Mostrar información de diagnóstico
    show_diagnostics()
    
    # Contador de éxito
    tests_passed = 0
    total_tests = 3
    
    # Prueba 1: PyMySQL directo
    if test_pymysql_connection():
        tests_passed += 1
    
    # Prueba 2: SQLAlchemy
    if test_sqlalchemy_connection():
        tests_passed += 1
    
    # Prueba 3: Permisos
    if test_database_permissions():
        tests_passed += 1
    
    # Resultado final
    print_separator("RESULTADO FINAL")
    print(f"🏆 Pruebas exitosas: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("✅ Tu base de datos está lista para usar con FastAPI")
        print("\n📌 Próximos pasos:")
        print("   1. Actualiza la configuración en main.py")
        print("   2. Ejecuta: python main.py")
        print("   3. Ve a: http://localhost:8000")
    elif tests_passed > 0:
        print("⚠️  ALGUNAS PRUEBAS FALLARON")
        print("💡 Revisa los errores mostrados arriba")
    else:
        print("💥 TODAS LAS PRUEBAS FALLARON")
        print("🔧 Soluciones comunes:")
        print("   - Verifica que MySQL esté ejecutándose")
        print("   - Revisa usuario y contraseña")
        print("   - Confirma que la base de datos existe")
        print("   - Verifica que el usuario tenga permisos")

if __name__ == "__main__":
    main()