module.exports = app => {
    const artisans = require("../controllers/artisan.controller.js");
    const { validateToken } = require("../controllers/authentification.js");
    const router = require("express").Router();

    
    // Récupérer tous les artisans (protected with rate limiting)
    router.get("/", validateToken, (req, res) => {
        console.log("[ROUTES] GET /api/artisans - findAll");
        artisans.findAll(req, res);
    });

    // Récupérer tous les artisans mis en avant (top) (protected with rate limiting)
    router.get("/top", validateToken, (req, res) => {
        console.log("[ROUTES] GET /api/artisans/top - findAllTop");
        artisans.findAllTop(req, res);
    });

    // Récupérer tous les artisans d'une catégorie (protected with rate limiting)
    router.get("/categorie/:categorie", validateToken, (req, res) => {
        console.log("[ROUTES] GET /api/artisans/categorie/" + req.params.categorie + " - findByCategorie");
        artisans.findByCategorie(req, res);
    });

    // Récupérer un seul artisan avec id (protected with rate limiting)
    router.get("/:id", validateToken, (req, res) => {
        console.log("[ROUTES] GET /api/artisans/" + req.params.id + " - findOne");
        artisans.findOne(req, res);
    });


    app.use('/api/artisans', router);
}; 