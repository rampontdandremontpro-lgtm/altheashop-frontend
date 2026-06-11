import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  downloadOrderInvoice,
  getOrders,
  reorder,
} from "../api/ordersApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import AccountSidebar from "../components/account/AccountSidebar";
import { useI18n } from "../context/I18nContext";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE = "https://via.placeholder.com/80x80?text=Image";

function getOrderYear(order) {
  return new Date(order.createdAt).getFullYear();
}

function getItemName(item, t) {
  return item.name || item.product?.name || t("product");
}

function getItemImage(item) {
  return (
    item.imageUrl ||
    item.product?.imageUrl ||
    item.product?.images?.[0]?.url ||
    item.product?.images?.[0]?.imageUrl ||
    FALLBACK_IMAGE
  );
}

function orderMatchesSearch(order, search) {
  const query = search.trim().toLowerCase();

  if (!query) return true;

  const productNames = (order.items || [])
    .map((item) => item.name || item.product?.name || "")
    .join(" ")
    .toLowerCase();

  return (
    order.reference?.toLowerCase().includes(query) ||
    productNames.includes(query) ||
    new Date(order.createdAt).toLocaleDateString("fr-FR").includes(query)
  );
}

function OrdersPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { loadCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceLoadingId, setInvoiceLoadingId] = useState(null);
  const [reorderLoadingId, setReorderLoadingId] = useState(null);
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
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            t("loadOrdersError")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [t]);

  const years = useMemo(() => {
    return [...new Set(orders.map(getOrderYear))].sort((a, b) => b - a);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) =>
        selectedYear === "all"
          ? true
          : getOrderYear(order) === Number(selectedYear)
      )
      .filter((order) => orderMatchesSearch(order, search))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, selectedYear, search]);

  const ordersByYear = useMemo(() => {
    return filteredOrders.reduce((acc, order) => {
      const year = getOrderYear(order);

      if (!acc[year]) acc[year] = [];

      acc[year].push(order);
      return acc;
    }, {});
  }, [filteredOrders]);

  const sortedYears = Object.keys(ordersByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  const handleDownloadInvoice = async (order) => {
    try {
      setInvoiceLoadingId(order.id);
      setError("");

      await downloadOrderInvoice(order.id, order.reference);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("downloadInvoiceError")
      );
    } finally {
      setInvoiceLoadingId(null);
    }
  };

  const handleReorder = async (order) => {
    try {
      setReorderLoadingId(order.id);
      setError("");

      await reorder(order.id);
      await loadCart();

      navigate("/cart");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("reorderError")
      );
    } finally {
      setReorderLoadingId(null);
    }
  };

  if (loading) return <Loader text={t("loadingOrders")} />;
  if (error && orders.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("ordersHistory")}</h1>
            <p>
              {filteredOrders.length} {t("ordersCount")}
            </p>
          </div>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="account-layout">
          <AccountSidebar />

          <div>
            <div className="box filters">
              <input
                type="text"
                placeholder={t("ordersSearchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">{t("allYears")}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title={t("noOrdersTitle")}
                message={t("noOrdersMessage")}
              />
            ) : (
              <div className="orders-list">
                {sortedYears.map((year) => (
                  <div key={year} className="orders-year-group">
                    <h2>{year}</h2>

                    {ordersByYear[year].map((order) => (
                      <article key={order.id} className="box order-card">
                        <div className="order-card-head">
                          <div>
                            <h3>
                              {t("orderReference")} : {order.reference}
                            </h3>

                            <p className="order-status-line">
                              {t("status")} :
                              <span
                                className={`status-badge status-${order.status}`}
                              >
                                {statusLabels[order.status] || order.status}
                              </span>
                            </p>
                          </div>

                          <strong>
                            {t("total")} : {formatPrice(order.totalPriceCents)}
                          </strong>
                        </div>

                        <div className="detail-box">
                          <p>
                            {t("orderPlacedOn")}{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>

                        <div className="detail-box">
                          <h4>{t("products")}</h4>

                          {(order.items || []).length === 0 ? (
                            <p>{t("noProductAvailable")}</p>
                          ) : (
                            <div className="order-products-list">
                              {order.items.map((item) => (
                                <div
                                  key={`${order.id}-${item.id}`}
                                  className="order-product-row"
                                >
                                  <img
                                    src={getItemImage(item)}
                                    alt={getItemName(item, t)}
                                    className="order-product-image"
                                    onError={(e) => {
                                      e.currentTarget.src = FALLBACK_IMAGE;
                                    }}
                                  />

                                  <div>
                                    <strong>{getItemName(item, t)}</strong>
                                    <p>
                                      {t("quantity")} : {item.quantity} —{" "}
                                      {formatPrice(
                                        item.priceCents * item.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="account-card-actions">
                          <Link
                            to={`/orders/${order.id}`}
                            className="btn btn-primary"
                          >
                            {t("viewDetails")}
                          </Link>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={invoiceLoadingId === order.id}
                          >
                            {invoiceLoadingId === order.id
                              ? t("downloading")
                              : t("invoicePdf")}
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleReorder(order)}
                            disabled={reorderLoadingId === order.id}
                          >
                            {reorderLoadingId === order.id
                              ? t("reorderLoading")
                              : t("reorder")}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrdersPage;