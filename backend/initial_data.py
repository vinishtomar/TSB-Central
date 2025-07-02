# backend/initial_data.py

# This file holds the initial data used to seed the database.
mock_data = {
    "clients": [
        {
            "id": 1, "nom": "SARL Dupont Construction", "contact": "Jean Dupont",
            "email": "j.dupont@dupont-construction.fr", "telephone": "01.45.67.89.12",
            "adresse": "15 Rue de la République, 31000 Toulouse", "statut": "Actif",
            "secteur": "BTP", "chiffreAffaires": 450000, "nbProjets": 12,
            "dernierContact": "2025-06-28", "commercial": "Marie Martin"
        },
        {
            "id": 2, "nom": "Martin Travaux Publics SA", "contact": "Pierre Martin",
            "email": "contact@martin-tp.com", "telephone": "05.61.23.45.67",
            "adresse": "Zone Industrielle, 31200 Toulouse", "statut": "Actif",
            "secteur": "Travaux Publics", "chiffreAffaires": 780000, "nbProjets": 8,
            "dernierContact": "2025-06-25", "commercial": "Sophie Durand"
        },
        {
            "id": 3, "nom": "Leblanc Démolition EURL", "contact": "Michel Leblanc",
            "email": "m.leblanc@demolition-leblanc.fr", "telephone": "05.34.56.78.90",
            "adresse": "Avenue des Pyrénées, 31400 Toulouse", "statut": "Prospect",
            "secteur": "Démolition", "chiffreAffaires": 0, "nbProjets": 0,
            "dernierContact": "2025-06-20", "commercial": "Laurent Petit"
        }
    ],
    "vehicles": [
        {
            "id": 1, "nom": "Excavatrice Caterpillar 320DL", "type": "Engin de chantier",
            "marque": "Caterpillar", "modele": "320DL", "immatriculation": "AB-123-CD",
            "annee": 2019, "heuresUtilisation": 2450, "statut": "Opérationnel",
            "localisation": "Chantier Dupont - Toulouse", "dernierEntretien": "2025-05-15",
            "prochainEntretien": "2025-08-15", "coutHoraire": 85, "conducteur": "François Moreau",
            "observations": "RAS - Fonctionnement optimal"
        },
        {
            "id": 2, "nom": "Camion-grue Liebherr LTM 1030", "type": "Grue mobile",
            "marque": "Liebherr", "modele": "LTM 1030", "immatriculation": "EF-456-GH",
            "annee": 2020, "heuresUtilisation": 1890, "statut": "En panne",
            "localisation": "Atelier - Garage Central", "dernierEntretien": "2025-04-20",
            "prochainEntretien": "2025-07-10", "coutHoraire": 120, "conducteur": "Non assigné",
            "observations": "Problème hydraulique - Réparation en cours"
        },
    ],
    "devis": [
        {
            "id": "DEV-2025-001", "client": "SARL Dupont Construction", "contact": "Jean Dupont",
            "projet": "Terrassement et fondations - Résidence Les Chênes", "montant": 185000,
            "tva": 37000, "montantTTC": 222000, "statut": "En attente validation",
            "dateCreation": "2025-06-15", "dateValidite": "2025-07-15",
            "dureeEstimee": "3 semaines", "commercial": "Marie Martin",
            "equipements": ["Excavatrice 320DL", "Camion benne", "Compacteur"],
            "marge": 28.5, "probabilite": 75
        },
    ],
    "alertes": [
        {
            "id": 1, "type": "Maintenance préventive", "titre": "Révision 500h - Excavatrice CAT 320DL",
            "description": "Maintenance préventive programmée tous les 500h d'utilisation",
            "equipement": "Excavatrice Caterpillar 320DL", "priorite": "Moyenne",
            "echeance": "2025-07-15", "estimationCout": 2500,
            "responsable": "Service maintenance", "statut": "Programmée"
        },
    ]
}

