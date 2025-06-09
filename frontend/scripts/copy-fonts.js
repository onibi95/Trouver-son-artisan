import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenez le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin des dossiers source et destination
const sourcePath = path.resolve(__dirname, '../../Graphik/Graphik Family');
const destPath = path.resolve(__dirname, '../public/fonts');

// Tableau des polices à copier
const fontsToCopy = [
    'Graphik-Regular-Trial.otf',
    'Graphik-Medium-Trial.otf',
    'Graphik-Bold-Trial.otf',
    'Graphik-RegularItalic-Trial.otf'
];

// Créer le dossier de destination s'il n'existe pas
if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
    console.log(`Dossier créé: ${destPath}`);
}

// Copier chaque police
fontsToCopy.forEach(font => {
    const sourceFile = path.join(sourcePath, font);
    const destFile = path.join(destPath, font);

    try {
        if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log(`Copié: ${font}`);
        } else {
            console.error(`Erreur: Le fichier source n'existe pas: ${sourceFile}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la copie de ${font}:`, error);
    }
});

console.log('Copie des polices terminée.'); 