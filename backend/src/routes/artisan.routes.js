module.exports = app => {
    const artisans = require("../controllers/artisan.controller.js");
    const { validateToken } = require("../controllers/authentification.js");
    const router = require("express").Router();

    
    // Récupérer tous les artisans (protected with rate limiting)
    router.get("/", validateToken, (req, res) => {
        console.log("findAll");
        artisans.findAll(req, res);
    });

    // Récupérer tous les artisans mis en avant (top) (protected with rate limiting)
    router.get("/top", validateToken, artisans.findAllTop);

    // Récupérer tous les artisans d'une catégorie (protected with rate limiting)
    router.get("/categorie/:categorie", validateToken, artisans.findByCategorie);

    // Récupérer un seul artisan avec id (protected with rate limiting)
    router.get("/:id", validateToken, artisans.findOne);


    app.use('/api/artisans', router);
}; 