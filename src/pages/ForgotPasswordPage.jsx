import { useState } from "react";
import { forgotPassword } from "../api/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Merci de saisir votre email.");
      return;
    }

    try {
      setLoading(true);
      const result = await forgotPassword(email);
      setSuccess(result.message);
      setEmail("");
    } catch (err) {
      setError(err.message || "Impossible de traiter la demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>Mot de passe oublié</h1>
          <p>
            Cette page est prête. Quand le backend sera disponible, elle enverra
            une vraie demande de réinitialisation.
          </p>

          {error && <div className="box error-box">{error}</div>}
          {success && <div className="box success-box">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;