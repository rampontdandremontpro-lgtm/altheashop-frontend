import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../api/usersApi";
import { useI18n } from "../../context/I18nContext";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "France",
  phone: "",
  isDefault: false,
};

function normalizePhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function normalizePostalCode(value) {
  return value.replace(/\D/g, "").slice(0, 5);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

function isValidPostalCode(postalCode) {
  return /^\d{5}$/.test(postalCode);
}

function AddressList() {
  const { t } = useI18n();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err.message || t("addressesLoadError"));
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let nextValue = type === "checkbox" ? checked : value;

    if (name === "phone") {
      nextValue = normalizePhone(value);
    }

    if (name === "postalCode") {
      nextValue = normalizePostalCode(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      region: address.region || "",
      postalCode: address.postalCode || "",
      country: address.country || "France",
      phone: address.phone || "",
      isDefault: Boolean(address.isDefault),
    });

    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("addressDeleteConfirm"));

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAddress(id);
      await loadAddresses();

      setSuccess(t("addressDeleted"));

      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || t("addressDeleteError"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.addressLine1 ||
      !form.city ||
      !form.postalCode ||
      !form.country ||
      !form.phone
    ) {
      setError(t("addressRequiredFields"));
      return;
    }

    if (!isValidPostalCode(form.postalCode)) {
      setError(t("addressInvalidPostalCode"));
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(t("addressInvalidPhone"));
      return;
    }

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        setSuccess(t("addressUpdated"));
      } else {
        await createAddress(form);
        setSuccess(t("addressAdded"));
      }

      resetForm();
      await loadAddresses();
    } catch (err) {
      setError(err.message || t("addressSaveError"));
    }
  };

  return (
    <div className="box">
      <h2>{t("addressesTitle")}</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

      <div className="account-cards-list">
        {addresses.length === 0 ? (
          <p>{t("noAddressSaved")}</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="account-card">
              <div className="account-card-head">
                <strong>
                  {address.firstName} {address.lastName}
                </strong>

                {address.isDefault && (
                  <span className="badge-default">{t("defaultAddress")}</span>
                )}
              </div>

              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}

              <p>
                {address.postalCode} {address.city}
              </p>

              {address.region && <p>{address.region}</p>}
              <p>{address.country}</p>
              {address.phone && <p>{address.phone}</p>}

              <div className="account-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEdit(address)}
                >
                  {t("edit")}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(address.id)}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="detail-box">
        <h3>{editingId ? t("editAddress") : t("addAddressTitle")}</h3>

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
            type="text"
            name="addressLine1"
            placeholder={t("addressLine1")}
            value={form.addressLine1}
            onChange={handleChange}
          />

          <input
            type="text"
            name="addressLine2"
            placeholder={t("addressLine2")}
            value={form.addressLine2}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder={t("city")}
            value={form.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="region"
            placeholder={t("region")}
            value={form.region}
            onChange={handleChange}
          />

          <input
            type="text"
            name="postalCode"
            placeholder={t("postalCode")}
            value={form.postalCode}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={5}
          />

          <input
            type="text"
            name="country"
            placeholder={t("country")}
            value={form.country}
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

          <label className="default-toggle">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />

            <span>{t("setAsDefaultAddress")}</span>
          </label>

          <div className="account-form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? t("update") : t("add")}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressList;