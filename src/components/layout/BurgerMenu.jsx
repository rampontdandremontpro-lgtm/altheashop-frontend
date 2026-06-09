import { NavLink } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import SearchBar from "./SearchBar";
import LanguageSelector from "./LanguageSelector";

function BurgerMenu({
  isOpen,
  isAuthenticated,
  user,
  totalItems,
  onLogout,
  onClose,
}) {
  const { t } = useI18n();

  if (!isOpen) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div id="mobile-menu" className="mobile-menu">
      <div className="mobile-menu-search">
        <SearchBar onSearchDone={onClose} />
      </div>

      <div className="mobile-language-selector">
        <LanguageSelector />
      </div>

      <nav className="mobile-menu-nav" aria-label="Navigation mobile">
        <NavLink to="/" onClick={onClose}>
          {t("home")}
        </NavLink>

        <NavLink to="/catalog" onClick={onClose}>
          {t("catalog")}
        </NavLink>

        <NavLink to="/search" onClick={onClose}>
          {t("search")}
        </NavLink>

        <NavLink to="/cart" onClick={onClose}>
          {t("cart")} ({totalItems})
        </NavLink>

        <NavLink to="/contact" onClick={onClose}>
          {t("contact")}
        </NavLink>

        <NavLink to="/about" onClick={onClose}>
          {t("about")}
        </NavLink>

        <NavLink to="/legal" onClick={onClose}>
          {t("legal")}
        </NavLink>

        <NavLink to="/terms" onClick={onClose}>
          {t("terms")}
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/account" onClick={onClose}>
              {user?.firstName || t("account")}
            </NavLink>

            <NavLink to="/orders" onClick={onClose}>
              {t("orders")}
            </NavLink>

            <NavLink to="/settings" onClick={onClose}>
              {t("settings")}
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" onClick={onClose}>
                {t("admin")}
              </NavLink>
            )}

            <button
              type="button"
              className="mobile-menu-button"
              onClick={async () => {
                await onLogout();
                onClose();
              }}
            >
              {t("logout")}
            </button>
          </>
        ) : (
          <NavLink to="/login" onClick={onClose}>
            {t("login")}
          </NavLink>
        )}
      </nav>
    </div>
  );
}

export default BurgerMenu;