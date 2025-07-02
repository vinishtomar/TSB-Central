from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import os
from dotenv import load_dotenv

# --- Database Imports ---
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, func

# --- Local Imports ---
import models
from models import Base
import initial_data # We will use this to get our seed data

# Load environment variables from .env file
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("FATAL: DATABASE_URL environment variable is not set. Please create a .env file.")

# --- Pydantic Models (for API validation, they remain the same) ---
# These ensure data sent to/from the API matches the expected format.
class Client(BaseModel):
    id: int; nom: str; contact: str; email: str; telephone: str; adresse: str; statut: str; secteur: str; chiffreAffaires: float; nbProjets: int; dernierContact: date; commercial: str
    class Config: orm_mode = True

class Vehicle(BaseModel):
    id: int; nom: str; type: str; marque: str; modele: str; immatriculation: Optional[str] = None; numeroSerie: Optional[str] = None; annee: int; heuresUtilisation: int; statut: str; localisation: str; dernierEntretien: date; prochainEntretien: date; coutHoraire: float; conducteur: str; observations: str
    class Config: orm_mode = True

class Devis(BaseModel):
    id: str; client: str; contact: str; projet: str; montant: float; tva: float; montantTTC: float; statut: str; dateCreation: date; dateValidite: date; dureeEstimee: str; commercial: str; equipements: List[str]; marge: float; probabilite: int
    class Config: orm_mode = True

class Alerte(BaseModel):
    id: int; type: str; titre: str; description: str; equipement: str; priorite: str; echeance: date; estimationCout: float; responsable: str; statut: str
    class Config: orm_mode = True

class Stats(BaseModel):
    totalClients: int; clientsActifs: int; totalVehicules: int; vehiculesOperationnels: int; caRealise: float; tauxConversion: float

# --- FastAPI App Initialization ---
app = FastAPI(title="GestionPro API with PostgreSQL")

# --- CORS Middleware ---
# This allows the frontend (running on a different port) to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # The origin of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Connection Setup ---
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Dependency to get a database session for each request
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# --- API Endpoints ---

@app.get("/seed-database", summary="One-time data seeding")
async def seed_database(db: AsyncSession = Depends(get_db)):
    """
    This endpoint is for one-time use to populate the database with initial data.
    It checks if data already exists to prevent duplicates.
    """
    first_client_check = await db.execute(select(models.Client).limit(1))
    if first_client_check.first():
        raise HTTPException(status_code=400, detail="Database has already been seeded.")

    # Add initial data from the mock data file
    db.add_all([models.Client(**c) for c in initial_data.mock_data["clients"]])
    db.add_all([models.Vehicle(**v) for v in initial_data.mock_data["vehicles"]])
    db.add_all([models.Devis(**d) for d in initial_data.mock_data["devis"]])
    db.add_all([models.Alerte(**a) for a in initial_data.mock_data["alertes"]])
    
    await db.commit()
    return {"message": "Database has been seeded successfully."}


@app.get("/api/stats", response_model=Stats, summary="Get key performance indicators")
async def get_stats(db: AsyncSession = Depends(get_db)):
    """
    Retrieves the main statistics by querying the database.
    """
    total_clients = (await db.execute(select(func.count(models.Client.id)))).scalar_one()
    active_clients = (await db.execute(select(func.count(models.Client.id)).where(models.Client.statut == 'Actif'))).scalar_one()
    total_vehicles = (await db.execute(select(func.count(models.Vehicle.id)))).scalar_one()
    op_vehicles = (await db.execute(select(func.count(models.Vehicle.id)).where(models.Vehicle.statut == 'Opérationnel'))).scalar_one()
    ca_realise = (await db.execute(select(func.sum(models.Devis.montantTTC)).where(models.Devis.statut == 'Accepté'))).scalar_one() or 0.0
    
    total_devis = (await db.execute(select(func.count(models.Devis.id)))).scalar_one()
    accepted_devis = (await db.execute(select(func.count(models.Devis.id)).where(models.Devis.statut == 'Accepté'))).scalar_one()

    conversion_rate = round((accepted_devis / total_devis) * 100, 1) if total_devis > 0 else 0

    return {
        "totalClients": total_clients, "clientsActifs": active_clients,
        "totalVehicules": total_vehicles, "vehiculesOperationnels": op_vehicles,
        "caRealise": ca_realise, "tauxConversion": conversion_rate,
    }

@app.get("/api/clients", response_model=List[Client], summary="Get all clients")
async def get_clients(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Client).order_by(models.Client.nom))
    return result.scalars().all()

@app.get("/api/vehicles", response_model=List[Vehicle], summary="Get all vehicles")
async def get_vehicles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Vehicle).order_by(models.Vehicle.nom))
    return result.scalars().all()

@app.get("/api/devis", response_model=List[Devis], summary="Get all quotes")
async def get_devis(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Devis).order_by(models.Devis.dateCreation.desc()))
    return result.scalars().all()

@app.get("/api/alertes", response_model=List[Alerte], summary="Get all alerts")
async def get_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Alerte).order_by(models.Alerte.echeance))
    return result.scalars().all()

# Create a new file named `initial_data.py` in the backend directory
# and paste the mock data dictionary into it.
# This keeps the main file clean.
#
# initial_data.py
# mock_data = { ... }
