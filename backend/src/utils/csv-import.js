const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const db = require('../models');
const Artisan = db.artisans;

// Fonction pour convertir le format des notes (4,5 -> 4.5)
const parseFloat = (value) => {
    if (!value) return null;
    return Number(value.replace(',', '.'));
};

// Fonction pour convertir "TRUE"/"FALSE" en booléen
const parseBoolean = (value) => {
    if (!value) return false;
    return value.toUpperCase() === 'TRUE';
};

// Importer les données CSV
const importCsvData = async () => {
    try {
        const csvFilePath = path.resolve(__dirname, '../../../data/data.csv');

        // Vérifier si le fichier existe
        if (!fs.existsSync(csvFilePath)) {
            console.error(`Le fichier CSV n'existe pas: ${csvFilePath}`);
            return;
        }

        // Lire le fichier CSV
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

        // Parser le CSV
        parse(fileContent, {
            delimiter: ';',
            columns: true,
            trim: false,
            skip_empty_lines: true
        }, async (err, records) => {
            if (err) {
                console.error('Erreur lors du parsing du CSV:', err);
                return;
            }

            console.log(`${records.length} artisans trouvés dans le CSV.`);


            try {
                // Supprimer toutes les données existantes
                await Artisan.destroy({ truncate: true, cascade: true });

                // Transformer et insérer les données de manière dynamique
                const artisans = records.map(record => {
                    const artisan = {};
                    let test = false;
                    Object.keys(record).forEach(key => {
                        const value = record[key];

                        // Mapping dynamique des clés vers les noms de propriétés de la base
                        switch (key) {
                            case 'Nom':
                              test = true;
                                artisan.nom = value;
                                break;
                            case 'Spécialité':
                                artisan.specialite = value;
                                break;
                            case 'Note':
                                artisan.note = parseFloat(value);
                                break;
                            case 'Ville':
                                artisan.ville = value;
                                break;
                            case 'A propos':
                                artisan.aPropos = value;
                                break;
                            case 'Email':
                                artisan.email = value;
                                break;
                            case 'Site Web':
                                artisan.siteWeb = value;
                                break;
                            case 'Catégorie':
                                artisan.categorie = value;
                                break;
                            case 'Top':
                                artisan.top = parseBoolean(value);
                                break;
                            default:
                              break;
                        }
                    });


                    
                    return artisan;
                });




                await Artisan.bulkCreate(artisans);
                console.log('Importation CSV terminée avec succès.');
            } catch (error) {
                console.error('Erreur lors de l\'importation en base de données:', error);
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'importation du CSV:', error);
    }
};

module.exports = importCsvData; 