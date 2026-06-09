import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";

function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Althea Shop</h2>
          <p>{t("footerDescription")}</p>
        </div>

        <div className="footer-column">
          <h3>{t("navigation")}</h3>
          <Link to="/">{t("home")}</Link>
          <Link to="/catalog">{t("catalog")}</Link>
          <Link to="/contact">{t("contact")}</Link>
        </div>

        <div className="footer-column">
          <h3>{t("information")}</h3>
          <Link to="/terms">{t("terms")}</Link>
          <Link to="/legal">{t("legal")}</Link>
          <Link to="/about">{t("about")}</Link>
        </div>

        <div className="footer-column">
          <h3>{t("socialNetworks")}</h3>
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
        <p>© 2026 Althea Shop — {t("rights")}</p>
      </div>
    </footer>
  );
}

export default Footer;