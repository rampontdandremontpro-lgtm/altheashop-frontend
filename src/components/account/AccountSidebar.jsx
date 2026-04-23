import { NavLink } from "react-router-dom";

function AccountSidebar() {
  return (
    <aside className="box account-sidebar">
      <h2>Espace client</h2>

      <nav className="account-sidebar-nav">
        <NavLink to="/account">Mon profil</NavLink>
        <NavLink to="/orders">Mes commandes</NavLink>
        <NavLink to="/settings">Paramètres</NavLink>
        <NavLink to="/cart">Panier</NavLink>
      </nav>
    </aside>
  );
}

export default AccountSidebar;