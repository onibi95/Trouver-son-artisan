import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories, searchArtisansByName } from '../services/api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Récupérer les catégories depuis la "base de données"
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        try {
            // Dans une application réelle, on redirigerait vers une page de résultats
            const results = await searchArtisansByName(searchTerm);
            console.log("Résultats de recherche:", results);

            // Pour l'instant, affichons simplement une alerte avec le nombre de résultats
            alert(`${results.length} artisan(s) trouvé(s) pour "${searchTerm}"`);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            alert("Une erreur est survenue lors de la recherche");
        } finally {
            setIsLoading(false);
            setIsOpen(false); // Ferme le menu après recherche sur mobile
        }
    };

    // Fermer le menu au clic sur un lien
    const handleNavLinkClick = () => {
        if (window.innerWidth < 992) { // Bootstrap lg breakpoint
            setIsOpen(false);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary-transparent shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand me-3" to="/">
                    <div className="d-flex align-items-center">
                        <div>
                            <img
                                src="/images/Logo.png"
                                alt="Artisans Logo"
                                height="150"
                                className="d-inline-block align-top"
                            />
                        </div>
                    </div>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen ? "true" : "false"}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarContent">
                    <form className="d-flex me-auto mb-2 mb-lg-0" onSubmit={handleSearch}>
                        <div className="input-group" style={{ minWidth: '280px' }}>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Rechercher un artisan"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                className="btn btn-outline-primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <i className="bi bi-search"></i>
                                )}
                            </button>
                        </div>
                    </form>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                                onClick={handleNavLinkClick}
                            >
                                Accueil
                            </Link>
                        </li>

                        {/* Menu des catégories alimenté depuis la base de données */}
                        {categories.map(category => (
                            <li className="nav-item" key={category.id}>
                                <Link
                                    className={`nav-link ${location.pathname === `/categorie/${category.name.toLowerCase()}` ? 'active' : ''}`}
                                    to={`/categorie/${category.name.toLowerCase()}`}
                                    onClick={handleNavLinkClick}
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/artisans' ? 'active' : ''}`}
                                to="/artisans"
                                onClick={handleNavLinkClick}
                            >
                                Tous les artisans
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 