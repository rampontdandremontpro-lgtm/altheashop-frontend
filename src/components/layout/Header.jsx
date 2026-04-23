import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import BurgerMenu from "./BurgerMenu";

function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          Althea Shop
        </Link>

        <nav className="nav nav-desktop">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/catalog">Catalogue</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart">Panier ({totalItems})</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/account">
                {user?.firstName || "Mon compte"}
              </NavLink>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <button className="nav-logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Connexion</NavLink>
              <NavLink to="/register">Inscription</NavLink>
            </>
          )}
        </nav>

        <button
          className="burger-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Ouvrir le menu"
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