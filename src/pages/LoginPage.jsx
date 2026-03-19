import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      await login(form);
      setSuccess("Connexion réussie.");
      navigate("/account");
    } catch (err) {
      setError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>Connexion</h1>

          {error && <div className="box error-box">{error}</div>}
          {success && <div className="box success-box">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">Mot de passe oublié</Link>
            <Link to="/register">Créer un compte</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;