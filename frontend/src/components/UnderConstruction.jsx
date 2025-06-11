import React from 'react';
import SEO from './SEO';

const UnderConstruction = ({ title }) => {
    return (
        <div className="container py-5">
            <SEO
                title={title}
                description={`Page ${title} en cours de construction`}
            />
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h1 className="mb-4">{title}</h1>
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-0">
                            <img
                                src="/images/page-en-construction.png"
                                alt="Page en construction"
                                className="img-fluid"
                                style={{ maxWidth: '600px' }}
                            />
                        </div>
                    </div>
                    <h2 className="h3 mb-4">Page en Construction...</h2>
                    <p className="lead text-muted mb-4">
                        Cette page est actuellement en cours de développement. Merci de votre patience.
                    </p>
                    <a href="/" className="btn btn-primary">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction; 