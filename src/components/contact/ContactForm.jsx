import { useState } from "react";
import { sendContactMessage } from "../../api/contactApi";
import { useI18n } from "../../context/I18nContext";

function ContactForm() {
  const { t } = useI18n();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.subject ||
      !form.message
    ) {
      setError(t("contactFormRequired"));
      return;
    }

    try {
      setLoading(true);

      const result = await sendContactMessage(form);

      setSuccess(result.message || t("contactFormSuccess"));

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("contactFormError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <h2>{t("contactFormTitle")}</h2>

      {error && <div className="box error-box">{error}</div>}

      {success && <div className="box success-box">{success}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder={t("firstName")}
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder={t("lastName")}
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder={t("subject")}
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder={t("yourMessage")}
          value={form.message}
          onChange={handleChange}
          rows="6"
          className="contact-textarea"
        />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? t("sending") : t("send")}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;