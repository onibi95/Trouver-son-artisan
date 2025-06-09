import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getArtisans, getArtisansByCategory, getCategories } from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import SEO from '../components/SEO';

const ArtisansPage = () => {
    const { nom } = useParams(); // Récupérer le paramètre d'URL si présent
    const location = useLocation();

    const [artisans, setArtisans] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedVille, setSelectedVille] = useState('');
    const [pageTitle, setPageTitle] = useState('Tous nos artisans');
    const [seoDescription, setSeoDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let artisansData;

                // Si nous sommes sur une page de catégorie
                if (nom) {
                    artisansData = await getArtisansByCategory(nom);
                    setSelectedCategory(artisansData[0]?.categorie || '');

                    // Première lettre en majuscule et le reste en minuscule
                    const formattedCategoryName = nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
                    const title = `Artisans en ${formattedCategoryName}`;
                    setPageTitle(title);
                    setSeoDescription(`Découvrez les meilleurs artisans spécialisés en ${formattedCategoryName} près de chez vous. Consultez leurs profils, spécialités et coordonnées.`);
                } else {
                    artisansData = await getArtisans();
                    setPageTitle('Tous nos artisans');
                    setSeoDescription('Explorez notre répertoire complet d\'artisans qualifiés dans différents domaines. Filtrez par spécialité, localisation ou note pour trouver le professionnel idéal pour votre projet.');
                }

                const categoriesData = await getCategories();

                setArtisans(artisansData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setError('Une erreur est survenue lors du chargement des artisans.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nom, location.pathname]); // Recharger quand le paramètre d'URL change

    // Obtenir la liste unique des villes
    const villes = [...new Set(artisans.map(artisan => artisan.ville))].sort();

    // Filtrer les artisans
    const filteredArtisans = artisans.filter(artisan => {
        const matchesSearch = searchTerm === '' ||
            artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artisan.specialite.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === '' ||
            artisan.categorie === selectedCategory;

        const matchesVille = selectedVille === '' ||
            artisan.ville === selectedVille;

        return matchesSearch && matchesCategory && matchesVille;
    });

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory(nom ? artisans[0]?.categorie || '' : '');
        setSelectedVille('');
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <SEO title={pageTitle} description={seoDescription} />
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des artisans...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <SEO title="Erreur" description="Une erreur est survenue lors du chargement des artisans." />
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <SEO title={pageTitle} description={seoDescription} />
            <h1 className="display-5 fw-bold mb-4 text-center">{pageTitle}</h1>

            {/* Filtres */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Filtrer les résultats</h5>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="searchTerm"
                                            placeholder="Rechercher"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <label htmlFor="searchTerm">Rechercher par nom ou spécialité</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="categoryFilter"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            disabled={!!nom} // Désactiver si on est sur une page de catégorie
                                        >
                                            <option value="">Toutes les catégories</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="categoryFilter">Catégorie</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="villeFilter"
                                            value={selectedVille}
                                            onChange={(e) => setSelectedVille(e.target.value)}
                                        >
                                            <option value="">Toutes les villes</option>
                                            {villes.map(ville => (
                                                <option key={ville} value={ville}>
                                                    {ville}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="villeFilter">Ville</label>
                                    </div>
                                </div>

                                <div className="col-md-2 d-flex align-items-center">
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={resetFilters}
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3">
                                <small className="text-muted">
                                    {filteredArtisans.length} artisan(s) trouvé(s)
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grille d'artisans */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {filteredArtisans.length > 0 ? (
                    filteredArtisans.map(artisan => (
                        <div key={artisan.id} className="col">
                            <ArtisanCard artisan={artisan} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">Aucun artisan ne correspond à vos critères de recherche.</p>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={resetFilters}
                        >
                            Afficher tous les artisans
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtisansPage; 