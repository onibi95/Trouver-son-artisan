import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HowToFindArtisan from './HowToFindArtisan';
import ArtisanCard from './ArtisanCard';
import SEO from './SEO';
import { getTopArtisans, getCategories } from '../services/api';

const HomePage = () => {
  const [topArtisans, setTopArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      console.log("[HOME-PAGE] fetchCategories");
      const data = await getCategories();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);



  useEffect(() => {
    const fetchTopArtisans = async () => {
      try {
        const data = await getTopArtisans();
        setTopArtisans(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des artisans à l'honneur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtisans();
  }, []);

  return (
    <div>
      <SEO
        title="Accueil"
        description="Trouvez les meilleurs artisans près de chez vous. Notre plateforme vous met en relation avec des artisans qualifiés et passionnés dans votre région."
      />

      {/* Hero Section */}
      <section className="hero bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Trouvez les meilleurs artisans près de chez vous</h1>
              <p className="lead mb-4">
                Notre plateforme vous met en relation avec des artisans qualifiés et passionnés dans votre région.
              </p>
              <Link to="/artisans" className="btn btn-light btn-lg px-4">Découvrir les artisans</Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src="/images/17403.jpg"
                alt="Artisans"
                className="img-fluid"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/007bff/white?text=Artisans';
                }}
              />
              <div className="text-end mt-2 small">
                <a href="http://www.freepik.com" className="text-white text-decoration-underline">Designed by macrovector / Freepik</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Find Artisan Section */}
      <HowToFindArtisan />

      {/* Featured Artisans Section */}
      <section className="featured-artisans py-5">
        <div className="container">
          <h2 className="text-center mb-4">Nos artisans à l'honneur</h2>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : topArtisans.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {topArtisans.map(artisan => (
                <div key={artisan.id} className="col">
                  <ArtisanCard artisan={artisan} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="lead">Aucun artisan mis à l'honneur pour le moment.</p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/artisans" className="btn btn-outline-primary">
              Voir tous les artisans
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Catégories d'artisanat</h2>
          <div className="row text-center">
            {categories.map((category) => (
              <div key={category.id} className="col-md-3 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">{category.name}</h3>
                    <p className="text-muted">Découvrez nos artisans spécialisés</p>
                    <Link
                      to={`/categorie/${category.name.toLowerCase()}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Explorer
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 