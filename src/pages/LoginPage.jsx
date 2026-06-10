import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const EMPTY_FORM = {
  email: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();

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
      setError(t("loginRequiredFields"));
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
      setError(err.message || t("loginError"));
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