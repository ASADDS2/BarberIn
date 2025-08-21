from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

# Esquemas base
class RoleBase(BaseModel):
    customer: Optional[str] = None
    bhair: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    pass

class Role(RoleBase):
    model_config = ConfigDict(from_attributes=True)
    
    rol_id_int: int
    created_at: datetime
    update_at: datetime

# User schemas
class UserBase(BaseModel):
    username: str
    rol_id_int: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    rol_id_int: Optional[int] = None

class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    user_id_int: int
    created_at: datetime
    update_at: datetime

# Genere schemas
class GenereBase(BaseModel):
    name: Optional[str] = None
    abv: Optional[str] = None

class GenereCreate(GenereBase):
    pass

class GenereUpdate(GenereBase):
    pass

class Genere(GenereBase):
    model_config = ConfigDict(from_attributes=True)
    
    genere_id_int: int
    created_at: datetime
    update_at: datetime

# Customer schemas
class CustomerBase(BaseModel):
    name: str
    last_name: str
    cellphone: str
    email: EmailStr
    age: int
    genere_id_int: Optional[int] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    last_name: Optional[str] = None
    cellphone: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    genere_id_int: Optional[int] = None

class Customer(CustomerBase):
    model_config = ConfigDict(from_attributes=True)
    
    id_customer_int: int
    created_at: datetime
    update_at: datetime

# Bhair schemas
class BhairBase(BaseModel):
    name: str
    last_name: str
    cellphone: str
    direction: str
    name_work: str
    email_work: EmailStr
    points: Optional[int] = 0
    genere_id_int: Optional[int] = None

class BhairCreate(BhairBase):
    pass

class BhairUpdate(BaseModel):
    name: Optional[str] = None
    last_name: Optional[str] = None
    cellphone: Optional[str] = None
    direction: Optional[str] = None
    name_work: Optional[str] = None
    email_work: Optional[EmailStr] = None
    points: Optional[int] = None
    genere_id_int: Optional[int] = None

class Bhair(BhairBase):
    model_config = ConfigDict(from_attributes=True)
    
    bhair_id_int: int
    created_at: datetime
    update_at: datetime

# Service schemas
class ServiceBase(BaseModel):
    Amount: int
    discount: Optional[float] = 0.0
    type_service: str
    bhair_id_int: Optional[int] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    Amount: Optional[int] = None
    discount: Optional[float] = None
    type_service: Optional[str] = None
    bhair_id_int: Optional[int] = None

class Service(ServiceBase):
    model_config = ConfigDict(from_attributes=True)
    
    id_service_int: int
    created_at: datetime
    update_at: datetime

# Quote schemas
class QuoteBase(BaseModel):
    date_quote: datetime
    ticket_order: int
    description: str
    id_customer_int: Optional[int] = None
    id_service_int: Optional[int] = None
    bhair_id_int: Optional[int] = None

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    date_quote: Optional[datetime] = None
    ticket_order: Optional[int] = None
    description: Optional[str] = None
    id_customer_int: Optional[int] = None
    id_service_int: Optional[int] = None
    bhair_id_int: Optional[int] = None

class Quote(QuoteBase):
    model_config = ConfigDict(from_attributes=True)
    
    quote_id_int: int
    created_at: datetime
    update_at: datetime

# Specialty schemas
class SpecialtyBase(BaseModel):
    name: str
    year_expertise: int
    bhair_id_int: Optional[int] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyUpdate(BaseModel):
    name: Optional[str] = None
    year_expertise: Optional[int] = None
    bhair_id_int: Optional[int] = None

class Specialty(SpecialtyBase):
    model_config = ConfigDict(from_attributes=True)
    
    speciality_id_int: int
    created_at: datetime
    update_at: datetime

# Style schemas
class StyleBase(BaseModel):
    type: str
    name: str
    speciality_id_int: Optional[int] = None

class StyleCreate(StyleBase):
    pass

class StyleUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    speciality_id_int: Optional[int] = None

class Style(StyleBase):
    model_config = ConfigDict(from_attributes=True)
    
    style_id: int
    created_at: datetime
    update_at: datetime

# Respuesta estándar para operaciones
class StandardResponse(BaseModel):
    message: str
    success: bool = True