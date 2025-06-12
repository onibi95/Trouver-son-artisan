const importCsvData = require('../utils/csv-import');
const db = require('../models');


db.sequelize.sync({ force: true })
    .then(() => {
        console.log("[SERVER] Base de données synchronisée.");
        // Importer les données CSV après la synchronisation
        importCsvData();
    })
    .catch((err) => {
        console.log("[SERVER] Erreur lors de la synchronisation de la base de données: " + err.message);
    });

