import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminChatbotMessages } from "../../api/adminApi";
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

function AdminChatbotMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages(page = 1) {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminChatbotMessages(page, pagination.limit);

      setMessages(data.items);
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
          "Impossible de charger les conversations chatbot."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages(1);
  }, []);

  const handlePageChange = (nextPage) => {
    loadMessages(nextPage);
  };

  if (loading) {
    return <Loader text="Chargement des conversations chatbot..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Conversations chatbot</h1>
            <p>
              Consultez les échanges entre les clients connectés et l’assistant
              Althea Shop.
            </p>
          </div>

          <Link to="/admin" className="btn btn-secondary">
            Retour dashboard
          </Link>
        </div>

        {messages.length === 0 ? (
          <EmptyState
            title="Aucune conversation"
            message="Aucun échange chatbot n’a encore été enregistré."
          />
        ) : (
          <div className="box table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Message utilisateur</th>
                  <th>Réponse chatbot</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((item) => (
                  <tr key={item.id}>
                    <td>{item.userFullName || `Utilisateur #${item.userId}`}</td>
                    <td>{item.userEmail || "-"}</td>
                    <td>{item.message}</td>
                    <td>{item.reply}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}

export default AdminChatbotMessagesPage;