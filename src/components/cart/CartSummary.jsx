import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

function CartSummary({ totalItems, totalPriceCents, onClearCart }) {
  return (
    <aside className="box cart-summary">
      <h2>Résumé</h2>

      <div className="summary-row">
        <span>Articles</span>
        <strong>{totalItems}</strong>
      </div>

      <div className="summary-row">
        <span>Total</span>
        <strong>{formatPrice(totalPriceCents)}</strong>
      </div>

      <div className="summary-actions">
        <Link to="/checkout" className="btn btn-primary full-width">
          Passer au checkout
        </Link>

        <button className="btn btn-secondary full-width" onClick={onClearCart}>
          Vider le panier
        </button>
      </div>
    </aside>
  );
}

export default CartSummary;