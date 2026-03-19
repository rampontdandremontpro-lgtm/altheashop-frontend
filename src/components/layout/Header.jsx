import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          Althea Shop
        </Link>

        <nav className="nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/catalog">Catalogue</NavLink>
          <NavLink to="/cart">Panier ({totalItems})</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/account">
                {user?.firstName || "Mon compte"}
              </NavLink>
              <NavLink to="/admin">Admin</NavLink>
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
      </div>
    </header>
  );
}

export default Header;