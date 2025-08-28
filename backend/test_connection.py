#!/usr/bin/env python3
"""
Script to test the connection to the MySQL database
Run: python test_db_connection.py
"""

import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import pymysql
from datetime import datetime

# ========================================
# 🔧 CONFIGURATION - MODIFY THESE VALUES
# ========================================
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",          # 👈 CHANGE TO YOUR USER
    "password": "Qwe.123*",      # 👈 CHANGE TO YOUR PASSWORD
    "database": "barberian_db"  # 👈 CHANGE TO YOUR DATABASE
}

def print_separator(title=""):
    """Prints a visual separator"""
    print("\n" + "="*60)
    if title:
        print(f"  {title}")
        print("="*60)

def test_pymysql_connection():
    """Test direct connection with PyMySQL"""
    print_separator("TESTING DIRECT CONNECTION WITH PyMySQL")
    
    try:
        print("🔄 Trying to connect with PyMySQL...")
        connection = pymysql.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
            charset='utf8mb4'
        )
        
        print("✅ Successful connection with PyMySQL!")
        
        # Test a simple query
        cursor = connection.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        print(f"📊 MySQL Version: {version[0]}")
        
        cursor.execute("SELECT DATABASE()")
        db_name = cursor.fetchone()
        print(f"🗄️  Current database: {db_name[0]}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"📋 Number of tables: {len(tables)}")
        if tables:
            print("🔍 Tables found:")
            for table in tables:
                print(f"   - {table[0]}")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ PyMySQL connection error:")
        print(f"   Type: {type(e).__name__}")
        print(f"   Message: {str(e)}")
        return False

def test_sqlalchemy_connection():
    """Test connection with SQLAlchemy"""
    print_separator("TESTING CONNECTION WITH SQLAlchemy")
    
    # Create connection URL
    database_url = f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    print(f"🔗 Connection URL: {database_url.replace(DB_CONFIG['password'], '*****')}")
    
    try:
        print("🔄 Creating SQLAlchemy engine...")
        engine = create_engine(database_url)
        
        print("🔄 Testing connection with SQLAlchemy...")
        with engine.connect() as connection:
            print("✅ Successful connection with SQLAlchemy!")
            
            # Test queries
            result = connection.execute(text("SELECT VERSION()"))
            version = result.fetchone()
            print(f"📊 MySQL Version: {version[0]}")
            
            result = connection.execute(text("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = :db_name"), 
                                      {"db_name": DB_CONFIG["database"]})
            count = result.fetchone()
            print(f"📋 Number of tables in {DB_CONFIG['database']}: {count[0]}")
            
            # Show tables
            result = connection.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            if tables:
                print("🔍 Tables found:")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print("⚠️  No tables found in the database")
        
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ SQLAlchemy error:")
        print(f"   Type: {type(e).__name__}")
        print(f"   Message: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ General error:")
        print(f"   Type: {type(e).__name__}")
        print(f"   Message: {str(e)}")
        return False

def test_database_permissions():
    """Test database permissions"""
    print_separator("TESTING DATABASE PERMISSIONS")
    
    try:
        connection = pymysql.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )
        
        cursor = connection.cursor()
        
        # Test SELECT
        try:
            cursor.execute("SELECT 1")
            print("✅ SELECT permissions: OK")
        except Exception as e:
            print(f"❌ SELECT permissions: {e}")
        
        # Test CREATE TABLE (create temporary table)
        try:
            cursor.execute("""
                CREATE TEMPORARY TABLE test_permissions (
                    id INT PRIMARY KEY,
                    test_field VARCHAR(50)
                )
            """)
            print("✅ CREATE permissions: OK")
            
            # Test INSERT
            cursor.execute("INSERT INTO test_permissions (id, test_field) VALUES (1, 'test')")
            print("✅ INSERT permissions: OK")
            
            # Test UPDATE
            cursor.execute("UPDATE test_permissions SET test_field = 'updated' WHERE id = 1")
            print("✅ UPDATE permissions: OK")
            
            # Test DELETE
            cursor.execute("DELETE FROM test_permissions WHERE id = 1")
            print("✅ DELETE permissions: OK")
            
            # Test DROP
            cursor.execute("DROP TEMPORARY TABLE test_permissions")
            print("✅ DROP permissions: OK")
            
        except Exception as e:
            print(f"❌ Error in modification permissions: {e}")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error testing permissions: {e}")
        return False

def show_diagnostics():
    """Show diagnostic information"""
    print_separator("DIAGNOSTIC INFORMATION")
    
    print(f"🐍 Python version: {sys.version}")
    
    # Check installed dependencies
    dependencies = ['sqlalchemy', 'pymysql', 'fastapi', 'uvicorn', 'pydantic']
    
    for dep in dependencies:
        try:
            module = __import__(dep)
            version = getattr(module, '__version__', 'Unknown')
            print(f"📦 {dep}: {version} ✅")
        except ImportError:
            print(f"📦 {dep}: NOT INSTALLED ❌")
    
    print(f"⏰ Date and time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    """Main function"""
    print("🚀 STARTING DATABASE CONNECTION TESTS")
    print(f"🎯 Target: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
    
    # Show diagnostic information
    show_diagnostics()
    
    # Success counter
    tests_passed = 0
    total_tests = 3
    
    # Test 1: Direct PyMySQL
    if test_pymysql_connection():
        tests_passed += 1
    
    # Test 2: SQLAlchemy
    if test_sqlalchemy_connection():
        tests_passed += 1
    
    # Test 3: Permissions
    if test_database_permissions():
        tests_passed += 1
    
    # Final result
    print_separator("FINAL RESULT")
    print(f"🏆 Successful tests: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Your database is ready to use with FastAPI")
        print("\n📌 Next steps:")
        print("   1. Update the configuration in main.py")
        print("   2. Run: python main.py")
        print("   3. Go to: http://localhost:8000")
    elif tests_passed > 0:
        print("⚠️  SOME TESTS FAILED")
        print("💡 Check the errors shown above")
    else:
        print("💥 ALL TESTS FAILED")
        print("🔧 Common solutions:")
        print("   - Make sure MySQL is running")
        print("   - Check user and password")
        print("   - Confirm the database exists")
        print("   - Make sure the user has permissions")

if __name__ == "__main__":
    main()