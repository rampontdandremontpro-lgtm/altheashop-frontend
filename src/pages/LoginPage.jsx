import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const EMPTY_FORM = {
  email: "",
  password: "",
  rememberMe: false,
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useI18n();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    setForm(EMPTY_FORM);
    setError("");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getLoginErrorMessage = (backendMessage) => {
    if (backendMessage === "EMAIL_NOT_CONFIRMED") {
      return t("emailNotConfirmed");
    }

    if (backendMessage === "INVALID_CREDENTIALS") {
      return t("invalidCredentials");
    }

    return t("loginError");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError(t("loginRequiredFields"));
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      if (result?.requiresTwoFactor) {
        navigate("/admin-2fa", {
          state: {
            email: result.email || form.email,
            from: redirectTo,
            rememberMe: result.rememberMe,
          },
        });

        return;
      }

      setForm(EMPTY_FORM);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(getLoginErrorMessage(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("loginTitle")}</h1>

          {error && <div className="box error-box">{error}</div>}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />

            <input
              type="password"
              name="password"
              placeholder={t("password")}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <label className="default-toggle">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />

              <span>{t("rememberMe")}</span>
            </label>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("loginLoading") : t("loginSubmit")}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">{t("forgotPasswordLink")}</Link>
            <Link to="/register">{t("createAccountLink")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;