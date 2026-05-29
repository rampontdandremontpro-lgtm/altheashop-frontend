import { useEffect, useState } from "react";
import {
  getChatbotMessages,
  sendChatbotMessage,
} from "../../api/contactApi";

function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getChatbotMessages();

        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        } else {
          setMessages([
            {
              id: 1,
              role: "bot",
              message:
                "Bonjour, je suis l'assistant Althea Shop.",
            },
          ]);
        }
      } catch {
        setMessages([
          {
            id: 1,
            role: "bot",
            message:
              "Bonjour, je suis l'assistant Althea Shop.",
          },
        ]);
      }
    }

    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      message: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      setLoading(true);

      const result = await sendChatbotMessage(text);

      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        message:
          result.reply ||
          result.message ||
          "Merci pour votre message.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "bot",
          message:
            "Impossible de contacter le chatbot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      <div className="chatbot-header">
        Assistant Althea Shop
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.role === "user"
                ? "chat-user"
                : "chat-bot"
            }`}
          >
            {message.message}
          </div>
        ))}

        {loading && (
          <div className="chat-message chat-bot">
            Réponse en cours...
          </div>
        )}
      </div>

      <form
        className="chatbot-input-area"
        onSubmit={handleSend}
      >
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default ChatbotWidget;