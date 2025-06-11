const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Création de l'instance Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

// Création de l'objet db
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import des modèles
db.artisans = require("./artisan.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);

// Définition des associations
db.categories.hasMany(db.artisans, {
    foreignKey: 'categoryId',
    as: 'artisans'
});

db.artisans.belongsTo(db.categories, {
    foreignKey: 'categoryId',
    as: 'category'
});

module.exports = db; 