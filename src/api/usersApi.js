import api from "./axios";

export async function getProfile() {
  const response = await api.get("/users/me");
  return response.data.user || response.data;
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    currentPassword: payload.currentPassword || undefined,
  });

  return response.data.user || response.data;
}

export async function changePassword(payload) {
  const response = await api.patch("/users/me/password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });

  return response.data;
}

export async function deleteCurrentUserAccount() {
  const response = await api.delete("/users/me");
  return response.data;
}

export async function getAddresses() {
  const response = await api.get("/users/me/addresses");
  return response.data;
}

export async function createAddress(payload) {
  const response = await api.post("/users/me/addresses", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2 || "",
    city: payload.city,
    region: payload.region || "",
    postalCode: payload.postalCode,
    country: payload.country,
    phone: payload.phone || "",
    isDefault: Boolean(payload.isDefault),
  });

  return response.data;
}

export async function updateAddress(id, payload) {
  const response = await api.patch(`/users/me/addresses/${id}`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2 || "",
    city: payload.city,
    region: payload.region || "",
    postalCode: payload.postalCode,
    country: payload.country,
    phone: payload.phone || "",
    isDefault: Boolean(payload.isDefault),
  });

  return response.data;
}

export async function deleteAddress(id) {
  const response = await api.delete(`/users/me/addresses/${id}`);
  return response.data;
}

function formatPaymentMethod(method) {
  if (!method) return null;

  const expiryMonth = String(method.expiryMonth || "").padStart(2, "0");
  const expiryYear = String(method.expiryYear || "").slice(-2);

  return {
    id: method.id,
    cardName: method.cardName || method.cardholderName || "",
    cardholderName: method.cardholderName || method.cardName || "",
    last4: method.last4 || "",
    expiry: method.expiry || `${expiryMonth}/${expiryYear}`,
    expiryMonth: method.expiryMonth,
    expiryYear: method.expiryYear,
    brand: method.brand || "cb",
    isDefault: Boolean(method.isDefault),
  };
}

function parseExpiry(expiry) {
  const [month, year] = String(expiry || "").split("/");

  return {
    expiryMonth: Number(month),
    expiryYear: Number(`20${year}`),
  };
}

export async function getPaymentMethods() {
  const response = await api.get("/users/me/payment-methods");

  return Array.isArray(response.data)
    ? response.data.map(formatPaymentMethod).filter(Boolean)
    : [];
}

export async function createPaymentMethod(payload) {
  const response = await api.post("/users/me/payment-methods", {
    cardName: payload.cardName,
    cardNumber: String(payload.cardNumber || "").replace(/\s+/g, ""),
    expiry: payload.expiry,
    brand: payload.brand || "cb",
    isDefault: Boolean(payload.isDefault),
  });

  return formatPaymentMethod(response.data);
}

export async function updatePaymentMethod(id, payload) {
  const response = await api.patch(`/users/me/payment-methods/${id}`, {
    cardName: payload.cardName,
    expiry: payload.expiry,
    brand: payload.brand || "cb",
    isDefault: Boolean(payload.isDefault),
  });

  return formatPaymentMethod(response.data);
}

export async function deletePaymentMethod(id) {
  const response = await api.delete(`/users/me/payment-methods/${id}`);
  return response.data;
}

export async function setDefaultPaymentMethod(id) {
  const response = await api.patch(`/users/me/payment-methods/${id}/default`);
  return formatPaymentMethod(response.data);
}