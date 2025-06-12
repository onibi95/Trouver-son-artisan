const db = require("../models");
const { validateToken } = require("../controllers/authentification.js");
const router = require("express").Router();

const Category = db.categories;
const Op = db.Sequelize.Op;

// Récupérer toutes les catégories de la base de données
router.get("/", validateToken, (req, res) => {
    console.log('[CONTROLLER] Category findAll called');
    
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : {};

    console.log('[CONTROLLER] Executing Category findAll with condition:', condition);

    Category.findAll({ 
        where: condition,
        include: [{
            model: db.artisans,
            as: 'artisans'
        }]
    })
        .then(data => {
            console.log('[CONTROLLER] Found', data.length, 'categories');
            res.send(data);
        })
        .catch(err => {
            console.error('[CONTROLLER] Database error:', err.message);
            
            const errorResponse = {
                message: err.message || "Une erreur s'est produite lors de la récupération des catégories."
            };
            
            res.status(500).send(errorResponse);
        });
});


module.exports = router;
