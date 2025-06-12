const router = require("express").Router();
const { validateToken } = require("../controllers/authentification.js");
const db = require("../models");

const Artisan = db.artisans;
const Op = db.Sequelize.Op;

router.get("/", validateToken, (req, res) => {
  console.log("[CONTROLLER] GET /api/artisans - findAll");

  console.log('[CONTROLLER] findAll called with params:', req.query);

  const nom = req.query.nom;
  const categorie = req.query.categorie;
  const ville = req.query.ville;

  let condition = {};

  if (nom) {
    condition.nom = { [Op.like]: `%${nom}%` };
  }

  if (categorie) {
    condition.categories = { name: categorie };
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
});


router.get("/top", validateToken, (req, res) => {
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
});

router.get("/:id", validateToken, (req, res) => {
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
});



module.exports = router;
