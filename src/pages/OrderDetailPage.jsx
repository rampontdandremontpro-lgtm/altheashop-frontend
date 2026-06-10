import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadOrderInvoice, getOrderById } from "../api/ordersApi";
import AccountSidebar from "../components/account/AccountSidebar";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatPrice";
import { useI18n } from "../context/I18nContext";

function getOrderAddress(order) {
  return (
    order.shippingAddress ||
    order.address ||
    order.deliveryAddress ||
    order.billingAddress ||
    null
  );
}

function OrderDetailPage() {
  const { t } = useI18n();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const statusLabels = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    paid: t("statusPaid"),
    processing: t("statusProcessing"),
    shipped: t("statusShipped"),
    delivered: t("statusDelivered"),
    cancelled: t("statusCancelled"),
  };

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            t("loadOrderDetailError")
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id, t]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      await downloadOrderInvoice(order.id, order.reference);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("downloadInvoiceError")
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader text={t("loadingOrderDetail")} />;
  if (error && !order) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message={t("orderNotFound")} />;

  const address = getOrderAddress(order);

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>
              {t("order")} {order.reference}
            </h1>
            <p>
              {t("orderPlacedOn")}{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <Link to="/orders" className="btn btn-secondary">
            {t("backToOrders")}
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="account-layout">
          <AccountSidebar />

          <div className="orders-list">
            <div className="box order-card">
              <div className="order-card-head">
                <div>
                  <h2>{order.reference}</h2>

                  <p className="order-status-line">
                    {t("status")} :
                    <span className={`status-badge status-${order.status}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </p>
                </div>

                <strong>{formatPrice(order.totalPriceCents)}</strong>
              </div>

              <div className="detail-box">
                <h3>{t("shippingAddress")}</h3>

                {address ? (
                  <p>
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""},{" "}
                    {address.postalCode} {address.city}, {address.country}
                  </p>
                ) : (
                  <p>{t("addressUnavailable")}</p>
                )}
              </div>

              <div className="detail-box">
                <h3>{t("payment")}</h3>
                <p>{order.paymentMethod || t("notProvided")}</p>
              </div>

              <div className="detail-box">
                <h3>{t("orderedProducts")}</h3>

                {(order.items || []).length > 0 ? (
                  <ul className="clean-list">
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        {item.name || item.product?.name || t("product")} x{" "}
                        {item.quantity} —{" "}
                        {formatPrice(item.priceCents * item.quantity)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("noOrderedProducts")}</p>
                )}
              </div>

              <div className="account-card-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                >
                  {downloading ? t("downloading") : t("downloadInvoicePdf")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetailPage;