import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./SearchBar";
import LanguageSelector from "./LanguageSelector";

function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Retour à l'accueil">
          Althea Shop
        </Link>

        <div className="header-search-wrapper desktop-only">
          <SearchBar />
        </div>

        <nav className="nav nav-desktop" aria-label="Navigation principale">
          <NavLink to="/">{t("home")}</NavLink>
          <NavLink to="/catalog">{t("catalog")}</NavLink>
          <NavLink to="/contact">{t("contact")}</NavLink>
          <NavLink to="/cart">
            {t("cart")} ({totalItems})
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/account">{user?.firstName || t("account")}</NavLink>
              {isAdmin && <NavLink to="/admin">{t("admin")}</NavLink>}

              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <NavLink to="/login">{t("login")}</NavLink>
          )}
        </nav>

        <div className="header-language desktop-only">
          <LanguageSelector />
        </div>

        <button
          type="button"
          className="burger-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          ☰
        </button>
      </div>

      <BurgerMenu
        isOpen={menuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        totalItems={totalItems}
        onLogout={handleLogout}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}

export default Header;