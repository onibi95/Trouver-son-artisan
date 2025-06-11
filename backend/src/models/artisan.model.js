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
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        top: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return Artisan;
}; 