import { useEffect, useMemo, useState } from "react";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "../../api/usersApi";

const CARD_BRANDS = [
  { value: "cb", label: "💳 Carte bancaire" },
  { value: "visa", label: "🟦 Visa" },
  { value: "mastercard", label: "🟧 Mastercard" },
  { value: "amex", label: "⬛ American Express" },
];

const EMPTY_FORM = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  brand: "cb",
  isDefault: false,
};

function normalizeCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
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

function getBrandLabel(brand) {
  return CARD_BRANDS.find((item) => item.value === brand)?.label || "💳 Carte";
}

function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [expiryError, setExpiryError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMethods = async () => {
    try {
      const data = await getPaymentMethods();
      setMethods(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les moyens de paiement.");
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

    if (name === "expiry") {
      nextValue = normalizeExpiry(value);

      if (nextValue.length === 5) {
        setExpiryError(
          isExpiryValid(nextValue)
            ? ""
            : "Cette carte est expirée ou la date est invalide."
        );
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
      cardName: method.cardName || "",
      cardNumber: "",
      expiry: method.expiry || "",
      brand: method.brand || "cb",
      isDefault: Boolean(method.isDefault),
    });

    if (method.expiry) {
      setExpiryError(
        isExpiryValid(method.expiry)
          ? ""
          : "Cette carte est expirée ou la date est invalide."
      );
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
      setError("Merci de remplir les champs obligatoires.");
      return;
    }

    if (editingId && !form.cardNumber.trim()) {
      setError("Merci de saisir à nouveau le numéro de carte pour la modification.");
      return;
    }

    if (!editingId && !form.cardNumber.trim()) {
      setError("Merci de saisir le numéro de carte.");
      return;
    }

    if (!isExpiryValid(form.expiry)) {
      setError("La date d'expiration est invalide ou la carte est expirée.");
      return;
    }

    try {
      if (editingId) {
        await updatePaymentMethod(editingId, form);
        setSuccess("Moyen de paiement mis à jour.");
      } else {
        await createPaymentMethod(form);
        setSuccess("Moyen de paiement ajouté.");
      }

      resetForm();
      await loadMethods();
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer le moyen de paiement.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethod(id);
      setSuccess("Moyen de paiement supprimé.");
      await loadMethods();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Impossible de supprimer le moyen de paiement.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultPaymentMethod(id);
      setSuccess("Méthode par défaut mise à jour.");
      await loadMethods();
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour la méthode par défaut.");
    }
  };

  const formTitle = useMemo(
    () => (editingId ? "Modifier une carte" : "Ajouter une carte"),
    [editingId]
  );

  return (
    <div className="box">
      <h2>Moyens de paiement</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

      <div className="account-cards-list">
        {methods.length === 0 ? (
          <p>Aucun moyen de paiement enregistré.</p>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="account-card">
              <div className="account-card-head">
                <strong>{getBrandLabel(method.brand)}</strong>
                {method.isDefault && <span className="badge-default">Par défaut</span>}
              </div>

              <p>{method.cardName}</p>
              <p>**** **** **** {method.last4}</p>
              <p>Expire : {method.expiry}</p>

              <div className="account-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEdit(method)}
                >
                  Modifier
                </button>

                {!method.isDefault && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Définir par défaut
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(method.id)}
                >
                  Supprimer
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
            placeholder="Nom sur la carte"
            value={form.cardName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="cardNumber"
            placeholder={
              editingId ? "Ressaisir le numéro de carte" : "Numéro de carte"
            }
            value={form.cardNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            name="expiry"
            placeholder="MM/AA"
            value={form.expiry}
            onChange={handleChange}
          />

          <select name="brand" value={form.brand} onChange={handleChange}>
            {CARD_BRANDS.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
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
            <span>Définir comme carte par défaut</span>
          </label>

          {expiryError && (
            <div className="inline-error full-row">{expiryError}</div>
          )}

          <div className="account-form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Mettre à jour la carte" : "Ajouter la carte"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentMethods;