const dotenv = require('dotenv');

dotenv.config();


// Configuration de la base de données pour Sequelize
module.exports = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DB: process.env.DB_NAME || "artisans_db",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}; 