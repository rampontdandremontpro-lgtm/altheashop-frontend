import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/authApi";
import { useI18n } from "../context/I18nContext";

function VerifyEmailPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function confirmEmail() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        if (!token) {
          setError(t("verifyEmailMissingToken"));
          return;
        }

        await verifyEmail(token);
        setSuccess(t("verifyEmailSuccess"));
      } catch (err) {
  const backendMessage = err.response?.data?.message;

  if (backendMessage === "INVALID_EMAIL_TOKEN") {
    setError(t("invalidEmailToken"));
  } else if (backendMessage === "EMAIL_TOKEN_EXPIRED") {
    setError(t("emailTokenExpired"));
  } else {
    setError(t("verifyEmailError"));
  }
} finally {
        setLoading(false);
      }
    }

    confirmEmail();
  }, [token, t]);

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("verifyEmailTitle")}</h1>

          {loading && <div className="box">{t("verifyEmailLoading")}</div>}
          {success && <div className="box success-box">{success}</div>}
          {error && <div className="box error-box">{error}</div>}

          <div className="auth-links">
            <Link to="/login" className="btn btn-primary">
              {t("goToLogin")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerifyEmailPage;