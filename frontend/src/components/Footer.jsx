import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          console.log("[FOOTER] fetchCategories");
            const data = await getCategories();
            setCategories(data);
            
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories:", error);
        }
    };


    fetchCategories();
}, []);

  return (
    <footer className="bg-secondary-transparent text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="mb-3">
              <img
                src="/images/Logo.png"
                alt="Artisans Logo"
                height="150"
                className="d-inline-block align-top bg-white rounded p-1"
              />
            </div>
            <h5 className="mb-3">Artisans</h5>
            <p className="text-white-50">
              Trouvez les meilleurs artisans près de chez vous et contactez-les facilement pour tous vos projets.
            </p>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Liens</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-decoration-none text-white-50">Accueil</a></li>
              <li className="mb-2"><a href="/artisans" className="text-decoration-none text-white-50">Artisans</a></li>
              <li className="mb-2"><a href="/categories" className="text-decoration-none text-white-50">Catégories</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Catégories</h5>
            <ul className="list-unstyled">

              {categories.map(category => (
                <li key={category.id} className="mb-2"><a href={`/categorie/${category.name.toLowerCase()}`} className="text-decoration-none text-white-50">{category.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Pages légales</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/mentions-legales" className="text-decoration-none text-white-50">Mentions légales</a></li>
              <li className="mb-2"><a href="/donnees-personnelles" className="text-decoration-none text-white-50">Données personnelles</a></li>
              <li className="mb-2"><a href="/accessibilite" className="text-decoration-none text-white-50">Accessibilité</a></li>
              <li className="mb-2"><a href="/cgv" className="text-decoration-none text-white-50">CGV</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="mb-3">Antenne de Lyon</h5>
            <address className="text-white-50 mb-0">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-geo-alt me-2"></i> 101 cours Charlemagne
                </li>
                <li className="mb-2">
                  CS 20033
                </li>
                <li className="mb-2">
                  69269 LYON CEDEX 02
                </li>
                <li className="mb-2">
                  France
                </li>
                <li className="mb-2">
                  <i className="bi bi-telephone me-2"></i> +33 (0)4 26 73 40 00
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope me-2"></i> contact@artisans.fr
                </li>
              </ul>
            </address>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-white-50 mb-0">
              &copy; {new Date().getFullYear()} Artisans. Tous droits réservés.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3">
                <a href="#" className="text-decoration-none text-white-50">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li className="list-inline-item me-3">
                <a href="#" className="text-decoration-none text-white-50">
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item me-3">
                <a href="#" className="text-decoration-none text-white-50">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-white-50">
                  <i className="bi bi-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 