import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div className="account-header">
          <div>
            <h1>Mon compte</h1>
            <p>Bienvenue {user?.firstName}.</p>
          </div>

          <div className="account-actions">
            <Link to="/orders" className="btn btn-secondary">
              Mes commandes
            </Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="account-grid">
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
            <h2>Résumé</h2>
            <p>
              Cette page est prête pour être branchée plus tard à :
            </p>
            <ul className="clean-list">
              <li>adresses</li>
              <li>moyens de paiement</li>
              <li>historique des commandes</li>
              <li>préférences utilisateur</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;