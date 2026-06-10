import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
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

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError(t("registerRequiredFields"));
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      setForm(EMPTY_FORM);
      navigate("/");
    } catch (err) {
      setError(err.message || t("registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section auth-section">
        <div className="box auth-box">
          <h1>{t("registerTitle")}</h1>

          {error && <div className="box error-box">{error}</div>}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="text"
              name="firstName"
              placeholder={t("firstName")}
              value={form.firstName}
              onChange={handleChange}
              autoComplete="off"
            />

            <input
              type="text"
              name="lastName"
              placeholder={t("lastName")}
              value={form.lastName}
              onChange={handleChange}
              autoComplete="off"
            />

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
              {loading ? t("registerLoading") : t("registerSubmit")}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">{t("alreadyHaveAccount")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;