// Services API pour interagir avec le backend
import { artisansData } from './mockData';

// Gestion du token de sécurité
let apiToken = null;

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api';

// Récupérer le token de sécurité au chargement de la page
export const initializeApiToken = async () => {
  try {
    console.log('[API] Initializing API token...');
    // Vérifier si un token est déjà stocké localement
    const storedToken = localStorage.getItem('api_token');

    if (storedToken) {
      // Valider le token stocké
      const isValid = await validateToken(storedToken);
      if (isValid) {
        apiToken = storedToken;
        console.log('[API] Token retrieved from local storage');
        return apiToken;
      } else {
        localStorage.removeItem('api_token');
        console.log('[API] Stored token invalid, removed from storage');
      }
    }

    // Générer un nouveau token
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du token');
    }

    const data = await response.json();

    if (data.success && data.token) {
      apiToken = data.token;
      localStorage.setItem('api_token', apiToken);
      console.log('[API] New token generated and stored');
      return apiToken;
    } else {
      throw new Error('Token non reçu du serveur');
    }
  } catch (error) {
    console.error('[API] Error initializing token:', error.message);
    throw error;
  }
};

// Valider un token existant
const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.ok;
  } catch (error) {
    console.error('[API] Error validating token:', error.message);
    return false;
  }
};

// Fonction utilitaire pour faire des requêtes avec authentification
const authenticatedFetch = async (url, options = {}) => {
  // S'assurer que le token est disponible
  if (!apiToken) {
    await initializeApiToken();
  }

  // Configurer les headers avec le token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si le token a expiré, en générer un nouveau
    if (response.status === 401) {
      console.log('[API] Token expired, refreshing...');
      localStorage.removeItem('api_token');
      apiToken = null;
      await initializeApiToken();

      // Retry la requête avec le nouveau token
      return await fetch(url, {
        ...options,
        headers: {
          ...headers,
          'Authorization': `Bearer ${apiToken}`
        }
      });
    }

    return response;
  } catch (error) {
    console.error('[API] Authenticated fetch error:', error.message);
    throw error;
  }
};

// Fonction simulant la récupération des artisans depuis l'API
export const getArtisans = async () => {
  try {
    console.log('[API] Fetching all artisans');
    const response = await authenticatedFetch(`${API_BASE_URL}/artisans`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des artisans');
    }
    const data = await response.json();
    console.log('[API] Successfully fetched', data.length, 'artisans');
    return data;
  } catch (error) {
    console.error('[API] Error fetching artisans:', error.message);
    console.log('[API] Falling back to mock data');
    // Fallback sur les données mock en cas d'erreur
    return artisansData;
  }
};

export const sendEmail = async (formData, artisanId) => {
  try {
    console.log('[API] Sending email');
    console.log(formData);
    const response = await authenticatedFetch(`${API_BASE_URL}/email`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...formData, artisanId})
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
    const data = await response.json();
    console.log('[API] Successfully sent email');
    return data;
  } catch (error) {
    console.error('[API] Error sending email:', error.message);
    throw error;
  }
};

// Récupérer les artisans par catégorie
export const getArtisansByCategory = async (categoryName) => {
  try {
    console.log('[API] Fetching artisans by category:', categoryName);
    const response = await authenticatedFetch(`${API_BASE_URL}/artisans?categorie=${categoryName}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des artisans par catégorie');
    }
    const data = await response.json();
    console.log('[API] Successfully fetched', data.length, 'artisans for category:', categoryName);
    return data;
  } catch (error) {
    console.error('[API] Error fetching artisans by category:', error.message);
    console.log('[API] Falling back to mock data');
    // Fallback sur les données mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = artisansData.filter(
          artisan => artisan.categorie.toLowerCase() === categoryName.toLowerCase()
        );
        resolve(filtered);
      }, 300);
    });
  }
};

// Récupérer les artisans mis en avant (top:true)
export const getTopArtisans = async () => {
  try {
    console.log('[API] Fetching top artisans');
    const response = await authenticatedFetch(`${API_BASE_URL}/artisans/top`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des top artisans');
    }
    const data = await response.json();
    console.log('[API] Successfully fetched', data.length, 'top artisans');
    return data;
  } catch (error) {
    console.error('[API] Error fetching top artisans:', error.message);
    console.log('[API] Falling back to mock data');
    // Fallback sur les données mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = artisansData.filter(artisan => artisan.top === true);
        resolve(filtered);
      }, 300);
    });
  }
};

// Rechercher des artisans par nom
export const searchArtisansByName = async (searchTerm) => {
  try {
    console.log('[API] Searching artisans by name:', searchTerm);
    const response = await authenticatedFetch(`${API_BASE_URL}/artisans/search?name=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche d\'artisans');
    }
    const data = await response.json();
    console.log('[API] Successfully found', data.length, 'artisans for search term:', searchTerm);
    return data;
  } catch (error) {
    console.error('[API] Error searching artisans by name:', error.message);
    console.log('[API] Falling back to mock data');
    // Fallback sur les données mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = artisansData.filter(
          artisan => artisan.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  }
};

// Récupérer les catégories d'artisans
export const getCategories = async () => {
  try {
    console.log('[API] Fetching categories');
    const response = await authenticatedFetch(`${API_BASE_URL}/categories`);
    const res = await response.json();
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    console.log('[API] Successfully fetched', res.length, 'categories');
    return res;
  } catch (error) {
    console.error('[API] Error fetching categories:', error.message);
    console.log('[API] Falling back to mock data');
    // Fallback sur les données mock
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
  }
}; 