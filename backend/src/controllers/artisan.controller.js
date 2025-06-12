const db = require("../models");
const Artisan = db.artisans;
const Op = db.Sequelize.Op;


// Récupérer tous les artisans de la base de données
exports.findAll = (req, res) => {
    console.log('[CONTROLLER] findAll called with params:', req.query);
    
    const nom = req.query.nom;
    const categorie = req.query.categorie;
    const ville = req.query.ville;

    let condition = {};

    if (nom) {
        condition.nom = { [Op.like]: `%${nom}%` };
    }

    if (categorie) {
        condition.categorie = categorie;
    }

    if (ville) {
        condition.ville = ville;
    }

    console.log('[CONTROLLER] Executing findAll with condition:', condition);

    Artisan.findAll({ where: condition })
        .then(data => {
            console.log('[CONTROLLER] Found', data.length, 'artisans');
            res.send(data);
        })
        .catch(err => {
            console.error('[CONTROLLER] Database error:', err.message);
            
            const errorResponse = {
                message: err.message || "Une erreur s'est produite lors de la récupération des artisans."
            };
            
            res.status(500).send(errorResponse);
        });
};

// Trouver un seul artisan avec un id
exports.findOne = (req, res) => {
    const id = req.params.id;
    console.log('[CONTROLLER] findOne called for id:', id);

    Artisan.findByPk(id)
        .then(data => {
            if (data) {
                console.log('[CONTROLLER] Artisan found');
                res.send(data);
            } else {
                console.log('[CONTROLLER] Artisan not found for id:', id);
                res.status(404).send({
                    message: `Impossible de trouver l'artisan avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            console.error('[CONTROLLER] Error finding artisan:', err.message);
            res.status(500).send({
                message: "Erreur lors de la récupération de l'artisan avec l'id=" + id
            });
        });
};


// Trouver tous les artisans mis en avant (top)
exports.findAllTop = (req, res) => {
    console.log('[CONTROLLER] findAllTop called');
    
    Artisan.findAll({ where: { top: true } })
        .then(data => {
            console.log('[CONTROLLER] Found', data.length, 'top artisans');
            res.send(data);
        })
        .catch(err => {
            console.error('[CONTROLLER] Error finding top artisans:', err.message);
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la récupération des artisans mis en avant."
            });
        });
};

// Trouver tous les artisans par catégorie
exports.findByCategorie = (req, res) => {
    const categorie = req.params.categorie;
    console.log('[CONTROLLER] findByCategorie called for:', categorie);

    Artisan.findAll({ where: { categorie: categorie } })
        .then(data => {
            console.log('[CONTROLLER] Found', data.length, 'artisans in category:', categorie);
            res.send(data);
        })
        .catch(err => {
            console.error('[CONTROLLER] Error finding artisans by category:', err.message);
            res.status(500).send({
                message:
                    err.message || `Une erreur s'est produite lors de la récupération des artisans de la catégorie ${categorie}.`
            });
        });
}; 