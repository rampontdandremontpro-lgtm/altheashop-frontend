import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, totalPriceCents } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-stack">
        <section className="section">
          <div className="box">
            <h1>Checkout</h1>
            <p>Votre panier est vide.</p>
            <Link to="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </div>
    );
  }

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
                <p>Vous devez être connecté pour continuer plus tard.</p>
                <Link to="/login" className="btn btn-primary">
                  Se connecter
                </Link>
              </div>
            )}

            <div className="detail-box">
              <h2>2. Adresse</h2>
              <p>À brancher quand l'API user/address sera prête.</p>
            </div>

            <div className="detail-box">
              <h2>3. Paiement</h2>
              <p>À brancher quand l'API checkout/payment sera prête.</p>
            </div>

            <div className="detail-box">
              <h2>4. Validation</h2>
              <button className="btn btn-primary" disabled>
                Paiement bientôt disponible
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