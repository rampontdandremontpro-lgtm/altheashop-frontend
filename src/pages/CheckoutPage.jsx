import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../api/ordersApi";
import { getAddresses } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPriceCents, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [shippingAddressId, setShippingAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      if (!isAuthenticated) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const data = await getAddresses();
        setAddresses(data);

        if (data.length > 0) {
          setShippingAddressId(String(data[0].id));
        }
      } catch {
        setError("Impossible de charger les adresses.");
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [isAuthenticated]);

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleConfirmOrder = async () => {
    setError("");

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour confirmer la commande.");
      return;
    }

    if (!shippingAddressId) {
      setError("Merci de sélectionner une adresse de livraison.");
      return;
    }

    try {
      setLoadingOrder(true);

      const order = await createOrder({
        shippingAddressId: Number(shippingAddressId),
        paymentMethod,
      });

      await clearCart();
      navigate(`/checkout/success?reference=${order.reference}`);
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

  if (loadingAddresses) {
    return <Loader text="Chargement du checkout..." />;
  }

  return (
    <div className="page-stack">
      <section className="section">
        <h1>Checkout</h1>

        {error && <ErrorMessage message={error} />}

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

            <div className="detail-box">
              <h2>2. Adresse de livraison</h2>

              {addresses.length === 0 ? (
                <div className="checkout-warning">
                  <p>Aucune adresse enregistrée.</p>
                  <Link to="/account/edit" className="btn btn-primary">
                    Ajouter une adresse
                  </Link>
                </div>
              ) : (
                <select
                  value={shippingAddressId}
                  onChange={(e) => setShippingAddressId(e.target.value)}
                  className="checkout-select"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.addressLine1}, {address.postalCode}{" "}
                      {address.city}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="detail-box">
              <h2>3. Paiement</h2>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="checkout-select"
              >
                <option value="card">Carte bancaire</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Paiement à la livraison</option>
              </select>
            </div>

            <div className="detail-box">
              <h2>4. Validation</h2>

              <button
                className="btn btn-primary"
                onClick={handleConfirmOrder}
                disabled={loadingOrder || !isAuthenticated || addresses.length === 0}
              >
                {loadingOrder ? "Confirmation..." : "Confirmer la commande"}
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