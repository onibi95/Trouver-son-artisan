import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ArtisansPage from './pages/ArtisansPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import Footer from './components/Footer';
import SEO from './components/SEO';

// Composant pour les pages simples avec SEO intégré
const SimplePage = ({ title, description, children }) => {
  return (
    <div className="container py-5">
      <SEO title={title} description={description} />
      {children}
    </div>
  );
};

// Pages temporaires
const ContactPage = () => (
  <SimplePage
    title="Contact"
    description="Contactez-nous pour toute question concernant notre plateforme d'artisans ou pour signaler un problème."
  >
    <h1>Page contact (à implémenter)</h1>
  </SimplePage>
);

const NotFoundPage = () => (
  <SimplePage
    title="Page non trouvée"
    description="La page que vous recherchez n'existe pas ou a été déplacée."
  >
    <div className="text-center">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page non trouvée</h2>
      <p className="lead mb-4">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <a href="/" className="btn btn-primary">Retour à l'accueil</a>
    </div>
  </SimplePage>
);

function App() {
  return (
    <Router>
      <div className="app d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artisans" element={<ArtisansPage />} />
            {/* Routes futures */}
            <Route path="/categorie/:nom" element={<ArtisansPage />} />
            <Route path="/artisan/:id" element={<ArtisanDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
