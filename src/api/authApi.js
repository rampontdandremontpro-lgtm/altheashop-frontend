const USERS_KEY = "althea_users";
const SESSION_KEY = "althea_session";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function removeSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function register(payload) {
  const users = getUsers();

  const existing = users.find(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (existing) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const newUser = {
    id: Date.now(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || "",
    role: payload.role || "user",
    createdAt: new Date().toISOString(),
    orders: [],
    addresses: [],
  };

  users.push(newUser);
  saveUsers(users);

  const sessionUser = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
  };

  saveSession(sessionUser);

  return sessionUser;
}

export async function login(payload) {
  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === payload.email.toLowerCase() &&
      item.password === payload.password
  );

  if (!user) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const sessionUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    role: user.role || "user",
  };

  saveSession(sessionUser);

  return sessionUser;
}

export async function logout() {
  removeSession();
  return true;
}

export async function getMe() {
  return getSession();
}

export async function forgotPassword(email) {
  const users = getUsers();

  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    throw new Error("Aucun compte trouvé avec cet email.");
  }

  return {
    message:
      "Demande prise en compte. Quand le backend sera prêt, un email pourra être envoyé.",
  };
}

export async function updateProfile(payload) {
  const users = getUsers();
  const session = getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté.");
  }

  const updatedUsers = users.map((user) => {
    if (user.id !== session.id) return user;

    return {
      ...user,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    };
  });

  saveUsers(updatedUsers);

  const updatedSession = {
    ...session,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
  };

  saveSession(updatedSession);

  return updatedSession;
}