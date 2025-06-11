const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = require("./src/models");
const importCsvData = require('./src/utils/csv-import');

// En développement, on peut synchroniser la base de données à chaque démarrage
// En production, il est préférable d'utiliser des migrations
db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Base de données synchronisée.");
        // Importer les données CSV après la synchronisation
        importCsvData();
    })
    .catch((err) => {
        console.log("Erreur lors de la synchronisation de la base de données: " + err.message);
    });

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Artisans API' });
});

// Import routes
require('./src/routes/artisan.routes')(app);
require('./src/routes/auth.routes')(app);

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 