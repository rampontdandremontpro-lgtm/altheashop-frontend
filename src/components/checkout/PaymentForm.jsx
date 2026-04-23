function PaymentForm({ payment, onChange }) {
  return (
    <div className="detail-box">
      <h2>3. Paiement</h2>

      <div className="checkout-form-grid">
        <select name="method" value={payment.method} onChange={onChange}>
          <option value="card">Carte bancaire</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Paiement à la livraison</option>
        </select>

        <input
          type="text"
          name="cardName"
          placeholder="Nom sur la carte"
          value={payment.cardName}
          onChange={onChange}
        />

        <input
          type="text"
          name="cardNumber"
          placeholder="Numéro de carte"
          value={payment.cardNumber}
          onChange={onChange}
        />

        <input
          type="text"
          name="expiry"
          placeholder="MM/AA"
          value={payment.expiry}
          onChange={onChange}
        />

        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={payment.cvv}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default PaymentForm;