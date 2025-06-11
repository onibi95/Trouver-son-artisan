import { useEffect } from 'react';

/**
 * Composant SEO pour gérer les métadonnées de référencement
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre de la page
 * @param {string} props.description - La description pour les moteurs de recherche
 * @param {string} props.favicon - Chemin vers la favicon à utiliser (optionnel)
 */
const SEO = ({ title, description, favicon }) => {
    useEffect(() => {
        // Mettre à jour le titre de la page
        const previousTitle = document.title;
        document.title = title ? `${title} - Artisans` : 'Artisans - Trouvez les meilleurs artisans près de chez vous';

        // Mettre à jour ou créer la balise meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }

        metaDescription.content = description || 'Plateforme de mise en relation avec des artisans qualifiés et passionnés dans votre région.';

        // Mettre à jour la favicon si spécifiée
        if (favicon) {
            let linkFavicon = document.querySelector('link[rel="icon"]');
            if (!linkFavicon) {
                linkFavicon = document.createElement('link');
                linkFavicon.rel = 'icon';
                document.head.appendChild(linkFavicon);
            }
            linkFavicon.href = favicon;
        }

        // Nettoyer au démontage du composant
        return () => {
            document.title = previousTitle;
        };
    }, [title, description, favicon]);

    // Ce composant ne rend rien visuellement
    return null;
};

export default SEO; 