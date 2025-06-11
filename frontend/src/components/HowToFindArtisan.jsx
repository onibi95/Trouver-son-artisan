import React from 'react';
import { Link } from 'react-router-dom';

const HowToFindArtisan = () => {
    const steps = [
        {
            number: 1,
            title: "Choisir la catégorie d'artisanat dans le menu.",
            description: "Parcourez les différentes catégories d'artisanat disponibles pour trouver celle qui correspond à votre besoin.",
            icon: "bi-grid-3x3-gap"
        },
        {
            number: 2,
            title: "Choisir un artisan.",
            description: "Consultez les profils des artisans, leurs spécialités et leurs notes pour sélectionner celui qui vous convient le mieux.",
            icon: "bi-person-badge"
        },
        {
            number: 3,
            title: "Le contacter via le formulaire de contact.",
            description: "Utilisez notre formulaire simple pour décrire votre projet et entrer en contact avec l'artisan choisi.",
            icon: "bi-chat-dots"
        },
        {
            number: 4,
            title: "Une réponse sera apportée sous 48h.",
            description: "Nos artisans s'engagent à vous répondre dans un délai maximum de 48 heures ouvrées.",
            icon: "bi-clock-history"
        }
    ];

    return (
        <section className="how-to-find py-5" style={{ backgroundColor: '#f1f8fc' }}>
            <div className="container">
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h2 className="display-5 fw-bold mb-3" style={{ color: '#00497c' }}>Comment trouver mon artisan ?</h2>
                        <p className="lead col-lg-8 mx-auto" style={{ color: '#384050' }}>
                            Suivez ces quelques étapes simples pour trouver et contacter l'artisan idéal pour votre projet.
                        </p>
                    </div>
                </div>

                <div className="row">
                    {steps.map((step) => (
                        <div key={step.number} className="col-md-6 col-lg-3 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                                    <div className="step-number mb-4 position-relative">
                                        <div className="badge rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: '#0074c7' }}>
                                            <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                                                {step.number}
                                            </span>
                                        </div>
                                        <i className={`bi ${step.icon} position-absolute`} style={{ fontSize: '1.75rem', bottom: '-15px', right: '-15px', color: '#0074c7', backgroundColor: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(56,64,80,0.2)' }}></i>
                                    </div>
                                    <h3 className="card-title h5 mb-3 fw-bold" style={{ color: '#00497c' }}>{step.title}</h3>
                                    <p className="card-text" style={{ color: '#384050' }}>{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <Link to="/artisans" className="btn btn-lg px-4 py-2" style={{ backgroundColor: '#0074c7', color: 'white', borderColor: '#0074c7' }}>
                            Découvrir nos artisans
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToFindArtisan; 