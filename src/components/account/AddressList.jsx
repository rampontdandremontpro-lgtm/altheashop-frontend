import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../api/usersApi";

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
      setError(err.message || "Impossible de charger les adresses.");
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
    try {
      await deleteAddress(id);
      await loadAddresses();
      setSuccess("Adresse supprimée.");
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || "Impossible de supprimer l'adresse.");
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
      setError("Merci de remplir les champs obligatoires.");
      return;
    }

    if (!isValidPostalCode(form.postalCode)) {
      setError("Le code postal doit contenir exactement 5 chiffres.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      return;
    }

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        setSuccess("Adresse mise à jour.");
      } else {
        await createAddress(form);
        setSuccess("Adresse ajoutée.");
      }

      resetForm();
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer l'adresse.");
    }
  };

  return (
    <div className="box">
      <h2>Adresses</h2>

      {error && <div className="box error-box">{error}</div>}
      {success && <div className="box success-box">{success}</div>}

      <div className="account-cards-list">
        {addresses.length === 0 ? (
          <p>Aucune adresse enregistrée.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="account-card">
              <div className="account-card-head">
                <strong>
                  {address.firstName} {address.lastName}
                </strong>
                {address.isDefault && <span className="badge-default">Par défaut</span>}
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
                  Modifier
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(address.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="detail-box">
        <h3>{editingId ? "Modifier l'adresse" : "Ajouter une adresse"}</h3>

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
            type="text"
            name="addressLine1"
            placeholder="Adresse 1"
            value={form.addressLine1}
            onChange={handleChange}
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Adresse 2"
            value={form.addressLine2}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={form.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="region"
            placeholder="Région"
            value={form.region}
            onChange={handleChange}
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Code postal"
            value={form.postalCode}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={5}
          />
          <input
            type="text"
            name="country"
            placeholder="Pays"
            value={form.country}
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

          <label className="default-toggle">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            <span>Définir comme adresse par défaut</span>
          </label>

          <div className="account-form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Mettre à jour" : "Ajouter"}
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

export default AddressList;