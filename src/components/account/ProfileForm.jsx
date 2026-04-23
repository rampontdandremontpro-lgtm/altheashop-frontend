import { useState } from "react";

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function ProfileForm({ profile, onSave, onCancel, onDeleteAccount }) {
  const [form, setForm] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = normalizePhone(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Le prénom, le nom, l'email et le téléphone sont obligatoires.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      return;
    }

    try {
      setLoading(true);
      await onSave(form);
      setSuccess("Informations personnelles mises à jour.");
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûre de vouloir supprimer votre compte ? Cette action est irréversible."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await onDeleteAccount();
    } catch (err) {
      setError(err.message || "Impossible de supprimer le compte.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="box">
      <h2>Informations personnelles</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

      <form className="account-form-grid" onSubmit={handleSubmit}>
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
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          inputMode="numeric"
          maxLength={10}
        />

        <div className="account-form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
          >
            Annuler
          </button>

          <button
            className="btn btn-danger"
            type="button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Supprimer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;