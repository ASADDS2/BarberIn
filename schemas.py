from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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
    created_at: datetime

    class Config:
        from_attributes = True
