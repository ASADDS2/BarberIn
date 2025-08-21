from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional, Type, TypeVar, Generic
from . import models, schemas

# Generic CRUD operations
ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: int) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in.dict()
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType) -> ModelType:
        obj_data = obj_in.model_dump(exclude_unset=True) if hasattr(obj_in, 'model_dump') else obj_in.dict(exclude_unset=True)
        
        for field, value in obj_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: int) -> Optional[ModelType]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Role CRUD
class CRUDRole(CRUDBase[models.Role, schemas.RoleCreate, schemas.RoleUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Role]:
        return db.query(models.Role).filter(models.Role.rol_id_int == id).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.Role]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# User CRUD
class CRUDUser(CRUDBase[models.User, schemas.UserCreate, schemas.UserUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.user_id_int == id).first()

    def get_by_username(self, db: Session, username: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.username == username).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.User]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Genere CRUD
class CRUDGenere(CRUDBase[models.Genere, schemas.GenereCreate, schemas.GenereUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Genere]:
        return db.query(models.Genere).filter(models.Genere.genere_id_int == id).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.Genere]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Customer CRUD
class CRUDCustomer(CRUDBase[models.Customer, schemas.CustomerCreate, schemas.CustomerUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Customer]:
        return db.query(models.Customer).filter(models.Customer.id_customer_int == id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[models.Customer]:
        return db.query(models.Customer).filter(models.Customer.email == email).first()

    def get_by_cellphone(self, db: Session, cellphone: str) -> Optional[models.Customer]:
        return db.query(models.Customer).filter(models.Customer.cellphone == cellphone).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.Customer]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Bhair CRUD
class CRUDBhair(CRUDBase[models.Bhair, schemas.BhairCreate, schemas.BhairUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Bhair]:
        return db.query(models.Bhair).filter(models.Bhair.bhair_id_int == id).first()

    def get_by_email_work(self, db: Session, email_work: str) -> Optional[models.Bhair]:
        return db.query(models.Bhair).filter(models.Bhair.email_work == email_work).first()

    def get_by_cellphone(self, db: Session, cellphone: str) -> Optional[models.Bhair]:
        return db.query(models.Bhair).filter(models.Bhair.cellphone == cellphone).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.Bhair]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Service CRUD
class CRUDService(CRUDBase[models.Service, schemas.ServiceCreate, schemas.ServiceUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Service]:
        return db.query(models.Service).filter(models.Service.id_service_int == id).first()

    def get_by_bhair(self, db: Session, bhair_id: int) -> List[models.Service]:
        return db.query(models.Service).filter(models.Service.bhair_id_int == bhair_id).all()

    def delete(self, db: Session, *, id: int) -> Optional[models.Service]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Quote CRUD
class CRUDQuote(CRUDBase[models.Quote, schemas.QuoteCreate, schemas.QuoteUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Quote]:
        return db.query(models.Quote).filter(models.Quote.quote_id_int == id).first()

    def get_by_customer(self, db: Session, customer_id: int) -> List[models.Quote]:
        return db.query(models.Quote).filter(models.Quote.id_customer_int == customer_id).all()

    def get_by_bhair(self, db: Session, bhair_id: int) -> List[models.Quote]:
        return db.query(models.Quote).filter(models.Quote.bhair_id_int == bhair_id).all()

    def get_by_ticket_order(self, db: Session, ticket_order: int) -> Optional[models.Quote]:
        return db.query(models.Quote).filter(models.Quote.ticket_order == ticket_order).first()

    def delete(self, db: Session, *, id: int) -> Optional[models.Quote]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Specialty CRUD
class CRUDSpecialty(CRUDBase[models.Specialty, schemas.SpecialtyCreate, schemas.SpecialtyUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Specialty]:
        return db.query(models.Specialty).filter(models.Specialty.speciality_id_int == id).first()

    def get_by_bhair(self, db: Session, bhair_id: int) -> List[models.Specialty]:
        return db.query(models.Specialty).filter(models.Specialty.bhair_id_int == bhair_id).all()

    def delete(self, db: Session, *, id: int) -> Optional[models.Specialty]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Style CRUD
class CRUDStyle(CRUDBase[models.Style, schemas.StyleCreate, schemas.StyleUpdate]):
    def get(self, db: Session, id: int) -> Optional[models.Style]:
        return db.query(models.Style).filter(models.Style.style_id == id).first()

    def get_by_specialty(self, db: Session, specialty_id: int) -> List[models.Style]:
        return db.query(models.Style).filter(models.Style.speciality_id_int == specialty_id).all()

    def delete(self, db: Session, *, id: int) -> Optional[models.Style]:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

# Instancias de CRUD
role = CRUDRole(models.Role)
user = CRUDUser(models.User)
genere = CRUDGenere(models.Genere)
customer = CRUDCustomer(models.Customer)
bhair = CRUDBhair(models.Bhair)
service = CRUDService(models.Service)
quote = CRUDQuote(models.Quote)
specialty = CRUDSpecialty(models.Specialty)
style = CRUDStyle(models.Style)