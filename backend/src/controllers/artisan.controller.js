const db = require("../models");
const Artisan = db.artisans;
const Op = db.Sequelize.Op;

// Créer et sauvegarder un nouvel artisan
exports.create = (req, res) => {
    // Valider la requête
    if (!req.body.nom) {
        res.status(400).send({
            message: "Le nom est obligatoire!"
        });
        return;
    }

    // Créer un artisan
    const artisan = {
        nom: req.body.nom,
        specialite: req.body.specialite,
        note: req.body.note,
        ville: req.body.ville,
        aPropos: req.body.aPropos,
        email: req.body.email,
        siteWeb: req.body.siteWeb,
        categorie: req.body.categorie,
        top: req.body.top ? req.body.top : false
    };

    // Sauvegarder l'artisan dans la base de données
    Artisan.create(artisan)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la création de l'artisan."
            });
        });
};

// Récupérer tous les artisans de la base de données
exports.findAll = (req, res) => {
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

    Artisan.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la récupération des artisans."
            });
        });
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

// Mettre à jour un artisan par son id
exports.update = (req, res) => {
    const id = req.params.id;

    Artisan.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "L'artisan a été mis à jour avec succès."
                });
            } else {
                res.send({
                    message: `Impossible de mettre à jour l'artisan avec l'id=${id}. L'artisan n'a pas été trouvé ou req.body est vide!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la mise à jour de l'artisan avec l'id=" + id
            });
        });
};

// Supprimer un artisan avec l'id spécifié
exports.delete = (req, res) => {
    const id = req.params.id;

    Artisan.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "L'artisan a été supprimé avec succès!"
                });
            } else {
                res.send({
                    message: `Impossible de supprimer l'artisan avec l'id=${id}. L'artisan n'a peut-être pas été trouvé!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'artisan avec l'id=" + id
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