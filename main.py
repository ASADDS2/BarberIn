from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

# Importar módulos locales
from database import get_db, test_connection, engine
from models import Base
import schemas
import crud

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear la aplicación FastAPI
app = FastAPI(
    title="Barberin API",
    description="API completa para sistema de barbería",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware para CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_event():
    print("🚀 Iniciando Barberin API...")
    if test_connection():
        print("📊 Base de datos conectada correctamente")
    else:
        print("❌ Error al conectar con la base de datos")

@app.on_event("shutdown")
async def shutdown_event():
    print("👋 Cerrando Barberin API...")

# ENDPOINTS DE SALUD Y INFO
@app.get("/", tags=["Info"])
def root():
    return {
        "message": "Bienvenido a Barberin API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Info"])
def health_check():
    return {
        "status": "healthy",
        "message": "Barberin API funcionando correctamente",
        "database": "connected" if test_connection() else "disconnected"
    }

# ===========================================
# ENDPOINTS PARA ROLES
# ===========================================
@app.post("/roles/", response_model=schemas.Role, tags=["Roles"])
def create_role(role_data: schemas.RoleCreate, db: Session = Depends(get_db)):
    """Crear un nuevo rol"""
    return crud.role.create(db=db, obj_in=role_data)

@app.get("/roles/", response_model=List[schemas.Role], tags=["Roles"])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los roles"""
    return crud.role.get_multi(db=db, skip=skip, limit=limit)

@app.get("/roles/{role_id}", response_model=schemas.Role, tags=["Roles"])
def read_role(role_id: int, db: Session = Depends(get_db)):
    """Obtener un rol por ID"""
    role = crud.role.get(db=db, id=role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role

@app.put("/roles/{role_id}", response_model=schemas.Role, tags=["Roles"])
def update_role(role_id: int, role_data: schemas.RoleUpdate, db: Session = Depends(get_db)):
    """Actualizar un rol"""
    role = crud.role.get(db=db, id=role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return crud.role.update(db=db, db_obj=role, obj_in=role_data)

@app.delete("/roles/{role_id}", response_model=schemas.StandardResponse, tags=["Roles"])
def delete_role(role_id: int, db: Session = Depends(get_db)):
    """Eliminar un rol"""
    role = crud.role.delete(db=db, id=role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return schemas.StandardResponse(message="Rol eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA USUARIOS
# ===========================================
@app.post("/users/", response_model=schemas.User, tags=["Usuarios"])
def create_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Crear un nuevo usuario"""
    # Verificar si el username ya existe
    existing_user = crud.user.get_by_username(db=db, username=user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    return crud.user.create(db=db, obj_in=user_data)

@app.get("/users/", response_model=List[schemas.User], tags=["Usuarios"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los usuarios"""
    return crud.user.get_multi(db=db, skip=skip, limit=limit)

@app.get("/users/{user_id}", response_model=schemas.User, tags=["Usuarios"])
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Obtener un usuario por ID"""
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.put("/users/{user_id}", response_model=schemas.User, tags=["Usuarios"])
def update_user(user_id: int, user_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    """Actualizar un usuario"""
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return crud.user.update(db=db, db_obj=user, obj_in=user_data)

@app.delete("/users/{user_id}", response_model=schemas.StandardResponse, tags=["Usuarios"])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Eliminar un usuario"""
    user = crud.user.delete(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return schemas.StandardResponse(message="Usuario eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA GÉNEROS
# ===========================================
@app.post("/generes/", response_model=schemas.Genere, tags=["Géneros"])
def create_genere(genere_data: schemas.GenereCreate, db: Session = Depends(get_db)):
    """Crear un nuevo género"""
    return crud.genere.create(db=db, obj_in=genere_data)

@app.get("/generes/", response_model=List[schemas.Genere], tags=["Géneros"])
def read_generes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los géneros"""
    return crud.genere.get_multi(db=db, skip=skip, limit=limit)

@app.get("/generes/{genere_id}", response_model=schemas.Genere, tags=["Géneros"])
def read_genere(genere_id: int, db: Session = Depends(get_db)):
    """Obtener un género por ID"""
    genere = crud.genere.get(db=db, id=genere_id)
    if not genere:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return genere

@app.put("/generes/{genere_id}", response_model=schemas.Genere, tags=["Géneros"])
def update_genere(genere_id: int, genere_data: schemas.GenereUpdate, db: Session = Depends(get_db)):
    """Actualizar un género"""
    genere = crud.genere.get(db=db, id=genere_id)
    if not genere:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return crud.genere.update(db=db, db_obj=genere, obj_in=genere_data)

@app.delete("/generes/{genere_id}", response_model=schemas.StandardResponse, tags=["Géneros"])
def delete_genere(genere_id: int, db: Session = Depends(get_db)):
    """Eliminar un género"""
    genere = crud.genere.delete(db=db, id=genere_id)
    if not genere:
        raise HTTPException(status_code=404, detail="Género no encontrado")
    return schemas.StandardResponse(message="Género eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA CLIENTES
# ===========================================
@app.post("/customers/", response_model=schemas.Customer, tags=["Clientes"])
def create_customer(customer_data: schemas.CustomerCreate, db: Session = Depends(get_db)):
    """Crear un nuevo cliente"""
    # Verificar si el email ya existe
    existing_email = crud.customer.get_by_email(db=db, email=str(customer_data.email))
    if existing_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Verificar si el teléfono ya existe
    existing_phone = crud.customer.get_by_cellphone(db=db, cellphone=customer_data.cellphone)
    if existing_phone:
        raise HTTPException(status_code=400, detail="El teléfono ya está registrado")
    
    return crud.customer.create(db=db, obj_in=customer_data)

@app.get("/customers/", response_model=List[schemas.Customer], tags=["Clientes"])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los clientes"""
    return crud.customer.get_multi(db=db, skip=skip, limit=limit)

@app.get("/customers/{customer_id}", response_model=schemas.Customer, tags=["Clientes"])
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    """Obtener un cliente por ID"""
    customer = crud.customer.get(db=db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer

@app.put("/customers/{customer_id}", response_model=schemas.Customer, tags=["Clientes"])
def update_customer(customer_id: int, customer_data: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    """Actualizar un cliente"""
    customer = crud.customer.get(db=db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return crud.customer.update(db=db, db_obj=customer, obj_in=customer_data)

@app.delete("/customers/{customer_id}", response_model=schemas.StandardResponse, tags=["Clientes"])
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Eliminar un cliente"""
    customer = crud.customer.delete(db=db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return schemas.StandardResponse(message="Cliente eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA BARBEROS
# ===========================================
@app.post("/bhairs/", response_model=schemas.Bhair, tags=["Barberos"])
def create_bhair(bhair_data: schemas.BhairCreate, db: Session = Depends(get_db)):
    """Crear un nuevo barbero"""
    # Verificar si el email de trabajo ya existe
    existing_email = crud.bhair.get_by_email_work(db=db, email_work=str(bhair_data.email_work))
    if existing_email:
        raise HTTPException(status_code=400, detail="El email de trabajo ya está registrado")
    
    # Verificar si el teléfono ya existe
    existing_phone = crud.bhair.get_by_cellphone(db=db, cellphone=bhair_data.cellphone)
    if existing_phone:
        raise HTTPException(status_code=400, detail="El teléfono ya está registrado")
    
    return crud.bhair.create(db=db, obj_in=bhair_data)

@app.get("/bhairs/", response_model=List[schemas.Bhair], tags=["Barberos"])
def read_bhairs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los barberos"""
    return crud.bhair.get_multi(db=db, skip=skip, limit=limit)

@app.get("/bhairs/{bhair_id}", response_model=schemas.Bhair, tags=["Barberos"])
def read_bhair(bhair_id: int, db: Session = Depends(get_db)):
    """Obtener un barbero por ID"""
    bhair = crud.bhair.get(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return bhair

@app.put("/bhairs/{bhair_id}", response_model=schemas.Bhair, tags=["Barberos"])
def update_bhair(bhair_id: int, bhair_data: schemas.BhairUpdate, db: Session = Depends(get_db)):
    """Actualizar un barbero"""
    bhair = crud.bhair.get(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return crud.bhair.update(db=db, db_obj=bhair, obj_in=bhair_data)

@app.delete("/bhairs/{bhair_id}", response_model=schemas.StandardResponse, tags=["Barberos"])
def delete_bhair(bhair_id: int, db: Session = Depends(get_db)):
    """Eliminar un barbero"""
    bhair = crud.bhair.delete(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return schemas.StandardResponse(message="Barbero eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA SERVICIOS
# ===========================================
@app.post("/services/", response_model=schemas.Service, tags=["Servicios"])
def create_service(service_data: schemas.ServiceCreate, db: Session = Depends(get_db)):
    """Crear un nuevo servicio"""
    return crud.service.create(db=db, obj_in=service_data)

@app.get("/services/", response_model=List[schemas.Service], tags=["Servicios"])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los servicios"""
    return crud.service.get_multi(db=db, skip=skip, limit=limit)

@app.get("/services/{service_id}", response_model=schemas.Service, tags=["Servicios"])
def read_service(service_id: int, db: Session = Depends(get_db)):
    """Obtener un servicio por ID"""
    service = crud.service.get(db=db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return service

@app.put("/services/{service_id}", response_model=schemas.Service, tags=["Servicios"])
def update_service(service_id: int, service_data: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    """Actualizar un servicio"""
    service = crud.service.get(db=db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return crud.service.update(db=db, db_obj=service, obj_in=service_data)

@app.delete("/services/{service_id}", response_model=schemas.StandardResponse, tags=["Servicios"])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    """Eliminar un servicio"""
    service = crud.service.delete(db=db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return schemas.StandardResponse(message="Servicio eliminado exitosamente")

# ===========================================
# ENDPOINTS PARA CITAS
# ===========================================
@app.post("/quotes/", response_model=schemas.Quote, tags=["Citas"])
def create_quote(quote_data: schemas.QuoteCreate, db: Session = Depends(get_db)):
    """Crear una nueva cita"""
    # Verificar si el ticket_order ya existe
    existing_ticket = crud.quote.get_by_ticket_order(db=db, ticket_order=quote_data.ticket_order)
    if existing_ticket:
        raise HTTPException(status_code=400, detail="El número de ticket ya existe")
    
    return crud.quote.create(db=db, obj_in=quote_data)

@app.get("/quotes/", response_model=List[schemas.Quote], tags=["Citas"])
def read_quotes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todas las citas"""
    return crud.quote.get_multi(db=db, skip=skip, limit=limit)

@app.get("/quotes/{quote_id}", response_model=schemas.Quote, tags=["Citas"])
def read_quote(quote_id: int, db: Session = Depends(get_db)):
    """Obtener una cita por ID"""
    quote = crud.quote.get(db=db, id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return quote

@app.put("/quotes/{quote_id}", response_model=schemas.Quote, tags=["Citas"])
def update_quote(quote_id: int, quote_data: schemas.QuoteUpdate, db: Session = Depends(get_db)):
    """Actualizar una cita"""
    quote = crud.quote.get(db=db, id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return crud.quote.update(db=db, db_obj=quote, obj_in=quote_data)

@app.delete("/quotes/{quote_id}", response_model=schemas.StandardResponse, tags=["Citas"])
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    """Eliminar una cita"""
    quote = crud.quote.delete(db=db, id=quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return schemas.StandardResponse(message="Cita eliminada exitosamente")

# ===========================================
# ENDPOINTS PARA ESPECIALIDADES
# ===========================================
@app.post("/specialties/", response_model=schemas.Specialty, tags=["Especialidades"])
def create_specialty(specialty_data: schemas.SpecialtyCreate, db: Session = Depends(get_db)):
    """Crear una nueva especialidad"""
    return crud.specialty.create(db=db, obj_in=specialty_data)

@app.get("/specialties/", response_model=List[schemas.Specialty], tags=["Especialidades"])
def read_specialties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todas las especialidades"""
    return crud.specialty.get_multi(db=db, skip=skip, limit=limit)

@app.get("/specialties/{specialty_id}", response_model=schemas.Specialty, tags=["Especialidades"])
def read_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """Obtener una especialidad por ID"""
    specialty = crud.specialty.get(db=db, id=specialty_id)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return specialty

@app.put("/specialties/{specialty_id}", response_model=schemas.Specialty, tags=["Especialidades"])
def update_specialty(specialty_id: int, specialty_data: schemas.SpecialtyUpdate, db: Session = Depends(get_db)):
    """Actualizar una especialidad"""
    specialty = crud.specialty.get(db=db, id=specialty_id)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return crud.specialty.update(db=db, db_obj=specialty, obj_in=specialty_data)

@app.delete("/specialties/{specialty_id}", response_model=schemas.StandardResponse, tags=["Especialidades"])
def delete_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """Eliminar una especialidad"""
    specialty = crud.specialty.delete(db=db, id=specialty_id)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return schemas.StandardResponse(message="Especialidad eliminada exitosamente")

# ===========================================
# ENDPOINTS PARA ESTILOS
# ===========================================
@app.post("/styles/", response_model=schemas.Style, tags=["Estilos"])
def create_style(style_data: schemas.StyleCreate, db: Session = Depends(get_db)):
    """Crear un nuevo estilo"""
    return crud.style.create(db=db, obj_in=style_data)

@app.get("/styles/", response_model=List[schemas.Style], tags=["Estilos"])
def read_styles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los estilos"""
    return crud.style.get_multi(db=db, skip=skip, limit=limit)

@app.get("/styles/{style_id}", response_model=schemas.Style, tags=["Estilos"])
def read_style(style_id: int, db: Session = Depends(get_db)):
    """Obtener un estilo por ID"""
    style = crud.style.get(db=db, id=style_id)
    if not style:
        raise HTTPException(status_code=404, detail="Estilo no encontrado")
    return style

@app.put("/styles/{style_id}", response_model=schemas.Style, tags=["Estilos"])
def update_style(style_id: int, style_data: schemas.StyleUpdate, db: Session = Depends(get_db)):
    """Actualizar un estilo"""
    style = crud.style.get(db=db, id=style_id)
    if not style:
        raise HTTPException(status_code=404, detail="Estilo no encontrado")
    return crud.style.update(db=db, db_obj=style, obj_in=style_data)

@app.delete("/styles/{style_id}", response_model=schemas.StandardResponse, tags=["Estilos"])
def delete_style(style_id: int, db: Session = Depends(get_db)):
    """Eliminar un estilo"""
    style = crud.style.delete(db=db, id=style_id)
    if not style:
        raise HTTPException(status_code=404, detail="Estilo no encontrado")
    return schemas.StandardResponse(message="Estilo eliminado exitosamente")

# ===========================================
# ENDPOINTS RELACIONALES ADICIONALES
# ===========================================

# Obtener citas por barbero
@app.get("/bhairs/{bhair_id}/quotes", response_model=List[schemas.Quote], tags=["Relaciones"])
def get_quotes_by_bhair(bhair_id: int, db: Session = Depends(get_db)):
    """Obtener todas las citas de un barbero específico"""
    bhair = crud.bhair.get(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return crud.quote.get_by_bhair(db=db, bhair_id=bhair_id)

# Obtener servicios por barbero
@app.get("/bhairs/{bhair_id}/services", response_model=List[schemas.Service], tags=["Relaciones"])
def get_services_by_bhair(bhair_id: int, db: Session = Depends(get_db)):
    """Obtener todos los servicios de un barbero específico"""
    bhair = crud.bhair.get(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return crud.service.get_by_bhair(db=db, bhair_id=bhair_id)

# Obtener especialidades por barbero
@app.get("/bhairs/{bhair_id}/specialties", response_model=List[schemas.Specialty], tags=["Relaciones"])
def get_specialties_by_bhair(bhair_id: int, db: Session = Depends(get_db)):
    """Obtener todas las especialidades de un barbero específico"""
    bhair = crud.bhair.get(db=db, id=bhair_id)
    if not bhair:
        raise HTTPException(status_code=404, detail="Barbero no encontrado")
    return crud.specialty.get_by_bhair(db=db, bhair_id=bhair_id)

# Obtener citas por cliente
@app.get("/customers/{customer_id}/quotes", response_model=List[schemas.Quote], tags=["Relaciones"])
def get_quotes_by_customer(customer_id: int, db: Session = Depends(get_db)):
    """Obtener todas las citas de un cliente específico"""
    customer = crud.customer.get(db=db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return crud.quote.get_by_customer(db=db, customer_id=customer_id)

# Obtener estilos por especialidad
@app.get("/specialties/{specialty_id}/styles", response_model=List[schemas.Style], tags=["Relaciones"])
def get_styles_by_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """Obtener todos los estilos de una especialidad específica"""
    specialty = crud.specialty.get(db=db, id=specialty_id)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return crud.style.get_by_specialty(db=db, specialty_id=specialty_id)

# Ejecutar la aplicación
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )