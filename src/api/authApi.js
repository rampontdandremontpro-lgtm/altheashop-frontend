import api from "./axios";

const TOKEN_KEY = "althea_token";
const USER_KEY = "althea_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function register(payload) {
  const response = await api.post("/auth/register", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
  });

  const { accessToken, user } = response.data;

  setToken(accessToken);
  saveUser(user);

  return user;
}

export async function login(payload) {
  const response = await api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  const { accessToken, user } = response.data;

  setToken(accessToken);
  saveUser(user);

  return user;
}

export async function logout() {
  clearToken();
  clearUser();
  return true;
}

export async function getMe() {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await api.get("/auth/me");
  const user = response.data;

  saveUser(user);
  return user;
}

export async function forgotPassword(email) {
  return {
    message:
      "La réinitialisation du mot de passe n'est pas encore disponible côté backend.",
  };
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
  });

  const user = response.data;
  saveUser(user);

  return user;
}