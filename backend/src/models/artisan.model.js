module.exports = (sequelize, DataTypes) => {
    const Artisan = sequelize.define("artisan", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        specialite: {
            type: DataTypes.STRING
        },
        note: {
            type: DataTypes.FLOAT
        },
        ville: {
            type: DataTypes.STRING
        },
        aPropos: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.STRING
        },
        siteWeb: {
            type: DataTypes.STRING
        },
        categorie: {
            type: DataTypes.STRING
        },
        top: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Artisan;
}; 