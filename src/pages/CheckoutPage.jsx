import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { createOrder } from "../api/ordersApi";
import { createPaymentIntent } from "../api/paymentsApi";
import { getAddresses } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({
  addresses,
  cartItems,
  totalPriceCents,
  clearCart,
  onOrderCompleted,
}) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [shippingAddressId, setShippingAddressId] = useState(
    addresses[0]?.id ? String(addresses[0].id) : ""
  );
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");

  const selectedAddress = addresses.find(
    (address) => String(address.id) === String(shippingAddressId)
  );

  const handleConfirmOrder = async () => {
    setError("");

    if (!shippingAddressId) {
      setError("Merci de sélectionner une adresse de livraison.");
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe n'est pas encore prêt.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Merci de renseigner les informations de carte.");
      return;
    }

    try {
      setLoadingOrder(true);

      const paymentIntent = await createPaymentIntent(totalPriceCents);

      const result = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (result.error) {
        setError(result.error.message || "Paiement refusé.");
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        setError("Le paiement n'a pas pu être validé.");
        return;
      }

      const order = await createOrder({
        shippingAddressId: Number(shippingAddressId),
        paymentMethod: "card",
      });

      onOrderCompleted();

      await clearCart();

      navigate(
        `/checkout/success?reference=${order.reference}&total=${order.totalPriceCents}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de confirmer la commande."
      );
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <div className="checkout-grid">
      <div className="box">
        {error && <ErrorMessage message={error} />}

        <div className="detail-box">
          <h2>1. Adresse de livraison</h2>

          {addresses.length === 0 ? (
            <div className="checkout-warning">
              <p>Aucune adresse enregistrée.</p>
              <Link to="/account/edit" className="btn btn-primary">
                Ajouter une adresse
              </Link>
            </div>
          ) : (
            <>
              <select
                value={shippingAddressId}
                onChange={(e) => setShippingAddressId(e.target.value)}
                className="checkout-select"
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.addressLine1}, {address.postalCode} {address.city}
                  </option>
                ))}
              </select>

              {selectedAddress && (
                <div className="checkout-selected-box">
                  <strong>Adresse sélectionnée</strong>
                  <p>
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p>
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2
                      ? `, ${selectedAddress.addressLine2}`
                      : ""}
                  </p>
                  <p>
                    {selectedAddress.postalCode} {selectedAddress.city},{" "}
                    {selectedAddress.country}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="detail-box">
          <h2>2. Paiement sécurisé</h2>

          <div className="stripe-card-box">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                  },
                },
              }}
            />
          </div>

          <p className="form-help-text">
            Le paiement est traité par Stripe. Les informations bancaires ne
            sont pas stockées dans le site.
          </p>
        </div>

        <div className="detail-box">
          <h2>3. Validation</h2>

          <button
            className="btn btn-primary"
            onClick={handleConfirmOrder}
            disabled={loadingOrder || addresses.length === 0}
          >
            {loadingOrder
              ? "Paiement en cours..."
              : `Payer ${formatPrice(totalPriceCents)}`}
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
  );
}

function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPriceCents, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAddresses() {
      if (!isAuthenticated) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const data = await getAddresses();
        setAddresses(Array.isArray(data) ? data : []);
      } catch {
        setError("Impossible de charger les adresses.");
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [isAuthenticated]);

  if ((!cartItems || cartItems.length === 0) && !orderCompleted) {
    return <Navigate to="/cart" replace />;
  }

  if (loadingAddresses) {
    return <Loader text="Chargement du checkout..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="page-stack">
        <section className="section">
          <div className="box checkout-warning">
            <h1>Connexion requise</h1>
            <p>Vous devez être connecté pour finaliser votre commande.</p>
            <Link to="/login" className="btn btn-primary">
              Se connecter
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="page-stack">
        <section className="section">
          <ErrorMessage message="Clé publique Stripe manquante dans le fichier .env : VITE_STRIPE_PUBLIC_KEY." />
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Checkout</h1>
            <p>
              Connecté avec : <strong>{user?.email}</strong>
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Elements stripe={stripePromise}>
          <CheckoutForm
            addresses={addresses}
            cartItems={cartItems}
            totalPriceCents={totalPriceCents}
            clearCart={clearCart}
            onOrderCompleted={() => setOrderCompleted(true)}
          />
        </Elements>
      </section>
    </div>
  );
}

export default CheckoutPage;