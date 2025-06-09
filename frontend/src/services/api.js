// Services API pour interagir avec le backend
import { artisansData } from './mockData';

// Fonction simulant la récupération des artisans depuis l'API
export const getArtisans = async () => {
    // Dans une application réelle, cela serait:
    // const response = await fetch('/api/artisans');
    // return await response.json();

    // Simuler un délai d'API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(artisansData);
        }, 300);
    });
};

// Récupérer les artisans par catégorie
export const getArtisansByCategory = async (categoryName) => {
    // Dans une application réelle:
    // const response = await fetch(`/api/artisans/categorie/${categoryName}`);
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = artisansData.filter(
                artisan => artisan.categorie.toLowerCase() === categoryName.toLowerCase()
            );
            resolve(filtered);
        }, 300);
    });
};

// Récupérer les artisans mis en avant (top:true)
export const getTopArtisans = async () => {
    // Dans une application réelle:
    // const response = await fetch('/api/artisans/top');
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = artisansData.filter(artisan => artisan.top === true);
            resolve(filtered);
        }, 300);
    });
};

// Rechercher des artisans par nom
export const searchArtisansByName = async (searchTerm) => {
    // Dans une application réelle:
    // const response = await fetch(`/api/artisans/search?name=${searchTerm}`);
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = artisansData.filter(
                artisan => artisan.nom.toLowerCase().includes(searchTerm.toLowerCase())
            );
            resolve(filtered);
        }, 300);
    });
};

// Récupérer les catégories d'artisans
export const getCategories = async () => {
    // Dans une application réelle:
    // const response = await fetch('/api/categories');
    // return await response.json();

    return new Promise((resolve) => {
        setTimeout(() => {
            // Extraire les catégories uniques des données d'artisans
            const categoryNames = [...new Set(artisansData.map(artisan => artisan.categorie))];
            const categories = categoryNames.map((name, index) => ({
                id: index + 1,
                name
            }));
            resolve(categories);
        }, 300);
    });
}; 