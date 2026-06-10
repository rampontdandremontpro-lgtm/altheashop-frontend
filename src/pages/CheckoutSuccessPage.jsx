import { Link, useSearchParams } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { useI18n } from "../context/I18nContext";

function CheckoutSuccessPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");
  const total = Number(searchParams.get("total") || 0);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="box success-page">
          <div className="checkout-confirmation-badge">✓</div>

          <h1>{t("checkoutSuccessTitle")}</h1>

          <p>
            {t("checkoutSuccessThanks")} <strong>Althea Shop</strong>.{" "}
            {t("checkoutSuccessMessage")}
          </p>

          {reference && (
            <p>
              {t("orderReference")} : <strong>{reference}</strong>
            </p>
          )}

          {total > 0 && (
            <p>
              {t("totalPaid")} : <strong>{formatPrice(total)}</strong>
            </p>
          )}

          <p>{t("checkoutSuccessInfo")}</p>

          <div className="success-actions">
            <Link to="/orders" className="btn btn-primary">
              {t("viewMyOrders")}
            </Link>

            <Link to="/catalog" className="btn btn-secondary">
              {t("backToCatalog")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckoutSuccessPage;