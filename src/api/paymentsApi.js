import api from "./axios";

export async function createPaymentIntent(amountCents) {
  const response = await api.post("/payments/create-payment-intent", {
    amountCents,
  });

  return response.data;
}