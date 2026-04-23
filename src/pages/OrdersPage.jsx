import { useEffect, useState } from "react";
import { getOrders } from "../api/ordersApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import AccountSidebar from "../components/account/AccountSidebar";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Impossible de charger les commandes.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <Loader text="Chargement des commandes..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Historique des commandes</h1>
            <p>{orders.length} commande(s)</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div>
            {orders.length === 0 ? (
              <EmptyState
                title="Aucune commande"
                message="Vos prochaines commandes apparaîtront ici."
              />
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="box order-card">
                    <div className="order-card-head">
                      <div>
                        <h2>{order.reference}</h2>
                        <p>Statut : {order.status}</p>
                      </div>
                      <div>
                        <strong>{formatPrice(order.totalPriceCents)}</strong>
                      </div>
                    </div>

                    <div className="detail-box">
                      <p>
                        Date : {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                      <p>
                        Livraison : {order.shippingAddress?.addressLine1},{" "}
                        {order.shippingAddress?.postalCode} {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.country}
                      </p>
                      <p>Paiement : {order.paymentMethod}</p>
                    </div>

                    <div className="detail-box">
                      <h3>Produits</h3>
                      <ul className="clean-list">
                        {order.items.map((item) => (
                          <li key={`${order.id}-${item.id}`}>
                            {item.name} x {item.quantity} —{" "}
                            {formatPrice(item.priceCents * item.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
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