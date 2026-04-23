import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  email: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(EMPTY_FORM);
    setError("");
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Merci de remplir votre email et votre mot de passe.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email,
        password: form.password,
      });

      setForm(EMPTY_FORM);
      navigate("/");
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

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />

            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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