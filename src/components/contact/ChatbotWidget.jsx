import { useEffect, useMemo, useRef, useState } from "react";
import {
  escalateChatbot,
  getChatbotMessages,
  sendChatbotMessage,
} from "../../api/contactApi";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";

const SUPPORTED_LANGUAGES = ["fr", "en", "ar", "he"];

function getSafeLanguage(language) {
  const shortLanguage = (language || "fr").split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(shortLanguage) ? shortLanguage : "fr";
}

function normalizeApiMessages(apiMessages, welcomeMessage) {
  if (!Array.isArray(apiMessages) || apiMessages.length === 0) {
    return [welcomeMessage];
  }

  const sortedMessages = [...apiMessages].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();

    return dateA - dateB;
  });

  const normalized = sortedMessages.flatMap((item) => [
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

  return [welcomeMessage, ...normalized];
}

function isUnauthorizedError(err) {
  return err.response?.status === 401;
}

function ChatbotWidget() {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useI18n();
  const messagesEndRef = useRef(null);

  const currentLanguage = getSafeLanguage(language);

  const welcomeMessage = useMemo(
    () => ({
      id: "welcome",
      role: "bot",
      text: t("chatbotWelcome"),
    }),
    [t]
  );

  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [error, setError] = useState("");

  async function reloadHistory() {
    if (!isAuthenticated) {
      setMessages([welcomeMessage]);
      return;
    }

    const data = await getChatbotMessages();
    setMessages(normalizeApiMessages(data, welcomeMessage));
  }

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoadingHistory(true);
        setError("");

        await reloadHistory();
      } catch {
        setMessages([welcomeMessage]);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [isAuthenticated, user?.id, welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending, escalating]);

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

      const result = await sendChatbotMessage(text, currentLanguage);

      const botMessage = {
        id: `local-bot-${Date.now()}`,
        role: "bot",
        text: result.reply || result.message || t("chatbotFallbackReply"),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (isAuthenticated) {
        try {
          await reloadHistory();
        } catch {
          // Si le rechargement échoue, on garde l'affichage local.
        }
      }
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setMessages((prev) => [
          ...prev,
          {
            id: `local-guest-${Date.now()}`,
            role: "bot",
            text: t("chatbotGuestReply"),
          },
        ]);

        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          t("chatbotContactError")
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `local-error-${Date.now()}`,
          role: "bot",
          text: t("chatbotUnavailable"),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleEscalate = async () => {
    try {
      setEscalating(true);
      setError("");

      const lastUserMessage =
        [...messages]
          .reverse()
          .find((message) => message.role === "user")?.text ||
        t("chatbotEscalationDefaultMessage");

      await escalateChatbot({
        message: lastUserMessage,
        subject: t("chatbotEscalationSubject"),
        language: currentLanguage,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `escalation-${Date.now()}`,
          role: "bot",
          text: t("chatbotEscalationSuccess"),
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("chatbotEscalationError")
      );
    } finally {
      setEscalating(false);
    }
  };

  return (
    <div className="box chatbot-box">
      <div className="chatbot-header">
        <div>
          <h2>{t("chatbotTitle")}</h2>
          <p>{t("chatbotSubtitle")}</p>
        </div>
      </div>

      {error && <div className="box error-box">{error}</div>}

      <div className="chatbot-messages">
        {loadingHistory ? (
          <div className="chat-message bot">
            <span>{t("loadingChatHistory")}</span>
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
            <span>{t("chatbotReplyLoading")}</span>
          </div>
        )}

        {escalating && (
          <div className="chat-message bot">
            <span>{t("chatbotEscalating")}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={t("writeMessage")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />

        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? t("sending") : t("send")}
        </button>
      </form>

      <div className="chatbot-escalation">
        <button
          type="button"
          className="btn btn-secondary full-width"
          onClick={handleEscalate}
          disabled={escalating}
        >
          {escalating ? t("chatbotEscalating") : t("chatbotEscalate")}
        </button>
      </div>
    </div>
  );
}

export default ChatbotWidget;