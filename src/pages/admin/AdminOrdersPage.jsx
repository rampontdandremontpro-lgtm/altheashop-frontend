import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
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

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger les commandes admin."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const userText = `${order.user?.firstName || ""} ${
        order.user?.lastName || ""
      } ${order.user?.email || ""}`.toLowerCase();

      const matchesSearch =
        !query ||
        order.reference?.toLowerCase().includes(query) ||
        userText.includes(query) ||
        String(order.id).includes(query);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await updateAdminOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier le statut de la commande."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader text="Chargement des commandes admin..." />;
  if (error && orders.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Commandes admin</h1>
            <p>{filteredOrders.length} commande(s)</p>
          </div>

          <Link to="/admin" className="btn btn-secondary">
            Retour
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box filters">
          <input
            type="text"
            placeholder="Rechercher référence, client, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
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
          <div className="box table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.reference}</td>
                    <td>
                      {order.user ? (
                        <>
                          {order.user.firstName} {order.user.lastName}
                          <br />
                          <small>{order.user.email}</small>
                        </>
                      ) : (
                        "Utilisateur supprimé"
                      )}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>{formatPrice(order.totalPriceCents)}</td>
                    <td>
                      <select
  className={`admin-status-select ${order.status}`}
  value={order.status}
  onChange={(e) => handleStatusChange(order.id, e.target.value)}
  disabled={updatingId === order.id}
>
  {ORDER_STATUSES.map((status) => (
  <option key={status} value={status}>
    {STATUS_LABELS[status]}
  </option>
))}
</select>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="btn btn-secondary"
                        >
                          Voir détail
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOrdersPage;