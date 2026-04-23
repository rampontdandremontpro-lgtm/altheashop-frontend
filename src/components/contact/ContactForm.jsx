import { useState } from "react";

function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
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

    setSuccess(
      "Votre message a bien été préparé. Le branchement avec l'API contact pourra être ajouté plus tard."
    );

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="box">
      <h2>Formulaire de contact</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

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

        <button className="btn btn-primary" type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default ContactForm;