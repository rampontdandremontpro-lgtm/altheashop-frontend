import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Althea Shop</h2>
          <p>
            Plateforme e-commerce spécialisée dans la vente de matériel médical
            professionnel.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navigation</h3>
          <Link to="/">Accueil</Link>
          <Link to="/catalog">Catalogue</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-column">
          <h3>Informations</h3>
          <Link to="/terms">CGU</Link>
          <Link to="/legal">Mentions légales</Link>
          <Link to="/about">À propos</Link>
        </div>

        <div className="footer-column">
          <h3>Réseaux sociaux</h3>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Althea Shop — Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;