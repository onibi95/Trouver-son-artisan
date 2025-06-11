import React from 'react';
import { Link } from 'react-router-dom';
import './ArtisanCard.css';

const ArtisanCard = ({ artisan }) => {
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

        return <div className="d-flex">{stars} <span className="ms-1 text-muted">({note})</span></div>;
    };

    return (
        <div className="card h-100 shadow-sm border-0 hover-shadow">
            <div className="card-body">
                <h5 className="card-title text-truncate">{artisan.nom}</h5>
                <div className="mb-2">
                    {renderStars(artisan.note)}
                </div>
                <p className="card-text mb-1">
                    <i className="bi bi-tools me-2 text-primary"></i>
                    <span className="text-muted">{artisan.specialite}</span>
                </p>
                <p className="card-text">
                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                    <span className="text-muted">{artisan.ville}</span>
                </p>
                <Link to={`/artisan/${artisan.id}`} className="btn btn-sm btn-outline-primary mt-2">
                    Voir le profil
                </Link>
            </div>
        </div>
    );
};

export default ArtisanCard; 