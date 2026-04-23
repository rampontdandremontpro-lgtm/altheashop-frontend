import api from "./axios";
import { getStoredUser } from "./authApi";

const PAYMENT_METHODS_PREFIX = "althea_payment_methods_";

function getCurrentUserId() {
  const user = getStoredUser();

  if (!user?.id) {
    throw new Error("Utilisateur non connecté.");
  }

  return user.id;
}

function getPaymentStorageKey() {
  return `${PAYMENT_METHODS_PREFIX}${getCurrentUserId()}`;
}

function getPaymentMethodsStorage() {
  const raw = localStorage.getItem(getPaymentStorageKey());
  return raw ? JSON.parse(raw) : [];
}

function savePaymentMethodsStorage(methods) {
  localStorage.setItem(getPaymentStorageKey(), JSON.stringify(methods));
}

export async function getProfile() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
  });

  return response.data;
}

export async function deleteCurrentUserAccount() {
  throw new Error(
    "La suppression du compte n'est pas encore disponible côté backend."
  );
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
  });

  return response.data;
}

export async function deleteAddress(id) {
  const response = await api.delete(`/users/me/addresses/${id}`);
  return response.data;
}

/**
 * Les moyens de paiement restent locaux pour l'instant :
 * le backend ne propose pas encore de routes dédiées.
 */
export async function getPaymentMethods() {
  return getPaymentMethodsStorage();
}

export async function createPaymentMethod(payload) {
  const methods = getPaymentMethodsStorage();

  const digits = String(payload.cardNumber).replace(/\s+/g, "");
  const last4 = digits.slice(-4);

  const newMethod = {
    id: Date.now(),
    cardName: payload.cardName,
    last4,
    expiry: payload.expiry,
    brand: payload.brand || "cb",
    isDefault: Boolean(payload.isDefault),
  };

  let nextMethods = [...methods];

  if (newMethod.isDefault || nextMethods.length === 0) {
    nextMethods = nextMethods.map((method) => ({
      ...method,
      isDefault: false,
    }));
    newMethod.isDefault = true;
  }

  nextMethods.push(newMethod);
  savePaymentMethodsStorage(nextMethods);

  return newMethod;
}

export async function updatePaymentMethod(id, payload) {
  const methods = getPaymentMethodsStorage();

  const digits = String(payload.cardNumber).replace(/\s+/g, "");
  const last4 = digits.slice(-4);

  let nextMethods = methods.map((method) =>
    method.id === id
      ? {
          ...method,
          cardName: payload.cardName,
          last4,
          expiry: payload.expiry,
          brand: payload.brand || "cb",
          isDefault: Boolean(payload.isDefault),
        }
      : method
  );

  if (payload.isDefault) {
    nextMethods = nextMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }));
  }

  savePaymentMethodsStorage(nextMethods);

  return nextMethods.find((method) => method.id === id);
}

export async function deletePaymentMethod(id) {
  let nextMethods = getPaymentMethodsStorage().filter((method) => method.id !== id);

  if (nextMethods.length > 0 && !nextMethods.some((method) => method.isDefault)) {
    nextMethods[0].isDefault = true;
  }

  savePaymentMethodsStorage(nextMethods);
  return true;
}

export async function setDefaultPaymentMethod(id) {
  const nextMethods = getPaymentMethodsStorage().map((method) => ({
    ...method,
    isDefault: method.id === id,
  }));

  savePaymentMethodsStorage(nextMethods);
  return true;
}