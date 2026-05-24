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