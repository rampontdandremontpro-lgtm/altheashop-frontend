function AddressForm({ address, onChange }) {
  return (
    <div className="detail-box">
      <h2>2. Adresse de livraison</h2>

      <div className="checkout-form-grid">
        <input
          type="text"
          name="addressLine1"
          placeholder="Adresse"
          value={address.addressLine1}
          onChange={onChange}
        />

        <input
          type="text"
          name="addressLine2"
          placeholder="Complément d'adresse"
          value={address.addressLine2}
          onChange={onChange}
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Code postal"
          value={address.postalCode}
          onChange={onChange}
        />

        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={address.city}
          onChange={onChange}
        />

        <input
          type="text"
          name="country"
          placeholder="Pays"
          value={address.country}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default AddressForm;