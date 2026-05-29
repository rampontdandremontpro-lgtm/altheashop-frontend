import { useState } from "react";
import { sendContactMessage } from "../../api/contactApi";

function ContactForm() {
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
      setError("Merci de remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);

      const result = await sendContactMessage(form);

      setSuccess(
        result.message || "Votre message a bien été envoyé."
      );

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
          "Impossible d'envoyer le message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <h2>Contact</h2>

      {error && <div className="box error-box">{error}</div>}

      {success && (
        <div className="box success-box">{success}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Sujet"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Votre message"
          value={form.message}
          onChange={handleChange}
          rows="6"
          className="contact-textarea"
        />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;