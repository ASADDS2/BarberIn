# 📖 Complete Documentation - main.py
## Barbershop Management System - BarberIn API

---

## 🔧 **SECTION 1: IMPORTS AND DEPENDENCIES**

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

### **What does it do?**
- **FastAPI**: Main framework for creating the REST API
- **SQLAlchemy**: ORM for handling the MySQL database
- **Pydantic**: Data validation and serialization
- **Typing**: Static typing for better development
- **Datetime**: Date and time management

---

## 🗄️ **SECTION 2: DATABASE CONFIGURATION**

```python
DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/barberian_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### **What does it do?**
- **DATABASE_URL**: MySQL connection string using PyMySQL
- **engine**: SQLAlchemy engine that manages connections
- **SessionLocal**: Factory to create database sessions
- **Base**: Base class for all ORM models

---

## 📊 **SECTION 3: ENUMERATIONS (ENUMS)**

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
    # ... rest of days
```

### **What does it do?**
- Defines constant values for specific fields
- **AuthProviderEnum**: Authentication types (local/Google)
- **AppointmentStatusEnum**: Appointment statuses
- **DayOfWeekEnum**: Days of the week for schedules

---

## 🏗️ **SECTION 4: DATABASE MODELS (SQLAlchemy)**

### **AuthProvider - Authentication Providers**
```python
class AuthProvider(Base):
    __tablename__ = "auth_provider"
    
    id_auth_provider = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(Enum(AuthProviderEnum), nullable=False)
    provider_id_google = Column(String(255))
    token = Column(String(255))
```
**Function**: Stores authentication info (Google, local)

### **Role - User Roles**
```python
class Role(Base):
    __tablename__ = "roles"
    
    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
```
**Function**: Defines roles (Client, Barber, Admin, etc.)

### **Genre - Genders**
```python
class Genre(Base):
    __tablename__ = "genres"
    
    id_genre = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
```
**Function**: Stores genders (Male, Female, Other)

### **Department - Departments**
```python
class Department(Base):
    __tablename__ = "departments"
    
    id_department = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
```
**Function**: States/departments of the country

### **City - Cities**
```python
class City(Base):
    __tablename__ = "citys"
    
    id_city = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
```
**Function**: Cities belonging to departments

### **User - System Users**
```python
class User(Base):
    __tablename__ = "users"
    
    id_user = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255))
    id_role = Column(Integer, ForeignKey("roles.id_role"))
```
**Function**: Base users of the system (clients, barbers, admins)

### **Customer - Clients**
```python
class Customer(Base):
    __tablename__ = "customers"
    
    id_customer = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    id_genre = Column(Integer, ForeignKey("genres.id_genre"), nullable=False)
    phone = Column(String(255))
    direction = Column(String(255))
    # ... more fields
```
**Function**: Specific client information

### **Specialty - Barber Specialties**
```python
class Specialty(Base):
    __tablename__ = "specialties"
    
    id_specialty = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    years_experience = Column(Integer)
```
**Function**: Specialties (Classic cut, Beard, Coloring, etc.)

### **BarberSchedule - Barber Schedules**
```python
class BarberSchedule(Base):
    __tablename__ = "barber_schedule"
    
    id_schedule = Column(Integer, primary_key=True, autoincrement=True)
    day_of_week = Column(Enum(DayOfWeekEnum), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
```
**Function**: Work schedules for each barber

### **Barber - Barbers**
```python
class Barber(Base):
    __tablename__ = "barbers"
    
    id_barber = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    # ... many relationships and fields
    points = Column(Integer, nullable=False, default=0)
```
**Function**: Specific barber information (specialty, points, location)

### **Staff - Staff**
```python
class Staff(Base):
    __tablename__ = "staff"
    
    id_staff = Column(Integer, primary_key=True, autoincrement=True)
    id_barber = Column(Integer, ForeignKey("barbers.id_barber"), nullable=False)
```
**Function**: Groups barbers into work teams

### **Barbershop - Barbershops**
```python
class Barbershop(Base):
    __tablename__ = "barbershops"
    
    id_barbershop = Column(Integer, primary_key=True, autoincrement=True)
    id_staff = Column(Integer, ForeignKey("staff.id_staff"), nullable=False)
    phone = Column(String(50))
```
**Function**: Physical barbershop establishments

### **Location - Locations**
```python
class Location(Base):
    __tablename__ = "locations"
    
    id_location = Column(Integer, primary_key=True, autoincrement=True)
    # ... address and schedule info
    opening_hour = Column(Time, nullable=False)
    closing_hour = Column(Time, nullable=False)
```
**Function**: Physical addresses and barbershop hours

### **Appointment - Appointments**
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
**Function**: Scheduled appointments between clients and barbers

---

## 📋 **SECTION 5: PYDANTIC SCHEMAS (DATA VALIDATION)**

### **What are Pydantic schemas?**
Schemas define how data entering and leaving the API should look.

### **Schema Patterns:**

#### **Base Schema**
```python
class RoleBase(BaseModel):
    name: str
```
**Function**: Defines common fields

#### **Create Schema**
```python
class RoleCreate(RoleBase):
    pass
```
**Function**: Defines required data for creation

#### **Response Schema**
```python
class RoleResponse(RoleBase):
    id_role: int
    
    class Config:
        from_attributes = True
```
**Function**: Defines returned data, includes ID

### **Important Schemas:**

- **UserCreate**: Includes password for registration
- **UserResponse**: Does not include password for security
- **CustomerResponse**: Includes relationships (user, genre, city, department)
- **AppointmentResponse**: Includes complete client and barber info

---

## 🚀 **SECTION 6: FASTAPI CONFIGURATION**

```python
app = FastAPI(
    title="Barberian API",
    description="Complete API for barbershop management system",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **What does it do?**
- **FastAPI**: Creates the main application
- **CORS**: Allows access from any domain (important for development)
- **Metadata**: Title, description, and version shown in /docs

---

## 🔗 **SECTION 7: DEPENDENCIES**

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **What does it do?**
- **Dependency Injection**: Automatically injects a database session
- **Automatic management**: Opens and closes connections automatically
- **Used in all endpoints**: Each endpoint receives `db: Session = Depends(get_db)`

---

## 🛣️ **SECTION 8: API ENDPOINTS (ROUTES)**

### **Endpoint Patterns:**

#### **POST (Create)**
```python
@app.post("/roles/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role
```
**Function**: Creates new records

#### **GET (Read all)**
```python
@app.get("/roles/", response_model=List[RoleResponse])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(Role).offset(skip).limit(limit).all()
    return roles
```
**Function**: Gets a paginated list

#### **GET (Read one)**
```python
@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_user == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```
**Function**: Gets a specific record by ID

#### **PATCH (Partial update)**
```python
@app.patch("/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, status: AppointmentStatusEnum, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id_appointment == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = status
    db.commit()
    return {"message": "Appointment status updated successfully"}
```
**Function**: Updates specific fields

### **Special Endpoints:**

#### **Filters by relationship**
```python
@app.get("/cities/by-department/{department_id}", response_model=List[CityResponse])
def read_cities_by_department(department_id: int, db: Session = Depends(get_db)):
    cities = db.query(City).filter(City.id_department == department_id).all()
    return cities
```
**Function**: Gets cities of a specific department

#### **Complex relationships**
```python
@app.get("/appointments/by-customer/{customer_id}", response_model=List[AppointmentResponse])
def read_appointments_by_customer(customer_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.id_customer == customer_id).all()
    return appointments
```
**Function**: Gets all appointments for a client

---

## 🏠 **SECTION 9: SYSTEM ENDPOINTS**

#### **Root endpoint**
```python
@app.get("/")
def read_root():
    return {"message": "Welcome to Barberian DB API v2.0"}
```
**Function**: Welcome message

#### **Health Check**
```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}
```
**Function**: Checks if the API is running

#### **Statistics**
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
**Function**: Returns counts of all data types

---

## 🚀 **SECTION 10: SERVER EXECUTION**

```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **What does it do?**
- **Conditional**: Only runs if the file is executed directly
- **Uvicorn**: ASGI server to run FastAPI
- **host="0.0.0.0"**: Accepts connections from any IP
- **port=8000**: Port where the app runs

---

## 🌟 **MAIN SYSTEM FEATURES**

### **1. User Management**
- ✅ Registration and authentication
- ✅ Differentiated roles (Client/Barber/Admin)
- ✅ Profiles with personal information

### **2. Barbershop Management**
- ✅ Establishment registration
- ✅ Locations and schedules
- ✅ Staff management

### **3. Appointment Management**
- ✅ Appointment scheduling
- ✅ Statuses (Pending, Confirmed, Cancelled, Completed)
- ✅ Barber schedules

### **4. Specialty System**
- ✅ Barber specialties
- ✅ Years of experience
- ✅ Points system

### **5. Locations**
- ✅ Departments and cities
- ✅ Detailed addresses
- ✅ Operating hours

---

## 📚 **IMPORTANT URLS**

Once the server is running:

- **🏠 Home**: `http://localhost:8000/`
- **📖 Interactive Documentation**: `http://localhost:8000/docs`
- **📋 ReDoc Documentation**: `http://localhost:8000/redoc`
- **💚 Health Check**: `http://localhost:8000/health`
- **📊 Statistics**: `http://localhost:8000/stats`

---

## 🔧 **COMMANDS TO RUN**

```bash
# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Or with uvicorn directly
uvicorn main:app --reload
```

---

## 📝 **TECHNICAL NOTES**

### **Security**
- Passwords are stored as hashes (line where user is created)
- CORS enabled for development (change for production)

### **Database**
- Uses SQLAlchemy ORM for database abstraction
- Relationships defined between all tables
- MySQL support via PyMySQL

### **Validation**
- Pydantic automatically validates all input data
- Separate schemas for input and output
- Type and required field validation

### **Automatic Documentation**
- Swagger UI automatically generated at `/docs`
- Schemas and examples included
- Interactive testing available