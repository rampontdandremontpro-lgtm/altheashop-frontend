const USERS_KEY = "althea_users";
const SESSION_KEY = "althea_session";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function requireSession() {
  const session = getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté.");
  }

  return session;
}

function findCurrentUser() {
  const session = requireSession();
  const users = getUsers();
  const user = users.find((item) => item.id === session.id);

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  return { session, users, user };
}

export async function getProfile() {
  const { user } = findCurrentUser();

  return {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "user",
    createdAt: user.createdAt || null,
  };
}

export async function updateProfile(payload) {
  const { session, users } = findCurrentUser();

  const normalizedEmail = String(payload.email || "").trim().toLowerCase();

  const emailAlreadyUsed = users.some(
    (user) => user.id !== session.id && user.email.toLowerCase() === normalizedEmail
  );

  if (emailAlreadyUsed) {
    throw new Error("Cet email est déjà utilisé par un autre compte.");
  }

  const updatedUsers = users.map((user) => {
    if (user.id !== session.id) return user;

    return {
      ...user,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: normalizedEmail,
      phone: payload.phone,
    };
  });

  saveUsers(updatedUsers);

  const updatedSession = {
    ...session,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: normalizedEmail,
    phone: payload.phone,
  };

  saveSession(updatedSession);

  return updatedSession;
}

export async function deleteCurrentUserAccount() {
  const { session, users } = findCurrentUser();

  const updatedUsers = users.filter((user) => user.id !== session.id);
  saveUsers(updatedUsers);
  clearSession();

  return true;
}

export async function getAddresses() {
  const { user } = findCurrentUser();
  return user.addresses || [];
}

export async function createAddress(payload) {
  const { session, users, user } = findCurrentUser();

  const newAddress = {
    id: Date.now(),
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
  };

  let nextAddresses = [...(user.addresses || [])];

  if (newAddress.isDefault || nextAddresses.length === 0) {
    nextAddresses = nextAddresses.map((address) => ({
      ...address,
      isDefault: false,
    }));
    newAddress.isDefault = true;
  }

  nextAddresses.push(newAddress);

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, addresses: nextAddresses } : item
  );

  saveUsers(updatedUsers);
  return newAddress;
}

export async function updateAddress(id, payload) {
  const { session, users, user } = findCurrentUser();

  let nextAddresses = (user.addresses || []).map((address) =>
    address.id === id
      ? {
          ...address,
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
        }
      : address
  );

  if (payload.isDefault) {
    nextAddresses = nextAddresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));
  }

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, addresses: nextAddresses } : item
  );

  saveUsers(updatedUsers);

  return nextAddresses.find((address) => address.id === id);
}

export async function deleteAddress(id) {
  const { session, users, user } = findCurrentUser();

  let nextAddresses = (user.addresses || []).filter((address) => address.id !== id);

  if (nextAddresses.length > 0 && !nextAddresses.some((address) => address.isDefault)) {
    nextAddresses[0].isDefault = true;
  }

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, addresses: nextAddresses } : item
  );

  saveUsers(updatedUsers);
  return true;
}

export async function getPaymentMethods() {
  const { user } = findCurrentUser();
  return user.paymentMethods || [];
}

export async function createPaymentMethod(payload) {
  const { session, users, user } = findCurrentUser();

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

  let nextMethods = [...(user.paymentMethods || [])];

  if (newMethod.isDefault || nextMethods.length === 0) {
    nextMethods = nextMethods.map((method) => ({
      ...method,
      isDefault: false,
    }));
    newMethod.isDefault = true;
  }

  nextMethods.push(newMethod);

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, paymentMethods: nextMethods } : item
  );

  saveUsers(updatedUsers);
  return newMethod;
}

export async function updatePaymentMethod(id, payload) {
  const { session, users, user } = findCurrentUser();

  const digits = String(payload.cardNumber).replace(/\s+/g, "");
  const last4 = digits.slice(-4);

  let nextMethods = (user.paymentMethods || []).map((method) =>
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

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, paymentMethods: nextMethods } : item
  );

  saveUsers(updatedUsers);

  return nextMethods.find((method) => method.id === id);
}

export async function deletePaymentMethod(id) {
  const { session, users, user } = findCurrentUser();

  let nextMethods = (user.paymentMethods || []).filter((method) => method.id !== id);

  if (nextMethods.length > 0 && !nextMethods.some((method) => method.isDefault)) {
    nextMethods[0].isDefault = true;
  }

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, paymentMethods: nextMethods } : item
  );

  saveUsers(updatedUsers);
  return true;
}

export async function setDefaultPaymentMethod(id) {
  const { session, users, user } = findCurrentUser();

  const nextMethods = (user.paymentMethods || []).map((method) => ({
    ...method,
    isDefault: method.id === id,
  }));

  const updatedUsers = users.map((item) =>
    item.id === session.id ? { ...item, paymentMethods: nextMethods } : item
  );

  saveUsers(updatedUsers);
  return true;
}