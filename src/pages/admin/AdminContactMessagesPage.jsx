import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteContactMessage,
  getContactMessages,
} from "../../api/contactApi";

function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);

      const data = await getContactMessages();

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger les messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Supprimer ce message ?"
    );

    if (!confirmed) return;

    try {
      await deleteContactMessage(id);
      await loadMessages();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer le message."
      );
    }
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
  <div>
    <h1>Messages contact</h1>
    <p>{messages.length} message(s)</p>
  </div>

  <Link to="/admin" className="btn btn-secondary">
    Retour
  </Link>
</div>

        {error && (
          <div className="box error-box">{error}</div>
        )}

        {loading ? (
          <div className="box">
            Chargement des messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="box">
            Aucun message disponible.
          </div>
        ) : (
          <div className="orders-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className="box order-card"
              >
                <div className="order-card-head">
                  <div>
                    <h3>{message.subject}</h3>

                    <p>
                      {message.firstName}{" "}
                      {message.lastName}
                    </p>

                    <p>{message.email}</p>
                  </div>
                </div>

                <div className="detail-box">
                  <p>{message.message}</p>
                </div>

                <div className="detail-box">
                  <p>
                    Reçu le{" "}
                    {new Date(
                      message.createdAt
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="account-card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleDelete(message.id)
                    }
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminContactMessagesPage;