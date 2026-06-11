import api from "./axios";

export async function sendContactMessage(payload) {
  const response = await api.post("/contact", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
  });

  return response.data;
}

export async function getContactMessages() {
  const response = await api.get("/contact");
  return Array.isArray(response.data) ? response.data : [];
}

export async function replyContactMessage(id, reply) {
  const response = await api.post(`/contact/${id}/reply`, {
    reply,
  });

  return response.data;
}

export async function deleteContactMessage(id) {
  await api.delete(`/contact/${id}`);
  return true;
}

export async function sendChatbotMessage(
  message,
  language = "fr"
) {
  const response = await api.post("/chatbot/message", {
    message,
    language,
  });

  return response.data;
}

export async function getChatbotMessages() {
  const response = await api.get("/chatbot/messages");
  return Array.isArray(response.data) ? response.data : [];
}

export async function escalateChatbot(payload) {
  const response = await api.post("/chatbot/escalate", {
    message: payload.message,
    subject: payload.subject,
    language: payload.language,
  });

  return response.data;
}