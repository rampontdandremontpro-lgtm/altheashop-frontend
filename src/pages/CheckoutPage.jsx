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
import { useI18n } from "../context/I18nContext";
import { formatPrice } from "../utils/formatPrice";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ addresses, cartItems, totalPriceCents, clearCart }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useI18n();

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
      setError(t("selectShippingAddressError"));
      return;
    }

    if (!stripe || !elements) {
      setError(t("stripeNotReady"));
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError(t("cardRequired"));
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
        setError(result.error.message || t("paymentDeclined"));
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        setError(t("paymentNotValidated"));
        return;
      }

      const order = await createOrder({
        shippingAddressId: Number(shippingAddressId),
        paymentMethod: "card",
      });

      navigate(
        `/checkout/success?reference=${order.reference}&total=${order.totalPriceCents}`,
        { replace: true }
      );

      window.setTimeout(() => {
        clearCart();
      }, 0);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || t("orderConfirmError")
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
          <h2>{t("shippingAddressStep")}</h2>

          {addresses.length === 0 ? (
            <div className="checkout-warning">
              <p>{t("noAddress")}</p>

              <Link to="/account/edit" className="btn btn-primary">
                {t("addAddress")}
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
                  <strong>{t("selectedAddress")}</strong>

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
          <h2>{t("securePaymentStep")}</h2>

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

          <p className="form-help-text">{t("stripeHelp")}</p>
        </div>

        <div className="detail-box">
          <h2>{t("validationStep")}</h2>

          <button
            className="btn btn-primary"
            onClick={handleConfirmOrder}
            disabled={loadingOrder || addresses.length === 0}
          >
            {loadingOrder
              ? t("paymentLoading")
              : `${t("pay")} ${formatPrice(totalPriceCents)}`}
          </button>
        </div>
      </div>

      <aside className="box">
        <h2>{t("orderSummary")}</h2>

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
            {t("total")} : <strong>{formatPrice(totalPriceCents)}</strong>
          </p>
        </div>
      </aside>
    </div>
  );
}

function CheckoutPage() {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPriceCents, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
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
        setError(t("loadAddressesError"));
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [isAuthenticated, t]);

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (loadingAddresses) {
    return <Loader text={t("loadingCheckout")} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="page-stack">
        <section className="section">
          <div className="box checkout-warning">
            <h1>{t("loginRequired")}</h1>
            <p>{t("loginRequiredMessage")}</p>

            <Link to="/login" className="btn btn-primary">
              {t("loginAction")}
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
          <ErrorMessage message={t("stripeMissingKey")} />
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("checkoutTitle")}</h1>
            <p>
              {t("connectedWith")} : <strong>{user?.email}</strong>
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
          />
        </Elements>
      </section>
    </div>
  );
}

export default CheckoutPage;