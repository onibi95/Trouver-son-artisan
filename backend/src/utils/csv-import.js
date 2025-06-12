const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const db = require('../models');
const Artisan = db.artisans;
const Category = db.categories;
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
        console.log('[CSV-IMPORT] Starting CSV data import...');
        const csvFilePath = path.resolve(__dirname, '../../../data/data.csv');

        // Vérifier si le fichier existe
        if (!fs.existsSync(csvFilePath)) {
            console.error(`[CSV-IMPORT] CSV file not found: ${csvFilePath}`);
            return;
        }

        console.log('[CSV-IMPORT] Reading CSV file:', csvFilePath);
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
                console.error('[CSV-IMPORT] CSV parsing error:', err.message);
                return;
            }

            console.log(`[CSV-IMPORT] Found ${records.length} artisans in CSV`);

            try {
                console.log('[CSV-IMPORT] Clearing existing data...');
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

                // Extract unique category names
                const uniqueCategoryNames = new Set();
                records.forEach(record => {
                    Object.keys(record).forEach(key => {
                        const value = record[key];
                        if (key === 'Catégorie' && value && value.trim() !== '') {
                            uniqueCategoryNames.add(value.trim());
                        }
                    });
                });

                // Create category objects from unique names
                const categories = Array.from(uniqueCategoryNames).map(name => ({
                    name: name
                }));
                console.log('[CSV-IMPORT] Categories:', categories);

                console.log('[CSV-IMPORT] Inserting artisans into database...');
                await Artisan.bulkCreate(artisans);
                console.log('[CSV-IMPORT] Inserting categories into database...');
                await Category.bulkCreate(categories);
                console.log('[CSV-IMPORT] CSV imported successfully');
            } catch (error) {
                console.error('[CSV-IMPORT] Database import error:', error.message);
            }
        });
    } catch (error) {
        console.error('[CSV-IMPORT] General import error:', error.message);
    }
};


module.exports = importCsvData; 