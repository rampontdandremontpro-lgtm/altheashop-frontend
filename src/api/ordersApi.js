import api from "./axios";

export async function getOrders() {
  const response = await api.get("/orders/me");
  return response.data;
}

export async function getOrderById(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function createOrder(payload) {
  const response = await api.post("/orders/checkout", {
    shippingAddressId: payload.shippingAddressId,
    paymentMethod: payload.paymentMethod,
  });

  return response.data;
}

export async function downloadOrderInvoice(id, reference = "facture") {
  const response = await api.get(`/orders/${id}/invoice`, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = `${reference}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function reorder(orderId) {
  const response = await api.post(`/orders/${orderId}/reorder`);
  return response.data;
}