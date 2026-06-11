import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

function AdminTwoFactorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyTwoFactor } = useAuth();
  const { t } = useI18n();

  const email = location.state?.email || "";
  const redirectTo = location.state?.from || "/admin";
  const rememberMe = Boolean(location.state?.rememberMe);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const getTwoFactorErrorMessage = (backendMessage) => {
    if (backendMessage === "INVALID_2FA_CODE") {
      return t("invalidTwoFactorCode");
    }

    if (backendMessage === "TWO_FACTOR_CODE_EXPIRED") {
      return t("twoFactorCodeExpired");
    }

    return t("twoFactorError");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError(t("twoFactorCodeRequired"));
      return;
    }

    try {
      setLoading(true);

      await verifyTwoFactor({
        email,
        code,
        rememberMe,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(getTwoFactorErrorMessage(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("twoFactorTitle")}</h1>

          <p>{t("twoFactorDescription")}</p>

          {email && (
            <p>
              <strong>{email}</strong>
            </p>
          )}

          {error && <div className="box error-box">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="code"
              placeholder={t("twoFactorCodePlaceholder")}
              value={code}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("twoFactorLoading") : t("twoFactorSubmit")}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">{t("backToLogin")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminTwoFactorPage;