import { useEffect, useMemo, useState } from "react";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "../../api/usersApi";
import { useI18n } from "../../context/I18nContext";

const CARD_BRANDS = [
  { value: "cb", labelKey: "cardBrandCb", icon: "💳" },
  { value: "visa", labelKey: "cardBrandVisa", icon: "🟦" },
  { value: "mastercard", labelKey: "cardBrandMastercard", icon: "🟧" },
  { value: "amex", labelKey: "cardBrandAmex", icon: "⬛" },
];

const EMPTY_FORM = {
  cardName: "",
  cardNumber: "",
  cvv: "",
  expiry: "",
  brand: "cb",
  isDefault: false,
};

function normalizeCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function normalizeCvv(value) {
  return value.replace(/\D/g, "").slice(0, 3);
}

function normalizeExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

function isExpiryValid(expiry) {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(match[2]);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  if (year > currentYear) return true;
  if (year < currentYear) return false;

  return month >= currentMonth;
}

function getBrandLabel(brand, t) {
  const foundBrand = CARD_BRANDS.find((item) => item.value === brand);

  if (!foundBrand) {
    return `💳 ${t("cardBrandDefault")}`;
  }

  return `${foundBrand.icon} ${t(foundBrand.labelKey)}`;
}

function PaymentMethods() {
  const { t } = useI18n();

  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [expiryError, setExpiryError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMethods = async () => {
    try {
      setError("");
      const data = await getPaymentMethods();
      setMethods(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("paymentMethodsLoadError")
      );
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setExpiryError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let nextValue = type === "checkbox" ? checked : value;

    if (name === "cardNumber") {
      nextValue = normalizeCardNumber(value);
    }

    if (name === "cvv") {
      nextValue = normalizeCvv(value);
    }

    if (name === "expiry") {
      nextValue = normalizeExpiry(value);

      if (nextValue.length === 5) {
        setExpiryError(isExpiryValid(nextValue) ? "" : t("cardExpiryInvalid"));
      } else {
        setExpiryError("");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleEdit = (method) => {
    setEditingId(method.id);

    setForm({
      cardName: method.cardName || method.cardholderName || "",
      cardNumber: "",
      cvv: "",
      expiry: method.expiry || "",
      brand: method.brand || "cb",
      isDefault: Boolean(method.isDefault),
    });

    if (method.expiry) {
      setExpiryError(isExpiryValid(method.expiry) ? "" : t("cardExpiryInvalid"));
    } else {
      setExpiryError("");
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.cardName || !form.expiry || !form.brand) {
      setError(t("paymentRequiredFields"));
      return;
    }

    if (!editingId && !form.cardNumber.trim()) {
      setError(t("cardNumberRequired"));
      return;
    }

    if (!editingId && !form.cvv.trim()) {
      setError(t("cardCvvRequired"));
      return;
    }

    if (!editingId && form.cvv.trim().length !== 3) {
      setError(t("cardCvvInvalid"));
      return;
    }

    if (!isExpiryValid(form.expiry)) {
      setError(t("cardExpiryInvalid"));
      return;
    }

    try {
      if (editingId) {
        await updatePaymentMethod(editingId, form);
        setSuccess(t("paymentMethodUpdated"));
      } else {
        await createPaymentMethod(form);
        setSuccess(t("paymentMethodAdded"));
      }

      resetForm();
      await loadMethods();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("paymentMethodSaveError")
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("paymentDeleteConfirm"));

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deletePaymentMethod(id);
      setSuccess(t("paymentMethodDeleted"));
      await loadMethods();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("paymentMethodDeleteError")
      );
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setError("");
      setSuccess("");

      await setDefaultPaymentMethod(id);
      setSuccess(t("paymentDefaultUpdated"));
      await loadMethods();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("paymentDefaultUpdateError")
      );
    }
  };

  const formTitle = useMemo(
    () => (editingId ? t("editCard") : t("addCard")),
    [editingId, t]
  );

  return (
    <div className="box">
      <h2>{t("paymentMethodsTitle")}</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

      <div className="account-cards-list">
        {methods.length === 0 ? (
          <p>{t("noPaymentMethodSaved")}</p>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="account-card">
              <div className="account-card-head">
                <strong>{getBrandLabel(method.brand, t)}</strong>

                {method.isDefault && (
                  <span className="badge-default">
                    {t("defaultPaymentMethod")}
                  </span>
                )}
              </div>

              <p>{method.cardName || method.cardholderName}</p>
              <p>**** **** **** {method.last4}</p>
              <p>
                {t("expires")} : {method.expiry}
              </p>

              <div className="account-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEdit(method)}
                >
                  {t("edit")}
                </button>

                {!method.isDefault && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    {t("setDefault")}
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(method.id)}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="detail-box">
        <h3>{formTitle}</h3>

        <form className="account-form-grid" onSubmit={handleSubmit}>
          <input
            type="text"
            name="cardName"
            placeholder={t("cardName")}
            value={form.cardName}
            onChange={handleChange}
          />

          {!editingId && (
            <>
              <input
                type="text"
                name="cardNumber"
                placeholder={t("cardNumber")}
                value={form.cardNumber}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={19}
              />

              <input
                type="text"
                name="cvv"
                placeholder={t("cardCvv")}
                value={form.cvv}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={3}
              />
            </>
          )}

          <input
            type="text"
            name="expiry"
            placeholder={t("cardExpiryPlaceholder")}
            value={form.expiry}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={5}
          />

          <select name="brand" value={form.brand} onChange={handleChange}>
            {CARD_BRANDS.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.icon} {t(brand.labelKey)}
              </option>
            ))}
          </select>

          <label className="default-toggle">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />

            <span>{t("setAsDefaultCard")}</span>
          </label>

          {expiryError && (
            <div className="inline-error full-row">{expiryError}</div>
          )}

          <div className="account-form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? t("updateCard") : t("addCardButton")}
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

export default PaymentMethods;