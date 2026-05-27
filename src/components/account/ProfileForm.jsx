import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../api/usersApi";

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function ProfileForm({ onSave, onCancel, onDeleteAccount }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const emailChanged = form.email !== user?.email;

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
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
      setError("Le numéro de téléphone doit contenir exactement 10 chiffres.");
      return;
    }

    if (emailChanged && !form.currentPassword) {
      setError(
        "Pour modifier votre email, merci de renseigner votre mot de passe actuel."
      );
      return;
    }

    try {
      setLoading(true);

      await onSave(form);

      setSuccess("Informations personnelles mises à jour.");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de mettre à jour le profil."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Merci de remplir tous les champs du mot de passe.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword(passwordForm);

      setPasswordSuccess("Mot de passe modifié avec succès.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier le mot de passe."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDelete = async () => {
    const firstConfirm = window.confirm(
      "Êtes-vous sûre de vouloir supprimer votre compte ? Cette action est irréversible."
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "Dernière confirmation : votre compte sera désactivé définitivement."
    );

    if (!secondConfirm) return;

    try {
      setDeleting(true);
      await onDeleteAccount();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer le compte."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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

          {emailChanged && (
            <div className="full-row">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mot de passe actuel obligatoire pour modifier l'email"
                value={form.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <p className="form-help-text">
                Pour votre sécurité, le mot de passe actuel est demandé lorsque
                vous changez votre email.
              </p>
            </div>
          )}

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

      <div className="box">
        <h2>Modifier le mot de passe</h2>

        {passwordError && <div className="box error-box">{passwordError}</div>}
        {passwordSuccess && (
          <div className="box success-box">{passwordSuccess}</div>
        )}

        <form className="account-form-grid" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Mot de passe actuel"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Nouveau mot de passe"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le nouveau mot de passe"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />

          <div className="account-form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfileForm;