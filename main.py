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
