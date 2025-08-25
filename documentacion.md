# 📖 Documentación Completa - main.py
## Sistema de Gestión de Barberías - BarberIn API

---

## 🔧 **SECCIÓN 1: IMPORTACIONES Y DEPENDENCIAS**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, TIMESTAMP, Time, Date, Enum, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date, time
from enum import Enum as PyEnum
import os
```

### **¿Qué hace?**
- **FastAPI**: Framework principal para crear la API REST
- **SQLAlchemy**: ORM para manejar la base de datos MySQL
- **Pydantic**: Validación de datos y serialización
- **Typing**: Tipado estático para mejor desarrollo
- **Datetime**: Manejo de fechas y horas

---

## 🗄️ **SECCIÓN 2: CONFIGURACIÓN DE BASE DE DATOS**

```python
DATABASE_URL = "mysql+pymysql://usuario:contraseña@localhost:3306/barberian_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### **¿Qué hace?**
- **DATABASE_URL**: Cadena de conexión a MySQL usando PyMySQL
- **engine**: Motor de SQLAlchemy que maneja las conexiones
- **SessionLocal**: Factory para crear sesiones de base de datos
- **Base**: Clase base para todos los modelos ORM

---

## 📊 **SECCIÓN 3: ENUMERACIONES (ENUMS)**

```python
class AuthProviderEnum(PyEnum):
    local = "local"
    google = "google"

class AppointmentStatusEnum(PyEnum):
    pending = "pending"
    confirmed = "confirmed" 
    cancelled = "cancelled"
    done = "done"

class DayOfWeekEnum(PyEnum):
    monday = "monday"
    # ... resto de días
```

### **¿Qué hace?**
- Define valores constantes para campos específicos
- **AuthProviderEnum**: Tipos de autenticación (local/Google)
- **AppointmentStatusEnum**: Estados de las citas
- **DayOfWeekEnum**: Días de la semana para horarios

---

## 🏗️ **SECCIÓN 4: MODELOS DE BASE DE DATOS (SQLAlchemy)**

### **AuthProvider - Proveedores de Autenticación**
```python
class AuthProvider(Base):
    __tablename__ = "auth_provider"
    
    id_auth_provider = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(Enum(AuthProviderEnum), nullable=False)
    provider_id_google = Column(String(255))
    token = Column(String(255))
```
**Función**: Almacena información de autenticación (Google, local)

### **Role - Roles de Usuario**
```python
class Role(Base):
    __tablename__ = "roles"
    
    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
```
**Función**: Define roles (Cliente, Barbero, Admin, etc.)

### **Genre - Géneros**
```python
class Genre(Base):
    __tablename__ = "genres"
    
    id_genre = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
```
**Función**: Almacena géneros (Masculino, Femenino, Otro)

### **Department - Departamentos**
```python
class Department(Base):
    __tablename__ = "departments"
    
    id_department = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
```
**Función**: Estados/departamentos del país

### **City - Ciudades**
```python
class City(Base):
    __tablename__ = "citys"
    
    id_city = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
```
**Función**: Ciudades que pertenecen a departamentos

### **User - Usuarios del Sistema**
```python
class User(Base):
    __tablename__ = "users"
    
    id_user = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255))
    id_role = Column(Integer, ForeignKey("roles.id_role"))
```
**Función**: Usuarios base del sistema (clientes, barberos, admins)

### **Customer - Clientes**
```python
class Customer(Base):
    __tablename__ = "customers"
    
    id_customer = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    id_genre = Column(Integer, ForeignKey("genres.id_genre"), nullable=False)
    phone = Column(String(255))
    direction = Column(String(255))
    # ... más campos
```
**Función**: Información específica de clientes

### **Specialty - Especialidades de Barberos**
```python
class Specialty(Base):
    __tablename__ = "specialties"
    
    id_specialty = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    years_experience = Column(Integer)
```
**Función**: Especialidades (Corte clásico, Barba, Coloración, etc.)

### **BarberSchedule - Horarios de Barberos**
```python
class BarberSchedule(Base):
    __tablename__ = "barber_schedule"
    
    id_schedule = Column(Integer, primary_key=True, autoincrement=True)
    day_of_week = Column(Enum(DayOfWeekEnum), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
```
**Función**: Horarios de trabajo de cada barbero

### **Barber - Barberos**
```python
class Barber(Base):
    __tablename__ = "barbers"
    
    id_barber = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    # ... muchas relaciones y campos
    points = Column(Integer, nullable=False, default=0)
```
**Función**: Información específica de barberos (especialidad, puntos, ubicación)

### **Staff - Personal**
```python
class Staff(Base):
    __tablename__ = "staff"
    
    id_staff = Column(Integer, primary_key=True, autoincrement=True)
    id_barber = Column(Integer, ForeignKey("barbers.id_barber"), nullable=False)
```
**Función**: Agrupa barberos en equipos de trabajo

### **Barbershop - Barberías**
```python
class Barbershop(Base):
    __tablename__ = "barbershops"
    
    id_barbershop = Column(Integer, primary_key=True, autoincrement=True)
    id_staff = Column(Integer, ForeignKey("staff.id_staff"), nullable=False)
    phone = Column(String(50))
```
**Función**: Establecimientos físicos de barberías

### **Location - Ubicaciones**
```python
class Location(Base):
    __tablename__ = "locations"
    
    id_location = Column(Integer, primary_key=True, autoincrement=True)
    # ... información de dirección y horarios
    opening_hour = Column(Time, nullable=False)
    closing_hour = Column(Time, nullable=False)
```
**Función**: Direcciones físicas y horarios de barberías

### **Appointment - Citas**
```python
class Appointment(Base):
    __tablename__ = "appointment"
    
    id_appointment = Column(Integer, primary_key=True, autoincrement=True)
    id_customer = Column(Integer, ForeignKey("customers.id_customer"), nullable=False)
    id_barber = Column(Integer, ForeignKey("barbers.id_barber"), nullable=False)
    appointment_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(AppointmentStatusEnum), default=AppointmentStatusEnum.pending)
```
**Función**: Citas agendadas entre clientes y barberos

---

## 📋 **SECCIÓN 5: ESQUEMAS PYDANTIC (VALIDACIÓN DE DATOS)**

### **¿Qué son los esquemas Pydantic?**
Los esquemas definen cómo deben verse los datos que entran y salen de la API.

### **Patrones de Esquemas:**

#### **Base Schema (Modelo base)**
```python
class RoleBase(BaseModel):
    name: str
```
**Función**: Define los campos comunes

#### **Create Schema (Para crear)**
```python
class RoleCreate(RoleBase):
    pass
```
**Función**: Define qué datos se necesitan para crear

#### **Response Schema (Para respuesta)**
```python
class RoleResponse(RoleBase):
    id_role: int
    
    class Config:
        from_attributes = True
```
**Función**: Define qué datos se devuelven, incluye el ID

### **Esquemas Importantes:**

- **UserCreate**: Incluye password para registro
- **UserResponse**: No incluye password por seguridad
- **CustomerResponse**: Incluye relaciones (user, genre, city, department)
- **AppointmentResponse**: Incluye información completa del cliente y barbero

---

## 🚀 **SECCIÓN 6: CONFIGURACIÓN DE FASTAPI**

```python
app = FastAPI(
    title="Barberian API",
    description="API completa para sistema de gestión de barberías",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **¿Qué hace?**
- **FastAPI**: Crea la aplicación principal
- **CORS**: Permite acceso desde cualquier dominio (importante para desarrollo)
- **Metadata**: Título, descripción y versión que aparece en /docs

---

## 🔗 **SECCIÓN 7: DEPENDENCIAS**

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **¿Qué hace?**
- **Dependency Injection**: Inyecta automáticamente una sesión de base de datos
- **Gestión automática**: Abre y cierra conexiones automáticamente
- **Usado en todos los endpoints**: Cada endpoint recibe `db: Session = Depends(get_db)`

---

## 🛣️ **SECCIÓN 8: ENDPOINTS (RUTAS DE LA API)**

### **Patrones de Endpoints:**

#### **POST (Crear)**
```python
@app.post("/roles/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role
```
**Función**: Crea nuevos registros

#### **GET (Leer todos)**
```python
@app.get("/roles/", response_model=List[RoleResponse])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(Role).offset(skip).limit(limit).all()
    return roles
```
**Función**: Obtiene lista con paginación

#### **GET (Leer uno)**
```python
@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_user == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
```
**Función**: Obtiene un registro específico por ID

#### **PATCH (Actualizar parcial)**
```python
@app.patch("/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, status: AppointmentStatusEnum, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id_appointment == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    appointment.status = status
    db.commit()
    return {"message": "Estado de cita actualizado correctamente"}
```
**Función**: Actualiza campos específicos

### **Endpoints Especiales:**

#### **Filtros por relación**
```python
@app.get("/cities/by-department/{department_id}", response_model=List[CityResponse])
def read_cities_by_department(department_id: int, db: Session = Depends(get_db)):
    cities = db.query(City).filter(City.id_department == department_id).all()
    return cities
```
**Función**: Obtiene ciudades de un departamento específico

#### **Relaciones complejas**
```python
@app.get("/appointments/by-customer/{customer_id}", response_model=List[AppointmentResponse])
def read_appointments_by_customer(customer_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.id_customer == customer_id).all()
    return appointments
```
**Función**: Obtiene todas las citas de un cliente

---

## 🏠 **SECCIÓN 9: ENDPOINTS DE SISTEMA**

#### **Endpoint raíz**
```python
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Barberian DB v2.0"}
```
**Función**: Mensaje de bienvenida

#### **Health Check**
```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}
```
**Función**: Verificar que la API esté funcionando

#### **Estadísticas**
```python
@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "users": db.query(User).count(),
        "customers": db.query(Customer).count(),
        "barbers": db.query(Barber).count(),
        "appointments": db.query(Appointment).count(),
        "barbershops": db.query(Barbershop).count(),
        "specialties": db.query(Specialty).count(),
        "departments": db.query(Department).count(),
        "cities": db.query(City).count()
    }
```
**Función**: Devuelve conteos de todos los tipos de datos

---

## 🚀 **SECCIÓN 10: EJECUCIÓN DEL SERVIDOR**

```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **¿Qué hace?**
- **Condicional**: Solo ejecuta si el archivo se ejecuta directamente
- **Uvicorn**: Servidor ASGI para ejecutar FastAPI
- **host="0.0.0.0"**: Acepta conexiones de cualquier IP
- **port=8000**: Puerto donde corre la aplicación

---

## 🌟 **CARACTERÍSTICAS PRINCIPALES DEL SISTEMA**

### **1. Gestión de Usuarios**
- ✅ Registro y autenticación
- ✅ Roles diferenciados (Cliente/Barbero/Admin)
- ✅ Perfiles con información personal

### **2. Gestión de Barberías**
- ✅ Registro de establecimientos
- ✅ Ubicaciones y horarios
- ✅ Gestión de personal

### **3. Gestión de Citas**
- ✅ Agendamiento de citas
- ✅ Estados (Pendiente, Confirmada, Cancelada, Completada)
- ✅ Horarios de barberos

### **4. Sistema de Especialidades**
- ✅ Especialidades de barberos
- ✅ Años de experiencia
- ✅ Sistema de puntos

### **5. Ubicaciones**
- ✅ Departamentos y ciudades
- ✅ Direcciones detalladas
- ✅ Horarios de funcionamiento

---

## 📚 **URLS IMPORTANTES**

Una vez ejecutado el servidor:

- **🏠 Inicio**: `http://localhost:8000/`
- **📖 Documentación Interactiva**: `http://localhost:8000/docs`
- **📋 Documentación ReDoc**: `http://localhost:8000/redoc`
- **💚 Health Check**: `http://localhost:8000/health`
- **📊 Estadísticas**: `http://localhost:8000/stats`

---

## 🔧 **COMANDOS PARA EJECUTAR**

```bash
# Activar entorno virtual
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py

# O con uvicorn directamente
uvicorn main:app --reload
```

---

## 📝 **NOTAS TÉCNICAS**

### **Seguridad**
- Las contraseñas se almacenan como hash (línea donde se crea el usuario)
- CORS habilitado para desarrollo (cambiar para producción)

### **Base de Datos**
- Usa SQLAlchemy ORM para abstracción de base de datos
- Relaciones definidas entre todas las tablas
- Soporte para MySQL mediante PyMySQL

### **Validación**
- Pydantic valida automáticamente todos los datos de entrada
- Esquemas separados para entrada y salida
- Validación de tipos y campos obligatorios

### **Documentación Automática**
- Swagger UI generado automáticamente en `/docs`
- Esquemas y ejemplos incluidos
- Pruebas interactivas disponibles