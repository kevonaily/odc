# Application de Gestion des Utilisateurs

Une application complète de gestion des utilisateurs avec un backend Express et un frontend React.

## Fonctionnalités

- **Backend (Express + PostgreSQL)**
  - API RESTful complète pour les utilisateurs (CRUD)
  - Validation des données avec express-validator
  - Pagination et recherche
  - Gestion des erreurs robuste
  - Connexion à PostgreSQL

- **Frontend (React + Vite)**
  - Interface utilisateur moderne avec Bootstrap 5
  - Formulaires avec validation côté client
  - Tableau des utilisateurs avec tri, pagination et recherche
  - Notifications toast pour les actions réussies/échouées
  - Confirmation de suppression
  - Gestion des états de chargement

## Structure du Projet

```
/
├── backend/                # Serveur Express
│   ├── index.js            # Point d'entrée du serveur
│   ├── package.json        # Dépendances du backend
│   └── .env                # Variables d'environnement
│
└── frontend/               # Application React
    ├── src/
    │   ├── components/     # Composants React
    │   ├── services/       # Services API
    │   ├── hooks/          # Hooks personnalisés
    │   ├── App.jsx         # Composant principal
    │   └── main.jsx        # Point d'entrée
    ├── package.json        # Dépendances du frontend
    └── .env                # Variables d'environnement
```

## Prérequis

- Node.js (v14+)
- PostgreSQL
- npm ou yarn

## Installation

### Base de données

1. Créez une base de données PostgreSQL
2. Exécutez le script SQL suivant pour créer la table des utilisateurs:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend

1. Naviguez vers le dossier backend:
   ```
   cd backend
   ```

2. Installez les dépendances:
   ```
   npm install
   ```

3. Configurez les variables d'environnement dans le fichier `.env`:
   ```
   PORT=5000
   PG_HOST=localhost
   PG_USER=votre_utilisateur
   PG_PASSWORD=votre_mot_de_passe
   PG_DATABASE=votre_base_de_donnees
   ```

4. Démarrez le serveur:
   ```
   npm start
   ```

### Frontend

1. Naviguez vers le dossier frontend:
   ```
   cd frontend
   ```

2. Installez les dépendances:
   ```
   npm install
   ```

3. Configurez les variables d'environnement dans le fichier `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Démarrez l'application:
   ```
   npm run dev
   ```

5. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:5173)

## Utilisation

- **Ajouter un utilisateur**: Remplissez le formulaire et cliquez sur "Enregistrer"
- **Modifier un utilisateur**: Cliquez sur le bouton "Modifier" à côté de l'utilisateur, mettez à jour les informations et cliquez sur "Mettre à jour"
- **Supprimer un utilisateur**: Cliquez sur le bouton "Supprimer" et confirmez la suppression
- **Rechercher des utilisateurs**: Utilisez la barre de recherche en haut du tableau
- **Trier les utilisateurs**: Cliquez sur les en-têtes de colonne pour trier
- **Paginer les résultats**: Utilisez les boutons de pagination en bas du tableau

## Licence

MIT
