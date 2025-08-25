<<<<<<< HEAD
# requirements.txt
"""
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pymysql==1.1.0
pydantic==2.5.0
python-multipart==0.0.6
passlib==1.7.4
python-jose==3.3.0
bcrypt==4.0.1
"""

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

# Configuración de la base de datos
DATABASE_URL = "mysql+pymysql://usuario:contraseña@localhost:3306/barberian_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
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
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"

# Modelos SQLAlchemy
class AuthProvider(Base):
    __tablename__ = "auth_provider"
    
    id_auth_provider = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(Enum(AuthProviderEnum), nullable=False)
    provider_id_google = Column(String(255))
    token = Column(String(255))
    
    user_auth_providers = relationship("UserAuthProvider", back_populates="auth_provider")

class Role(Base):
    __tablename__ = "roles"
    
    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    
    users = relationship("User", back_populates="role")

class Genre(Base):
    __tablename__ = "genres"
    
    id_genre = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    
    customers = relationship("Customer", back_populates="genre")
    barbers = relationship("Barber", back_populates="genre")

class Department(Base):
    __tablename__ = "departments"
    
    id_department = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    
    cities = relationship("City", back_populates="department")
    customers = relationship("Customer", back_populates="department")
    barbers = relationship("Barber", back_populates="department")
    locations = relationship("Location", back_populates="department")

class City(Base):
    __tablename__ = "citys"
    
    id_city = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
    
    department = relationship("Department", back_populates="cities")
    customers = relationship("Customer", back_populates="city")
    barbers = relationship("Barber", back_populates="city")
    locations = relationship("Location", back_populates="city")

class User(Base):
    __tablename__ = "users"
    
    id_user = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255))
    id_role = Column(Integer, ForeignKey("roles.id_role"))
    
    role = relationship("Role", back_populates="users")
    customer = relationship("Customer", back_populates="user", uselist=False)
    barber = relationship("Barber", back_populates="user", uselist=False)
    user_auth_providers = relationship("UserAuthProvider", back_populates="user")

class UserAuthProvider(Base):
    __tablename__ = "user_auth_provider"
    
    id_user = Column(Integer, ForeignKey("users.id_user"), primary_key=True)
    id_auth_provider = Column(Integer, ForeignKey("auth_provider.id_auth_provider"), primary_key=True)
    
    user = relationship("User", back_populates="user_auth_providers")
    auth_provider = relationship("AuthProvider", back_populates="user_auth_providers")

class Specialty(Base):
    __tablename__ = "specialties"
    
    id_specialty = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    years_experience = Column(Integer)
    
    barbers = relationship("Barber", back_populates="specialty")

class BarberSchedule(Base):
    __tablename__ = "barber_schedule"
    
    id_schedule = Column(Integer, primary_key=True, autoincrement=True)
    day_of_week = Column(Enum(DayOfWeekEnum), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    barbers = relationship("Barber", back_populates="schedule")

class Customer(Base):
    __tablename__ = "customers"
    
    id_customer = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    id_genre = Column(Integer, ForeignKey("genres.id_genre"), nullable=False)
    phone = Column(String(255))
    direction = Column(String(255))
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
    id_city = Column(Integer, ForeignKey("citys.id_city"), nullable=False)
    
    user = relationship("User", back_populates="customer")
    genre = relationship("Genre", back_populates="customers")
    department = relationship("Department", back_populates="customers")
    city = relationship("City", back_populates="customers")
    appointments = relationship("Appointment", back_populates="customer")

class Staff(Base):
    __tablename__ = "staff"
    
    id_staff = Column(Integer, primary_key=True, autoincrement=True)
    id_barber = Column(Integer, ForeignKey("barbers.id_barber"), nullable=False)
    
    barber = relationship("Barber", back_populates="staff")
    barbershops = relationship("Barbershop", back_populates="staff")

class Barbershop(Base):
    __tablename__ = "barbershops"
    
    id_barbershop = Column(Integer, primary_key=True, autoincrement=True)
    id_staff = Column(Integer, ForeignKey("staff.id_staff"), nullable=False)
    phone = Column(String(50))
    
    staff = relationship("Staff", back_populates="barbershops")
    barbers = relationship("Barber", back_populates="barbershop")
    locations = relationship("Location", back_populates="barbershop")

class Barber(Base):
    __tablename__ = "barbers"
    
    id_barber = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey("users.id_user"), nullable=False)
    id_genre = Column(Integer, ForeignKey("genres.id_genre"), nullable=False)
    id_barbershop = Column(Integer, ForeignKey("barbershops.id_barbershop"))
    id_specialty = Column(Integer, ForeignKey("specialties.id_specialty"))
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
    id_city = Column(Integer, ForeignKey("citys.id_city"), nullable=False)
    id_barber_schedule = Column(Integer, ForeignKey("barber_schedule.id_schedule"))
    phone = Column(String(255))
    direction = Column(String(255))
    points = Column(Integer, nullable=False, default=0)
    
    user = relationship("User", back_populates="barber")
    genre = relationship("Genre", back_populates="barbers")
    barbershop = relationship("Barbershop", back_populates="barbers")
    specialty = relationship("Specialty", back_populates="barbers")
    department = relationship("Department", back_populates="barbers")
    city = relationship("City", back_populates="barbers")
    schedule = relationship("BarberSchedule", back_populates="barbers")
    staff = relationship("Staff", back_populates="barber", uselist=False)
    appointments = relationship("Appointment", back_populates="barber")

class Location(Base):
    __tablename__ = "locations"
    
    id_location = Column(Integer, primary_key=True, autoincrement=True)
    id_barbershop = Column(Integer, ForeignKey("barbershops.id_barbershop"), nullable=False)
    id_department = Column(Integer, ForeignKey("departments.id_department"), nullable=False)
    id_city = Column(Integer, ForeignKey("citys.id_city"), nullable=False)
    address = Column(String(255), nullable=False)
    opening_hour = Column(Time, nullable=False)
    closing_hour = Column(Time, nullable=False)
    
    barbershop = relationship("Barbershop", back_populates="locations")
    department = relationship("Department", back_populates="locations")
    city = relationship("City", back_populates="locations")

class Appointment(Base):
    __tablename__ = "appointment"
    
    id_appointment = Column(Integer, primary_key=True, autoincrement=True)
    id_customer = Column(Integer, ForeignKey("customers.id_customer"), nullable=False)
    id_barber = Column(Integer, ForeignKey("barbers.id_barber"), nullable=False)
    appointment_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(AppointmentStatusEnum), default=AppointmentStatusEnum.pending)
    
    customer = relationship("Customer", back_populates="appointments")
    barber = relationship("Barber", back_populates="appointments")

# Esquemas Pydantic
class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id_role: int
    
    class Config:
        from_attributes = True

class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class GenreResponse(GenreBase):
    id_genre: int
    
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id_department: int
    
    class Config:
        from_attributes = True

class CityBase(BaseModel):
    name: str
    id_department: int

class CityCreate(CityBase):
    pass

class CityResponse(CityBase):
    id_city: int
    department: Optional[DepartmentResponse] = None
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    id_role: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id_user: int
    role: Optional[RoleResponse] = None
    
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    id_user: int
    id_genre: int
    phone: Optional[str] = None
    direction: Optional[str] = None
    id_department: int
    id_city: int

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id_customer: int
    user: Optional[UserResponse] = None
    genre: Optional[GenreResponse] = None
    department: Optional[DepartmentResponse] = None
    city: Optional[CityResponse] = None
    
    class Config:
        from_attributes = True

class SpecialtyBase(BaseModel):
    name: str
    years_experience: Optional[int] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyResponse(SpecialtyBase):
    id_specialty: int
    
    class Config:
        from_attributes = True

class BarberScheduleBase(BaseModel):
    day_of_week: DayOfWeekEnum
    start_time: time
    end_time: time

class BarberScheduleCreate(BarberScheduleBase):
    pass

class BarberScheduleResponse(BarberScheduleBase):
    id_schedule: int
    
    class Config:
        from_attributes = True

class BarberBase(BaseModel):
    id_user: int
    id_genre: int
    id_barbershop: Optional[int] = None
    id_specialty: Optional[int] = None
    id_department: int
    id_city: int
    id_barber_schedule: Optional[int] = None
    phone: Optional[str] = None
    direction: Optional[str] = None
    points: int = 0

class BarberCreate(BarberBase):
    pass

class BarberResponse(BarberBase):
    id_barber: int
    user: Optional[UserResponse] = None
    genre: Optional[GenreResponse] = None
    specialty: Optional[SpecialtyResponse] = None
    department: Optional[DepartmentResponse] = None
    city: Optional[CityResponse] = None
    schedule: Optional[BarberScheduleResponse] = None
    
    class Config:
        from_attributes = True

class BarbershopBase(BaseModel):
    id_staff: int
    phone: Optional[str] = None

class BarbershopCreate(BarbershopBase):
    pass

class BarbershopResponse(BarbershopBase):
    id_barbershop: int
    
    class Config:
        from_attributes = True

class LocationBase(BaseModel):
    id_barbershop: int
    id_department: int
    id_city: int
    address: str
    opening_hour: time
    closing_hour: time

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id_location: int
    barbershop: Optional[BarbershopResponse] = None
    department: Optional[DepartmentResponse] = None
    city: Optional[CityResponse] = None
    
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    id_customer: int
    id_barber: int
    appointment_date: date
    start_time: time
    end_time: time
    status: AppointmentStatusEnum = AppointmentStatusEnum.pending

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id_appointment: int
    customer: Optional[CustomerResponse] = None
    barber: Optional[BarberResponse] = None
    
    class Config:
        from_attributes = True

# Configuración de FastAPI
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

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints para Roles
@app.post("/roles/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@app.get("/roles/", response_model=List[RoleResponse])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(Role).offset(skip).limit(limit).all()
    return roles

# Endpoints para Géneros
@app.post("/genres/", response_model=GenreResponse)
def create_genre(genre: GenreCreate, db: Session = Depends(get_db)):
    db_genre = Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@app.get("/genres/", response_model=List[GenreResponse])
def read_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    genres = db.query(Genre).offset(skip).limit(limit).all()
    return genres

# Endpoints para Departamentos
@app.post("/departments/", response_model=DepartmentResponse)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@app.get("/departments/", response_model=List[DepartmentResponse])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    departments = db.query(Department).offset(skip).limit(limit).all()
    return departments

# Endpoints para Ciudades
@app.post("/cities/", response_model=CityResponse)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    db_city = City(**city.dict())
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

@app.get("/cities/", response_model=List[CityResponse])
def read_cities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cities = db.query(City).offset(skip).limit(limit).all()
    return cities

@app.get("/cities/by-department/{department_id}", response_model=List[CityResponse])
def read_cities_by_department(department_id: int, db: Session = Depends(get_db)):
    cities = db.query(City).filter(City.id_department == department_id).all()
    return cities

# Endpoints para Usuarios
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # En un caso real, aquí hashearías la contraseña
    user_data = user.dict()
    password = user_data.pop('password')
    user_data['password_hash'] = password  # Aquí deberías usar bcrypt
    
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_user == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# Endpoints para Clientes
@app.post("/customers/", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/", response_model=List[CustomerResponse])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

@app.get("/customers/{customer_id}", response_model=CustomerResponse)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id_customer == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer

# Endpoints para Especialidades
@app.post("/specialties/", response_model=SpecialtyResponse)
def create_specialty(specialty: SpecialtyCreate, db: Session = Depends(get_db)):
    db_specialty = Specialty(**specialty.dict())
    db.add(db_specialty)
    db.commit()
    db.refresh(db_specialty)
    return db_specialty

@app.get("/specialties/", response_model=List[SpecialtyResponse])
def read_specialties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    specialties = db.query(Specialty).offset(skip).limit(limit).all()
    return specialties

# Endpoints para Horarios de Barberos
@app.post("/barber-schedules/", response_model=BarberScheduleResponse)
def create_barber_schedule(schedule: BarberScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = BarberSchedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@app.get("/barber-schedules/", response_model=List[BarberScheduleResponse])
def read_barber_schedules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    schedules = db.query(BarberSchedule).offset(skip).limit(limit).all()
    return schedules

# Endpoints para Barberos
@app.post("/barbers/", response_model=BarberResponse)
def create_barber(barber: BarberCreate, db: Session = Depends(get_db)):
    db_barber = Barber(**barber.dict())
    db.add(db_barber)
    db.commit()
    db.refresh(db_barber)
    return db_barber

@app.get("/barbers/", response_model=List[BarberResponse])
def read_barbers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    barbers = db.query(Barber).offset(skip).limit(limit).all()
    return barbers

@app.get("/barbers/{barber_id}", response_model=BarberResponse)
def read_barber(barber_id: int, db: Session = Depends(get_db)):
    barber = db.query(Barber).filter(Barber.id_barber == barber_id).first()
    if barber is None:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return barber

@app.get("/barbers/by-city/{city_id}", response_model=List[BarberResponse])
def read_barbers_by_city(city_id: int, db: Session = Depends(get_db)):
    barbers = db.query(Barber).filter(Barber.id_city == city_id).all()
    return barbers

# Endpoints para Barberías
@app.post("/barbershops/", response_model=BarbershopResponse)
def create_barbershop(barbershop: BarbershopCreate, db: Session = Depends(get_db)):
    db_barbershop = Barbershop(**barbershop.dict())
    db.add(db_barbershop)
    db.commit()
    db.refresh(db_barbershop)
    return db_barbershop

@app.get("/barbershops/", response_model=List[BarbershopResponse])
def read_barbershops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    barbershops = db.query(Barbershop).offset(skip).limit(limit).all()
    return barbershops

# Endpoints para Ubicaciones
@app.post("/locations/", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    db_location = Location(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

@app.get("/locations/", response_model=List[LocationResponse])
def read_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    locations = db.query(Location).offset(skip).limit(limit).all()
    return locations

# Endpoints para Citas
@app.post("/appointments/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    db_appointment = Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@app.get("/appointments/", response_model=List[AppointmentResponse])
def read_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).offset(skip).limit(limit).all()
    return appointments

@app.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id_appointment == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment

@app.patch("/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, status: AppointmentStatusEnum, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id_appointment == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    appointment.status = status
    db.commit()
    return {"message": "Estado de cita actualizado correctamente"}

@app.get("/appointments/by-customer/{customer_id}", response_model=List[AppointmentResponse])
def read_appointments_by_customer(customer_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.id_customer == customer_id).all()
    return appointments

@app.get("/appointments/by-barber/{barber_id}", response_model=List[AppointmentResponse])
def read_appointments_by_barber(barber_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.id_barber == barber_id).all()
    return appointments

# Endpoint raíz
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Barberian DB v2.0"}

# Endpoint de salud
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

# Endpoint de estadísticas
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
=======
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BarberIn API", version="1.0.0")

# ----------------------------
# 📌 ESQUEMAS (Pydantic)
# ----------------------------
class RoleBase(BaseModel):
    customer: Optional[str] = None
    bhair: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    rol_id_int: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    password: str
    rol_id_int: Optional[int] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    user_id_int: int
    class Config:
        from_attributes = True

class GenereBase(BaseModel):
    name: str
    abv: Optional[str] = None

class GenereCreate(GenereBase):
    pass

class GenereResponse(GenereBase):
    genere_id_int: int
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    last_name: str
    cellphone: str
    email: EmailStr
    age: int
    genere_id_int: Optional[int] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id_customer_int: int
    class Config:
        from_attributes = True

class BhairBase(BaseModel):
    name: str
    last_name: str
    cellphone: str
    direction: str
    name_work: str
    email_work: EmailStr
    points: Optional[int] = None
    genere_id_int: Optional[int] = None

class BhairCreate(BhairBase):
    pass

class BhairResponse(BhairBase):
    bhair_id_int: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    Amount: int
    discount: Optional[float] = None
    type_service: str
    bhair_id_int: Optional[int] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id_service_int: int
    class Config:
        from_attributes = True

class QuoteBase(BaseModel):
    date_quote: datetime
    ticket_order: int
    description: str
    id_customer_int: Optional[int] = None
    id_service_int: Optional[int] = None
    bhair_id_int: Optional[int] = None

class QuoteCreate(QuoteBase):
    pass

class QuoteResponse(QuoteBase):
    quote_id_int: int
    class Config:
        from_attributes = True

class SpecialtyBase(BaseModel):
    name: str
    year_expertise: int
    bhair_id_int: Optional[int] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyResponse(SpecialtyBase):
    speciality_id_int: int
    class Config:
        from_attributes = True

class StyleBase(BaseModel):
    type: str
    name: str
    speciality_id_int: Optional[int] = None

class StyleCreate(StyleBase):
    pass

class StyleResponse(StyleBase):
    style_id: int
    class Config:
        from_attributes = True


# ----------------------------
# 📌 ENDPOINTS
# ----------------------------
@app.get("/")
def home():
    return {"message": "Bienvenido a la API de BarberIn"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "ok", "db": "connected"}
    except:
        raise HTTPException(status_code=500, detail="Error de conexión a la BD")

# -------- Roles --------
@app.post("/roles/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = models.Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@app.get("/roles/", response_model=List[RoleResponse])
def read_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()

# -------- Users --------
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# -------- Generes --------
@app.post("/generes/", response_model=GenereResponse)
def create_genere(genere: GenereCreate, db: Session = Depends(get_db)):
    db_genere = models.Genere(**genere.dict())
    db.add(db_genere)
    db.commit()
    db.refresh(db_genere)
    return db_genere

@app.get("/generes/", response_model=List[GenereResponse])
def read_generes(db: Session = Depends(get_db)):
    return db.query(models.Genere).all()

# -------- Customers --------
@app.post("/customers/", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/", response_model=List[CustomerResponse])
def read_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

# -------- Bhairs --------
@app.post("/bhairs/", response_model=BhairResponse)
def create_bhair(bhair: BhairCreate, db: Session = Depends(get_db)):
    db_bhair = models.Bhair(**bhair.dict())
    db.add(db_bhair)
    db.commit()
    db.refresh(db_bhair)
    return db_bhair

@app.get("/bhairs/", response_model=List[BhairResponse])
def read_bhairs(db: Session = Depends(get_db)):
    return db.query(models.Bhair).all()

# -------- Services --------
@app.post("/services/", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.get("/services/", response_model=List[ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

# -------- Quotes --------
@app.post("/quotes/", response_model=QuoteResponse)
def create_quote(quote: QuoteCreate, db: Session = Depends(get_db)):
    db_quote = models.Quote(**quote.dict())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@app.get("/quotes/", response_model=List[QuoteResponse])
def read_quotes(db: Session = Depends(get_db)):
    return db.query(models.Quote).all()

# -------- Specialties --------
@app.post("/specialties/", response_model=SpecialtyResponse)
def create_specialty(specialty: SpecialtyCreate, db: Session = Depends(get_db)):
    db_specialty = models.Specialty(**specialty.dict())
    db.add(db_specialty)
    db.commit()
    db.refresh(db_specialty)
    return db_specialty

@app.get("/specialties/", response_model=List[SpecialtyResponse])
def read_specialties(db: Session = Depends(get_db)):
    return db.query(models.Specialty).all()

# -------- Styles --------
@app.post("/styles/", response_model=StyleResponse)
def create_style(style: StyleCreate, db: Session = Depends(get_db)):
    db_style = models.Style(**style.dict())
    db.add(db_style)
    db.commit()
    db.refresh(db_style)
    return db_style

@app.get("/styles/", response_model=List[StyleResponse])
def read_styles(db: Session = Depends(get_db)):
    return db.query(models.Style).all()
>>>>>>> b837d702a2875bb52dc6ed9de524e6b64915bfee
