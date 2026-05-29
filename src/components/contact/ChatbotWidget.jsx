import { useEffect, useRef, useState } from "react";
import {
  getChatbotMessages,
  sendChatbotMessage,
} from "../../api/contactApi";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "bot",
  text: "Bonjour, je suis l'assistant Althea Shop. Comment puis-je vous aider ?",
};

function normalizeApiMessages(apiMessages) {
  if (!Array.isArray(apiMessages) || apiMessages.length === 0) {
    return [WELCOME_MESSAGE];
  }

  const normalized = apiMessages
    .slice()
    .reverse()
    .flatMap((item) => [
      {
        id: `user-${item.id}`,
        role: "user",
        text: item.message,
      },
      {
        id: `bot-${item.id}`,
        role: "bot",
        text: item.reply,
      },
    ]);

  return [WELCOME_MESSAGE, ...normalized];
}

function ChatbotWidget() {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoadingHistory(true);
        setError("");

        const data = await getChatbotMessages();
        setMessages(normalizeApiMessages(data));
      } catch {
        setMessages([WELCOME_MESSAGE]);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    const temporaryUserMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, temporaryUserMessage]);
    setInput("");
    setError("");

    try {
      setSending(true);

      const result = await sendChatbotMessage(text);

      const botMessage = {
        id: `local-bot-${Date.now()}`,
        role: "bot",
        text:
          result.reply ||
          result.message ||
          "Merci pour votre message. Un conseiller pourra vous répondre prochainement.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de contacter le chatbot."
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `local-error-${Date.now()}`,
          role: "bot",
          text: "Désolé, le chatbot est momentanément indisponible.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="box chatbot-box">
      <div className="chatbot-header">
        <div>
          <h2>Assistant Althea Shop</h2>
          <p>Posez une question sur une commande, une livraison ou un produit.</p>
        </div>
      </div>

      {error && <div className="box error-box">{error}</div>}

      <div className="chatbot-messages">
        {loadingHistory ? (
          <div className="chat-message bot">
            <span>Chargement de l'historique...</span>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.role === "user" ? "user" : "bot"
              }`}
            >
              <span>{message.text}</span>
            </div>
          ))
        )}

        {sending && (
          <div className="chat-message bot">
            <span>Réponse en cours...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />

        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}

export default ChatbotWidget;