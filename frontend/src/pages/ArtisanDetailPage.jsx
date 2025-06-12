import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtisans } from '../services/api';
import SEO from '../components/SEO';
import { sendEmail } from '../services/api';

const ArtisanDetailPage = () => {
    const { id } = useParams();
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        objet: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        const fetchArtisan = async () => {
            try {
                const artisans = await getArtisans();
                const foundArtisan = artisans.find(a => a.id === parseInt(id));

                if (foundArtisan) {
                    setArtisan(foundArtisan);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'artisan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtisan();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dans une application réelle, nous enverrions ces données à un backend
        console.log("Formulaire soumis:", formData);

        // Simulation d'envoi d'email réussi
        setFormSubmitted(true);

        // Réinitialiser le formulaire
        setFormData({
            nom: '',
            email: '',
            objet: '',
            message: ''
        });
    };

    const submitForm = async   () => {
        console.log("Email envoyé");
        console.log(formData);
        console.log(artisan.id);
        const response = await sendEmail(formData, artisan.id);
        console.log(response);

    };

    // Fonction pour générer les étoiles en fonction de la note
    const renderStars = (note) => {
        const stars = [];
        const fullStars = Math.floor(note);
        const hasHalfStar = note % 1 >= 0.5;

        // Étoiles pleines
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
        }

        // Demi-étoile si nécessaire
        if (hasHalfStar) {
            stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
        }

        // Étoiles vides pour compléter jusqu'à 5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
        }

        return <div className="d-flex align-items-center">{stars} <span className="ms-2">({note})</span></div>;
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="container py-5 text-center">
                <h2>Artisan non trouvé</h2>
                <p>L'artisan que vous recherchez n'existe pas.</p>
                <Link to="/artisans" className="btn btn-primary">
                    Voir tous les artisans
                </Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${artisan.nom} - ${artisan.specialite} à ${artisan.ville}`}
                description={`Découvrez ${artisan.nom}, ${artisan.specialite} à ${artisan.ville}. Contactez cet artisan pour vos projets.`}
                favicon="/images/favicon.png"
            />

            <div className="container py-5">
                <div className="row">
                    {/* En-tête avec infos principales */}
                    <div className="col-lg-12 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                    <div>
                                        <h1 className="mb-2">{artisan.nom}</h1>
                                        <div className="mb-2">
                                            {renderStars(artisan.note)}
                                        </div>
                                        <p className="mb-2">
                                            <span className="badge bg-primary me-2">{artisan.specialite}</span>
                                            <span className="badge bg-secondary">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {artisan.ville}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-3 mt-md-0">
                                        <img
                                            src="/images/favicon.png"
                                            alt="Logo Artisans"
                                            height="64"
                                            className="d-block mx-md-0 mx-auto mb-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Colonne gauche - À propos */}
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white py-3">
                                <h2 className="h5 mb-0">
                                    <i className="bi bi-info-circle me-2 text-primary"></i>
                                    À propos
                                </h2>
                            </div>
                            <div className="card-body p-4">
                                <p>{artisan.aPropos}</p>

                                {artisan.siteWeb && (
                                    <div className="mt-4">
                                        <h3 className="h6 mb-3">Site web :</h3>
                                        <a
                                            href={artisan.siteWeb}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="bi bi-globe me-2"></i>
                                            Visiter le site
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Formulaire de contact */}
                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white py-3">
                                <h2 className="h5 mb-0">
                                    <i className="bi bi-envelope me-2 text-primary"></i>
                                    Contacter {artisan.nom}
                                </h2>
                            </div>
                            <div className="card-body p-4">
                                {formSubmitted ? (
                                    <div className="alert alert-success">
                                        <i className="bi bi-check-circle me-2"></i>
                                        Votre message a bien été envoyé ! {artisan.nom} vous répondra dans les meilleurs délais.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="nom" className="form-label">Votre nom</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nom"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Votre email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="objet" className="form-label">Objet</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="objet"
                                                name="objet"
                                                value={formData.objet}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="message" className="form-label">Message</label>
                                            <textarea
                                                className="form-control"
                                                id="message"
                                                name="message"
                                                rows="5"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100" onClick={submitForm}>
                                            Envoyer
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center mt-3">
                        <Link to="/artisans" className="btn btn-outline-secondary">
                            <i className="bi bi-arrow-left me-2"></i>
                            Retour à la liste des artisans
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArtisanDetailPage; 