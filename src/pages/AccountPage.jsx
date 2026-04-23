import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccountSidebar from "../components/account/AccountSidebar";

function AccountPage() {
  const { user, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      setLoading(true);
      await updateProfile(form);
      setSuccess("Profil mis à jour.");
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Mon compte</h1>
            <p>Bienvenue {user?.firstName}.</p>
          </div>

          <div className="account-actions">
            <Link to="/orders" className="btn btn-secondary">
              Mes commandes
            </Link>
            <Link to="/settings" className="btn btn-secondary">
              Paramètres
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div className="account-grid-content">
            <div className="box">
              <h2>Informations personnelles</h2>

              {error && <div className="box error-box">{error}</div>}
              {success && <div className="box success-box">{success}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                />

                <input type="email" value={user?.email || ""} disabled />

                <input
                  type="text"
                  name="phone"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>
            </div>

            <div className="box">
              <h2>Résumé du compte</h2>
              <ul className="clean-list">
                <li>profil utilisateur</li>
                <li>historique commandes</li>
                <li>préférences</li>
                <li>future gestion des adresses</li>
                <li>future gestion des paiements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;