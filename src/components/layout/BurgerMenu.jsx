import { NavLink } from "react-router-dom";

function BurgerMenu({
  isOpen,
  isAuthenticated,
  user,
  totalItems,
  onLogout,
  onClose,
}) {
  if (!isOpen) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div className="mobile-menu">
      <nav className="mobile-menu-nav">
        <NavLink to="/" onClick={onClose}>
          Accueil
        </NavLink>

        <NavLink to="/catalog" onClick={onClose}>
          Catalogue
        </NavLink>

        <NavLink to="/cart" onClick={onClose}>
          Panier ({totalItems})
        </NavLink>

        <NavLink to="/contact" onClick={onClose}>
          Contact
        </NavLink>

        <NavLink to="/about" onClick={onClose}>
          À propos
        </NavLink>

        <NavLink to="/legal" onClick={onClose}>
          Mentions légales
        </NavLink>

        <NavLink to="/terms" onClick={onClose}>
          CGU
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/account" onClick={onClose}>
              {user?.firstName || "Mon compte"}
            </NavLink>

            <NavLink to="/orders" onClick={onClose}>
              Mes commandes
            </NavLink>

            <NavLink to="/settings" onClick={onClose}>
              Paramètres
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" onClick={onClose}>
                Admin
              </NavLink>
            )}

            <button
              className="mobile-menu-button"
              onClick={async () => {
                await onLogout();
                onClose();
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={onClose}>
              Connexion
            </NavLink>

            <NavLink to="/register" onClick={onClose}>
              Inscription
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default BurgerMenu;