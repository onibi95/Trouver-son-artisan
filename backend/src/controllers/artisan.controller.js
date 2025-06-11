const db = require("../models");
const Artisan = db.artisans;
const Op = db.Sequelize.Op;


// Récupérer tous les artisans de la base de données
exports.findAll = (req, res) => {
    console.log('=== findAll function called ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request query params:', req.query);
    
    const nom = req.query.nom;
    const categorie = req.query.categorie;
    const ville = req.query.ville;

    console.log('Extracted parameters:');
    console.log('- nom:', nom);
    console.log('- categorie:', categorie);
    console.log('- ville:', ville);

    let condition = {};
    console.log('Initial condition object:', condition);

    if (nom) {
        condition.nom = { [Op.like]: `%${nom}%` };
        console.log('Added nom condition:', condition.nom);
    }

    if (categorie) {
        condition.categorie = categorie;
        console.log('Added categorie condition:', condition.categorie);
    }

    if (ville) {
        condition.ville = ville;
        console.log('Added ville condition:', condition.ville);
    }

    console.log('Final condition object:', JSON.stringify(condition, null, 2));
    console.log('About to execute Artisan.findAll with condition...');

    Artisan.findAll({ where: condition })
        .then(data => {
            console.log('Database query successful!');
            console.log('Number of artisans found:', data.length);
            console.log('First few results:', data.slice(0, 3));
            console.log('Sending response to client...');
            res.send(data);
            console.log('Response sent successfully');
        })
        .catch(err => {
            console.error('=== DATABASE ERROR ===');
            console.error('Error message:', err.message);
            console.error('Full error object:', err);
            console.error('Stack trace:', err.stack);
            
            const errorResponse = {
                message: err.message || "Une erreur s'est produite lors de la récupération des artisans."
            };
            
            console.log('Sending error response:', errorResponse);
            res.status(500).send(errorResponse);
            console.log('Error response sent');
        });
    
    console.log('=== findAll function execution completed ===');
};

// Trouver un seul artisan avec un id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Artisan.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Impossible de trouver l'artisan avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la récupération de l'artisan avec l'id=" + id
            });
        });
};


// Trouver tous les artisans mis en avant (top)
exports.findAllTop = (req, res) => {
    Artisan.findAll({ where: { top: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la récupération des artisans mis en avant."
            });
        });
};

// Trouver tous les artisans par catégorie
exports.findByCategorie = (req, res) => {
    const categorie = req.params.categorie;

    Artisan.findAll({ where: { categorie: categorie } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Une erreur s'est produite lors de la récupération des artisans de la catégorie ${categorie}.`
            });
        });
}; 