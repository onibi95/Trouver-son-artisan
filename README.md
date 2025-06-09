# Plateforme Artisans - Trouvez votre artisan !

Une plateforme web moderne pour mettre en relation les particuliers avec des artisans qualifiés en région Auvergne-Rhône-Alpes.

![Capture d'écran de la page d'accueil](frontend/public/images/Logo.png)

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [Comment contribuer](#-comment-contribuer)
- [Licence](#-licence)

## 🌟 Présentation

Cette application web met en relation les particuliers avec des artisans qualifiés de la région Auvergne-Rhône-Alpes. Les utilisateurs peuvent rechercher des artisans par catégorie, consulter leurs profils détaillés et les contacter facilement pour leurs projets.

## ✨ Fonctionnalités

- **Page d'accueil** : Présentation de la plateforme avec mise en avant d'artisans sélectionnés
- **Recherche d'artisans** : Par nom, catégorie ou localisation
- **Fiches détaillées** : Profils complets des artisans avec leurs informations, photos, et avis clients
- **Navigation intuitive** : Interface utilisateur moderne et responsive
- **Catégories d'artisanat** : Organisation des artisans par domaines d'expertise

## 🛠 Technologies utilisées

### Frontend
- React.js 19.1
- React Router 7.6
- Bootstrap 5.3
- SASS
- Vite.js

### Backend
- Node.js
- Express.js 5.1
- MySQL (avec Sequelize ORM)
- API RESTful

## 💻 Installation

### Prérequis
- Node.js (v18+)
- npm ou yarn
- MySQL (pour la base de données)

### Étapes d'installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-repo/artisans.git
   cd artisans
   ```

2. **Installation et lancement du backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Le serveur backend sera accessible sur http://localhost:3000

3. **Installation et lancement du frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   L'application frontend sera accessible sur http://localhost:5173

## 📁 Structure du projet

```
artisans/
├── frontend/               # Application React
│   ├── public/             # Fichiers statiques
│   ├── src/
│   │   ├── components/     # Composants React réutilisables
│   │   ├── pages/          # Pages principales
│   │   ├── services/       # Services API et utilitaires
│   │   ├── styles/         # Fichiers SCSS
│   │   └── assets/         # Images et ressources
│   │
│   ├── package.json        # Dépendances frontend
│   └── vite.config.js      # Configuration Vite
│
├── backend/                # Serveur API Express
│   ├── src/
│   │   ├── controllers/    # Contrôleurs
│   │   ├── models/         # Modèles de données
│   │   └── routes/         # Routes API
│   │
│   ├── server.js           # Point d'entrée du serveur
│   └── package.json        # Dépendances backend
│
└── data/                   # Données et scripts d'importation
```

## 🤝 Comment contribuer

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

Développé avec ❤️ par l'équipe Artisans 