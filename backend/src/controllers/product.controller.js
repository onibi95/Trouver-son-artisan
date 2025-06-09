const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Créer et sauvegarder un nouveau produit
exports.create = (req, res) => {
    // Valider la requête
    if (!req.body.name || !req.body.price) {
        res.status(400).send({
            message: "Le nom et le prix sont obligatoires!"
        });
        return;
    }

    // Créer un produit
    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        available: req.body.available ? req.body.available : true,
        categoryId: req.body.categoryId
    };

    // Sauvegarder le produit dans la base de données
    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la création du produit."
            });
        });
};

// Récupérer tous les produits de la base de données
exports.findAll = (req, res) => {
    const name = req.query.name;
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la récupération des produits."
            });
        });
};

// Trouver un seul produit avec un id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Impossible de trouver le produit avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la récupération du produit avec l'id=" + id
            });
        });
};

// Mettre à jour un produit par son id
exports.update = (req, res) => {
    const id = req.params.id;

    Product.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Le produit a été mis à jour avec succès."
                });
            } else {
                res.send({
                    message: `Impossible de mettre à jour le produit avec l'id=${id}. Le produit n'a pas été trouvé ou req.body est vide!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la mise à jour du produit avec l'id=" + id
            });
        });
};

// Supprimer un produit avec l'id spécifié
exports.delete = (req, res) => {
    const id = req.params.id;

    Product.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Le produit a été supprimé avec succès!"
                });
            } else {
                res.send({
                    message: `Impossible de supprimer le produit avec l'id=${id}. Le produit n'a peut-être pas été trouvé!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer le produit avec l'id=" + id
            });
        });
};

// Supprimer tous les produits de la base de données
exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} produits ont été supprimés avec succès!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la suppression de tous les produits."
            });
        });
};

// Trouver tous les produits disponibles
exports.findAllAvailable = (req, res) => {
    Product.findAll({ where: { available: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la récupération des produits disponibles."
            });
        });
}; 