import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { useI18n } from "../context/I18nContext";

function ResetPasswordPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!token) {
      setError(t("resetPasswordMissingToken"));
      return;
    }

    if (!password || !confirmPassword) {
      setError(t("resetPasswordRequiredFields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPasswordMismatch"));
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password,
      });

      setSuccess(t("resetPasswordSuccess"));
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("resetPasswordError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("resetPasswordTitle")}</h1>

          <p>{t("resetPasswordDescription")}</p>

          {error && <div className="box error-box">{error}</div>}
          {success && <div className="box success-box">{success}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder={t("newPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder={t("confirmNewPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("resetPasswordLoading") : t("resetPasswordSubmit")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ResetPasswordPage;