import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatPrice } from "../../utils/formatPrice";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  paid: "Payée",
  processing: "Préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function AdminOrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger la commande."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const updated = await updateAdminOrderStatus(id, status);
      setOrder(updated);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier le statut."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader text="Chargement de la commande..." />;
  if (error && !order) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Commande introuvable." />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Commande {order.reference}</h1>
            <p>
              Commande effectuée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <Link to="/admin/orders" className="btn btn-secondary">
            Retour commandes
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box">
          <h2>Statut</h2>

         <select
  className={`admin-status-select ${order.status}`}
  value={order.status}
  onChange={(e) => handleStatusChange(e.target.value)}
  disabled={updating}
>
  {ORDER_STATUSES.map((status) => (
  <option key={status} value={status}>
    {STATUS_LABELS[status]}
  </option>
))}
</select>
        </div>

        <div className="box">
          <h2>Client</h2>

          {order.user ? (
            <>
              <p>
                {order.user.firstName} {order.user.lastName}
              </p>
              <p>{order.user.email}</p>
              <p>{order.user.phone}</p>
            </>
          ) : (
            <p>Utilisateur supprimé.</p>
          )}
        </div>

        <div className="box">
          <h2>Adresse de livraison</h2>

          {order.shippingAddress ? (
            <p>
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2
                ? `, ${order.shippingAddress.addressLine2}`
                : ""}
              <br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
              <br />
              {order.shippingAddress.country}
            </p>
          ) : (
            <p>Adresse non disponible.</p>
          )}
        </div>

        <div className="box">
          <h2>Produits commandés</h2>

          {(order.items || []).length === 0 ? (
            <p>Aucun produit disponible.</p>
          ) : (
            <div className="order-products-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-product-row">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="order-product-image"
                    />
                  )}

                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      Quantité : {item.quantity} —{" "}
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr />

          <h3>Total : {formatPrice(order.totalPriceCents)}</h3>
        </div>
      </section>
    </div>
  );
}

export default AdminOrderDetailPage;