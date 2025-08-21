from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Role(Base):
    __tablename__ = "roles"
    
    rol_id_int = Column(Integer, primary_key=True, index=True)
    customer = Column(String(255))
    bhair = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    
    user_id_int = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    rol_id_int = Column(Integer, ForeignKey("roles.rol_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    role = relationship("Role", back_populates="users")

class Genere(Base):
    __tablename__ = "generes"
    
    genere_id_int = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    abv = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    customers = relationship("Customer", back_populates="genere")
    bhairs = relationship("Bhair", back_populates="genere")

class Customer(Base):
    __tablename__ = "customers"
    
    id_customer_int = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    cellphone = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    age = Column(Integer, nullable=False)
    genere_id_int = Column(Integer, ForeignKey("generes.genere_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    genere = relationship("Genere", back_populates="customers")
    quotes = relationship("Quote", back_populates="customer")

class Bhair(Base):
    __tablename__ = "bhairs"
    
    bhair_id_int = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    cellphone = Column(String(255), nullable=False, unique=True)
    direction = Column(String(255), nullable=False)
    name_work = Column(String(255), nullable=False)
    email_work = Column(String(255), nullable=False, unique=True)
    points = Column(Integer, default=0)
    genere_id_int = Column(Integer, ForeignKey("generes.genere_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    genere = relationship("Genere", back_populates="bhairs")
    services = relationship("Service", back_populates="bhair")
    quotes = relationship("Quote", back_populates="bhair")
    specialties = relationship("Specialty", back_populates="bhair")

class Service(Base):
    __tablename__ = "services"
    
    id_service_int = Column(Integer, primary_key=True, index=True)
    Amount = Column(Integer, nullable=False)
    discount = Column(DECIMAL(10, 2), default=0.00)
    type_service = Column(String(255), nullable=False)
    bhair_id_int = Column(Integer, ForeignKey("bhairs.bhair_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    bhair = relationship("Bhair", back_populates="services")
    quotes = relationship("Quote", back_populates="service")

class Quote(Base):
    __tablename__ = "quotes"
    
    quote_id_int = Column(Integer, primary_key=True, index=True)
    date_quote = Column(DateTime, nullable=False)
    ticket_order = Column(Integer, nullable=False, unique=True)
    description = Column(String(255), nullable=False)
    id_customer_int = Column(Integer, ForeignKey("customers.id_customer_int"))
    id_service_int = Column(Integer, ForeignKey("services.id_service_int"))
    bhair_id_int = Column(Integer, ForeignKey("bhairs.bhair_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    customer = relationship("Customer", back_populates="quotes")
    service = relationship("Service", back_populates="quotes")
    bhair = relationship("Bhair", back_populates="quotes")

class Specialty(Base):
    __tablename__ = "specialties"
    
    speciality_id_int = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    year_expertise = Column(Integer, nullable=False)
    bhair_id_int = Column(Integer, ForeignKey("bhairs.bhair_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    bhair = relationship("Bhair", back_populates="specialties")
    styles = relationship("Style", back_populates="specialty")

class Style(Base):
    __tablename__ = "styles"
    
    style_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    speciality_id_int = Column(Integer, ForeignKey("specialties.speciality_id_int"))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    update_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    
    # Relaciones
    specialty = relationship("Specialty", back_populates="styles")