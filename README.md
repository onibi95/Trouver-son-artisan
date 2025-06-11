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
- React.js 19.1.0
- React Router 7.6.2
- Bootstrap 5.3.6
- SASS 1.89.1
- Vite.js 6.3.5
- ESLint pour la qualité du code

### Backend
- Node.js avec Nodemon pour le développement
- Express.js 5.1.0
- MySQL avec Sequelize ORM 6.37.7
- Authentification JWT avec bcryptjs
- API RESTful avec support CORS
- CSV-Parse pour l'importation de données

## 💻 Installation

### Prérequis
- Node.js (v18+)
- npm
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
│   │   └── styles/         # Fichiers SCSS avec variables
│   │
│   ├── package.json        # Dépendances frontend
│   ├── vite.config.js      # Configuration Vite avec alias et SCSS
│   └── eslint.config.js    # Configuration ESLint
│
├── backend/                # Serveur API Express
│   ├── src/
│   │   ├── controllers/    # Contrôleurs
│   │   ├── models/         # Modèles Sequelize
│   │   ├── routes/         # Routes API
│   │   ├── config/         # Configuration de l'application
│   │   ├── docs/           # Documentation API
│   │   └── utils/          # Utilitaires
│   │
│   ├── server.js           # Point d'entrée du serveur
│   └── package.json        # Dépendances backend
│
├── data/                   # Données CSV pour l'importation
│   └── data.csv            # Fichier de données des artisans
│
└── .gitignore             # Fichiers ignorés par Git
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