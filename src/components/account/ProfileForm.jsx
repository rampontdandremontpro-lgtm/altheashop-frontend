import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../api/usersApi";
import { useI18n } from "../../context/I18nContext";

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function ProfileForm({ onSave, onCancel, onDeleteAccount }) {
  const { user } = useAuth();
  const { t } = useI18n();

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
      setError(t("profileRequiredFields"));
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(t("profileInvalidPhone"));
      return;
    }

    if (emailChanged && !form.currentPassword) {
      setError(t("profileCurrentPasswordRequired"));
      return;
    }

    try {
      setLoading(true);

      await onSave(form);

      setSuccess(t("profileUpdateSuccess"));
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("profileUpdateError")
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
      setPasswordError(t("passwordRequiredFields"));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t("passwordMismatch"));
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword(passwordForm);

      setPasswordSuccess(t("passwordUpdateSuccess"));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          err.message ||
          t("passwordUpdateError")
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDelete = async () => {
    const firstConfirm = window.confirm(t("deleteAccountFirstConfirm"));

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(t("deleteAccountSecondConfirm"));

    if (!secondConfirm) return;

    try {
      setDeleting(true);
      await onDeleteAccount();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("deleteAccountError")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="box">
        <h2>{t("personalInformation")}</h2>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        <form className="account-form-grid" onSubmit={handleSubmit}>
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
            name="phone"
            placeholder={t("phone")}
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
                placeholder={t("currentPasswordRequiredForEmail")}
                value={form.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <p className="form-help-text">{t("emailChangeSecurityHelp")}</p>
            </div>
          )}

          <div className="account-form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("saving") : t("saveChanges")}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={onCancel}
            >
              {t("cancel")}
            </button>

            <button
              className="btn btn-danger"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t("deleting") : t("deleteAccount")}
            </button>
          </div>
        </form>
      </div>

      <div className="box">
        <h2>{t("changePasswordTitle")}</h2>

        {passwordError && <div className="box error-box">{passwordError}</div>}
        {passwordSuccess && (
          <div className="box success-box">{passwordSuccess}</div>
        )}

        <form className="account-form-grid" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder={t("currentPassword")}
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />

          <input
            type="password"
            name="newPassword"
            placeholder={t("newPassword")}
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder={t("confirmNewPassword")}
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
              {passwordLoading ? t("passwordChanging") : t("changePassword")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfileForm;