import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { downloadOrderInvoice, getOrders } from "../api/ordersApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import AccountSidebar from "../components/account/AccountSidebar";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/80x80?text=Image";

function getOrderYear(order) {
  return new Date(order.createdAt).getFullYear();
}

function getItemImage(item) {
  return (
    item.imageUrl ||
    item.product?.imageUrl ||
    item.product?.images?.[0]?.url ||
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
  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceLoadingId, setInvoiceLoadingId] = useState(null);
  const [error, setError] = useState("");

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
            "Impossible de charger les commandes."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

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
      await downloadOrderInvoice(order.id, order.reference);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de télécharger la facture."
      );
    } finally {
      setInvoiceLoadingId(null);
    }
  };

  if (loading) return <Loader text="Chargement des commandes..." />;
  if (error && orders.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Historique des commandes</h1>
            <p>{filteredOrders.length} commande(s)</p>
          </div>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="account-layout">
          <AccountSidebar />

          <div>
            <div className="box filters">
              <input
                type="text"
                placeholder="Rechercher par référence, produit, date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">Toutes les années</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title="Aucune commande"
                message="Aucune commande ne correspond à votre recherche."
              />
            ) : (
              <div className="orders-list">
                {sortedYears.map((year) => (
                  <div key={year}>
                    <h2>{year}</h2>

                    {ordersByYear[year].map((order) => (
                      <div key={order.id} className="box order-card">
                        <div className="order-card-head">
                          <div>
                            <h3>Référence de commande : {order.reference}</h3>
                            <p>Statut : {order.status}</p>
                          </div>

                          <strong>
                            Total : {formatPrice(order.totalPriceCents)}
                          </strong>
                        </div>

                        <div className="detail-box">
                          <p>
                            Commande effectuée le{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>

                        <div className="detail-box">
                          <h4>Produits</h4>

                          {(order.items || []).length === 0 ? (
                            <p>Aucun produit disponible.</p>
                          ) : (
                            <div className="order-products-list">
                              {order.items.map((item) => (
                                <div
                                  key={`${order.id}-${item.id}`}
                                  className="order-product-row"
                                >
                                  <img
                                    src={getItemImage(item)}
                                    alt={item.name || item.product?.name}
                                    className="order-product-image"
                                    onError={(e) => {
                                      e.currentTarget.src = FALLBACK_IMAGE;
                                    }}
                                  />

                                  <div>
                                    <strong>
                                      {item.name || item.product?.name}
                                    </strong>
                                    <p>
                                      Quantité : {item.quantity} —{" "}
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
                            Voir le détail
                          </Link>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={invoiceLoadingId === order.id}
                          >
                            {invoiceLoadingId === order.id
                              ? "Téléchargement..."
                              : "Facture PDF"}
                          </button>
                        </div>
                      </div>
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