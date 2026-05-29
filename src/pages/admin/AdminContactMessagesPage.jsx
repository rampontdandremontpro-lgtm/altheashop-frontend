import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteContactMessage,
  getContactMessages,
  replyContactMessage,
} from "../../api/contactApi";

function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyForms, setReplyForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [replyLoadingId, setReplyLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

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

  const handleReplyChange = (id, value) => {
    setReplyForms((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReply = async (id) => {
    const reply = replyForms[id]?.trim();

    if (!reply) {
      setError("Merci d'écrire une réponse avant d'envoyer.");
      return;
    }

    try {
      setReplyLoadingId(id);
      setError("");
      setSuccess("");

      const result = await replyContactMessage(id, reply);

      setSuccess(result.message || "Réponse envoyée avec succès.");

      setReplyForms((prev) => ({
        ...prev,
        [id]: "",
      }));

      await loadMessages();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible d'envoyer la réponse."
      );
    } finally {
      setReplyLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce message ?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

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

  const getStatusLabel = (status) => {
    if (status === "answered") return "Répondu";
    return "En attente";
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

        {error && <div className="box error-box">{error}</div>}
        {success && <div className="box success-box">{success}</div>}

        {loading ? (
          <div className="box">Chargement des messages...</div>
        ) : messages.length === 0 ? (
          <div className="box">Aucun message disponible.</div>
        ) : (
          <div className="orders-list">
            {messages.map((message) => (
              <article key={message.id} className="box order-card">
                <div className="order-card-head">
                  <div>
                    <h3>{message.subject}</h3>

                    <p>
                      {message.firstName} {message.lastName}
                    </p>

                    <p>{message.email}</p>
                  </div>

                  <span
                    className={
                      message.status === "answered"
                        ? "contact-status answered"
                        : "contact-status pending"
                    }
                  >
                    {getStatusLabel(message.status)}
                  </span>
                </div>

                <div className="detail-box">
                  <h4>Message client</h4>
                  <p>{message.message}</p>
                </div>

                <div className="detail-box">
                  <p>
                    Reçu le{" "}
                    {new Date(message.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {message.replyMessage && (
                  <div className="detail-box contact-reply-box">
                    <h4>Réponse envoyée</h4>
                    <p>{message.replyMessage}</p>

                    {message.repliedAt && (
                      <p>
                        Répondu le{" "}
                        {new Date(message.repliedAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    )}
                  </div>
                )}

                {message.status !== "answered" && (
                  <div className="detail-box">
                    <h4>Répondre au client</h4>

                    <textarea
                      className="contact-textarea"
                      rows="4"
                      placeholder="Écrire la réponse admin..."
                      value={replyForms[message.id] || ""}
                      onChange={(e) =>
                        handleReplyChange(message.id, e.target.value)
                      }
                    />

                    <div className="account-card-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleReply(message.id)}
                        disabled={replyLoadingId === message.id}
                      >
                        {replyLoadingId === message.id
                          ? "Envoi..."
                          : "Envoyer la réponse"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDelete(message.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}

                {message.status === "answered" && (
                  <div className="account-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleDelete(message.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminContactMessagesPage;