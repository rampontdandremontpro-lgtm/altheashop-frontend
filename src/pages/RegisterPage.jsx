import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = normalizePhone(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      navigate("/account");
    } catch (err) {
      setError(err.message || "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>Créer un compte</h1>

          {error && <div className="box error-box">{error}</div>}

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

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
            />

            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">J'ai déjà un compte</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;