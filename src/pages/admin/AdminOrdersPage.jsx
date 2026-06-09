import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import AdminTable from "../../components/admin/AdminTable";
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
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();
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

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderText = `${order.reference || ""} ${
        order.customerName || ""
      } ${order.customerEmail || ""}`.toLowerCase();

      const matchesSearch =
        !query || orderText.includes(query);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const columns = [
    {
      key: "reference",
      label: "Référence",
    },
    {
      key: "customerName",
      label: "Client",
      render: (order) =>
        order.customerName ||
        `${order.user?.firstName || ""} ${order.user?.lastName || ""}`,
    },
    {
      key: "totalPriceCents",
      label: "Montant",
      render: (order) => formatPrice(order.totalPriceCents),
    },
    {
  key: "status",
  label: "Statut",
  render: (order) => (
    <span className={`status-badge status-${order.status}`}>
      {STATUS_LABELS[order.status] || order.status}
    </span>
  ),
},
    {
      key: "createdAt",
      label: "Date",
      render: (order) =>
        order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("fr-FR")
          : "-",
    },
  ];

  if (loading) {
    return <Loader text="Chargement des commandes..." />;
  }

  if (error && orders.length === 0) {
    return <ErrorMessage message={error} />;
  }

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
            placeholder="Rechercher référence ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="paid">Payée</option>
            <option value="processing">Préparation</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            title="Aucune commande"
            message="Aucune commande ne correspond à votre recherche."
          />
        ) : (
          <AdminTable
            columns={columns}
            data={filteredOrders}
            emptyMessage="Aucune commande disponible."
            actions={(order) => (
              <div className="admin-actions">
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="btn btn-secondary"
                >
                  Voir
                </Link>
              </div>
            )}
          />
        )}
      </section>
    </div>
  );
}

export default AdminOrdersPage;