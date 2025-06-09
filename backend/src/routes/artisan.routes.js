module.exports = app => {
    const artisans = require("../controllers/artisan.controller.js");
    const router = require("express").Router();

    // Créer un nouvel artisan
    router.post("/", artisans.create);

    // Récupérer tous les artisans
    router.get("/", artisans.findAll);

    // Récupérer tous les artisans mis en avant (top)
    router.get("/top", artisans.findAllTop);

    // Récupérer tous les artisans d'une catégorie
    router.get("/categorie/:categorie", artisans.findByCategorie);

    // Récupérer un seul artisan avec id
    router.get("/:id", artisans.findOne);

    // Mettre à jour un artisan avec id
    router.put("/:id", artisans.update);

    // Supprimer un artisan avec id
    router.delete("/:id", artisans.delete);

    app.use('/api/artisans', router);
}; 