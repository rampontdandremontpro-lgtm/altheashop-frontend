import { useState } from "react";

const initialMessages = [
  {
    id: 1,
    role: "bot",
    text: "Bonjour, je suis l'assistant Althea Shop. Comment puis-je vous aider ?",
  },
];

function getBotReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes("livraison")) {
    return "La partie livraison sera reliée plus tard au backend commandes et checkout.";
  }

  if (lower.includes("commande")) {
    return "Le suivi des commandes sera disponible quand l'API orders sera branchée.";
  }

  if (lower.includes("produit")) {
    return "Vous pouvez consulter les produits depuis le catalogue et les fiches produit.";
  }

  if (lower.includes("panier")) {
    return "Le panier fonctionne déjà côté frontend avec stockage local.";
  }

  return "Merci pour votre message. Cette version du chatbot est une base d'interface prête à être reliée à une vraie API plus tard.";
}

function ChatbotWidget() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
    };

    const botMessage = {
      id: Date.now() + 1,
      role: "bot",
      text: getBotReply(input.trim()),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="box chatbot-box">
      <h2>Chatbot</h2>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.role === "user" ? "user" : "bot"}`}
          >
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      <form className="chatbot-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default ChatbotWidget;