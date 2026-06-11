import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminChatbotEscalations,
  resolveAdminChatbotEscalation,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function isEscalationResolved(item) {
  return Boolean(
    item.isResolved ||
      item.resolvedAt ||
      item.status === "resolved" ||
      item.supportStatus === "resolved" ||
      item.supportResolvedAt
  );
}

function AdminChatbotEscalationsPage() {
  const [escalations, setEscalations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEscalations(page = 1) {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminChatbotEscalations(page, pagination.limit);

      setEscalations(data.items);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger les demandes transférées."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEscalations(1);
  }, []);

  const handleResolve = async (id) => {
    try {
      setResolvingId(id);
      setError("");
      setSuccess("");

      await resolveAdminChatbotEscalation(id);

      setEscalations((prev) =>
  prev.map((item) =>
    item.id === id
      ? {
          ...item,
          isResolved: true,
          resolvedAt: item.resolvedAt || new Date().toISOString(),
          status: "resolved",
          supportStatus: "resolved",
          supportResolvedAt:
            item.supportResolvedAt || new Date().toISOString(),
        }
      : item
  )
);

      setSuccess("La demande a bien été marquée comme traitée.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de marquer cette demande comme traitée."
      );
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return <Loader text="Chargement des demandes transférées..." />;
  }

  if (error && escalations.length === 0) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Demandes transférées</h1>
            <p>
              Consultez les demandes envoyées par les clients souhaitant parler
              à un conseiller.
            </p>
          </div>

          <Link to="/admin" className="btn btn-secondary">
            Retour dashboard
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        {escalations.length === 0 ? (
          <EmptyState
            title="Aucune demande"
            message="Aucune demande transférée n’a encore été enregistrée."
          />
        ) : (
          <div className="box table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Sujet</th>
                  <th>Message</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {escalations.map((item) => {
                  const resolved = isEscalationResolved(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        {item.userFullName || `Utilisateur #${item.userId}`}
                      </td>
                      <td>{item.userEmail || "-"}</td>
                      <td>{item.supportSubject || item.subject || "Support client"}</td>
                      <td>{item.message || "-"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            resolved ? "status-delivered" : "status-pending"
                          }`}
                        >
                          {resolved ? "Traitée" : "En attente"}
                        </span>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        {resolved ? (
                          <span>Déjà traitée</span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleResolve(item.id)}
                            disabled={resolvingId === item.id}
                          >
                            {resolvingId === item.id
                              ? "Traitement..."
                              : "Marquer comme traité"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={loadEscalations}
        />
      </section>
    </div>
  );
}

export default AdminChatbotEscalationsPage;