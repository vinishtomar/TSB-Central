from sqlalchemy import (Column, Integer, String, Float, Date, ARRAY, create_engine,
                        Boolean, Text)
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# A standard SQLAlchemy base class
Base = declarative_base()

# Define the table structure for Clients
class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True, nullable=False)
    contact = Column(String)
    email = Column(String, unique=True, index=True)
    telephone = Column(String)
    adresse = Column(String)
    statut = Column(String, default="Actif")
    secteur = Column(String)
    chiffreAffaires = Column(Float, default=0.0)
    nbProjets = Column(Integer, default=0)
    dernierContact = Column(Date)
    commercial = Column(String)

# Define the table structure for Vehicles
class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    type = Column(String)
    marque = Column(String)
    modele = Column(String)
    immatriculation = Column(String, nullable=True)
    numeroSerie = Column(String, nullable=True)
    annee = Column(Integer)
    heuresUtilisation = Column(Integer)
    statut = Column(String)
    localisation = Column(String)
    dernierEntretien = Column(Date)
    prochainEntretien = Column(Date)
    coutHoraire = Column(Float)
    conducteur = Column(String)
    observations = Column(Text)

# Define the table structure for Quotes (Devis)
class Devis(Base):
    __tablename__ = "devis"
    id = Column(String, primary_key=True, index=True)
    client = Column(String)
    contact = Column(String)
    projet = Column(String)
    montant = Column(Float)
    tva = Column(Float)
    montantTTC = Column(Float)
    statut = Column(String)
    dateCreation = Column(Date)
    dateValidite = Column(Date)
    dureeEstimee = Column(String)
    commercial = Column(String)
    equipements = Column(ARRAY(String))
    marge = Column(Float)
    probabilite = Column(Integer)

# Define the table structure for Alerts
class Alerte(Base):
    __tablename__ = "alertes"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    titre = Column(String)
    description = Column(Text)
    equipement = Column(String)
    priorite = Column(String)
    echeance = Column(Date)
    estimationCout = Column(Float)
    responsable = Column(String)
    statut = Column(String)

# This special block allows the script to be run directly to create the tables.
# It should only be run once to initialize the database schema.
if __name__ == "__main__":
    if not DATABASE_URL:
        raise Exception("Cannot create tables: DATABASE_URL is not set in your .env file.")
    
    # Create a standard synchronous engine for the one-time table creation
    engine = create_engine(DATABASE_URL)
    
    print("Connecting to the database to create tables...")
    try:
        # Create all tables defined in this file
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully in your database.")
    except Exception as e:
        print(f"An error occurred during table creation: {e}")

