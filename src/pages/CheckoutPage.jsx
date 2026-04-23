import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { createOrder } from "../api/ordersApi";
import AddressForm from "../components/checkout/AddressForm";
import PaymentForm from "../components/checkout/PaymentForm";

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPriceCents, clearCart } = useCart();

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    country: "France",
  });

  const [payment, setPayment] = useState({
    method: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    setError("");

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour confirmer la commande.");
      return;
    }

    if (!address.addressLine1 || !address.postalCode || !address.city || !address.country) {
      setError("Merci de compléter l'adresse de livraison.");
      return;
    }

    if (
      payment.method === "card" &&
      (!payment.cardName || !payment.cardNumber || !payment.expiry || !payment.cvv)
    ) {
      setError("Merci de compléter les informations de paiement.");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder({
        customerEmail: user?.email,
        items: cartItems,
        totalPriceCents,
        shippingAddress: address,
        paymentMethod: payment.method,
      });

      clearCart();
      navigate(`/checkout/success?reference=${order.reference}`);
    } catch (err) {
      setError(err.message || "Impossible de confirmer la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="section">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="box">
            <h2>1. Compte</h2>
            {isAuthenticated ? (
              <p>
                Connecté avec : <strong>{user?.email}</strong>
              </p>
            ) : (
              <div className="checkout-warning">
                <p>Vous devez être connecté pour confirmer la commande.</p>
                <Link to="/login" className="btn btn-primary">
                  Se connecter
                </Link>
              </div>
            )}

            <AddressForm address={address} onChange={handleAddressChange} />
            <PaymentForm payment={payment} onChange={handlePaymentChange} />

            {error && <div className="box error-box">{error}</div>}

            <div className="detail-box">
              <h2>4. Validation</h2>
              <button
                className="btn btn-primary"
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                {loading ? "Confirmation..." : "Confirmer la commande"}
              </button>
            </div>
          </div>

          <aside className="box">
            <h2>Résumé commande</h2>

            <div className="checkout-summary-list">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <strong>{formatPrice(item.priceCents * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="detail-box">
              <p className="checkout-total">
                Total : <strong>{formatPrice(totalPriceCents)}</strong>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default CheckoutPage;