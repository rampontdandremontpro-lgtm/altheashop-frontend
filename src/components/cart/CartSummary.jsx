import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { useI18n } from "../../context/I18nContext";

function CartSummary({ totalItems, totalPriceCents, onClearCart }) {
  const { t } = useI18n();

  return (
    <aside className="box cart-summary">
      <h2>{t("summary")}</h2>

      <div className="summary-row">
        <span>{t("items")}</span>
        <strong>{totalItems}</strong>
      </div>

      <div className="summary-row">
        <span>{t("total")}</span>
        <strong>{formatPrice(totalPriceCents)}</strong>
      </div>

      <div className="summary-actions">
        <Link to="/checkout" className="btn btn-primary full-width">
          {t("checkout")}
        </Link>

        <button
          type="button"
          className="btn btn-secondary full-width"
          onClick={onClearCart}
        >
          {t("clearCart")}
        </button>
      </div>
    </aside>
  );
}

export default CartSummary;