import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Merci de remplir les deux champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPassword({
        token,
        password,
      });

      setSuccess(
        result.message ||
          "Votre mot de passe a bien été réinitialisé. Vous pouvez vous connecter."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de réinitialiser le mot de passe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>Réinitialiser le mot de passe</h1>

          {!token && (
            <div className="box error-box">
              Lien de réinitialisation invalide ou expiré.
            </div>
          )}

          {error && <div className="box error-box">{error}</div>}
          {success && <div className="box success-box">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !token}
            >
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Retour à la connexion</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPasswordPage;