import { useEffect, useState } from "react";
import { forgotPassword } from "../api/authApi";
import { useI18n } from "../context/I18nContext";

function ForgotPasswordPage() {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!success) return;

  const timer = setTimeout(() => {
    setSuccess("");
  }, 5000);

  return () => clearTimeout(timer);
}, [success]);

useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError("");
  }, 5000);

  return () => clearTimeout(timer);
}, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(t("forgotPasswordEmailRequired"));
      return;
    }

    try {
      setLoading(true);

      const result = await forgotPassword(email);

      setSuccess(t("forgotPasswordSuccess"));
      setEmail("");
    } catch (err) {
  const backendMessage = err.response?.data?.message;

  if (backendMessage === "EMAIL_NOT_FOUND") {
    setError(t("emailNotFound"));
  } else {
    setError(t("forgotPasswordError"));
  }
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("forgotPasswordTitle")}</h1>

          <p>{t("forgotPasswordDescription")}</p>

          {error && <div className="box error-box">{error}</div>}
          {success && <div className="box success-box">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("sending") : t("send")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;