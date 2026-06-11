import api from "./axios";

const TOKEN_KEY = "althea_token";
const USER_KEY = "althea_user";

function getStorage(rememberMe = true) {
  return rememberMe ? localStorage : sessionStorage;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, rememberMe = true) {
  const storage = getStorage(rememberMe);
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  storage.setItem(TOKEN_KEY, token);
  otherStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

function saveUser(user, rememberMe = true) {
  const storage = getStorage(rememberMe);
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  storage.setItem(USER_KEY, JSON.stringify(user));
  otherStorage.removeItem(USER_KEY);
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveAuthResponse(data, rememberMe = true) {
  const token = data.accessToken || data.token;

  if (token) {
    setToken(token, rememberMe);
  }

  if (data.user) {
    saveUser(data.user, rememberMe);
  }

  return data.user;
}

export async function register(payload) {
  const response = await api.post("/auth/register", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });

  return response.data;
}

export async function login(payload) {
  const response = await api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
    rememberMe: Boolean(payload.rememberMe),
  });

  if (response.data?.requiresTwoFactor) {
    return {
      requiresTwoFactor: true,
      email: response.data.email,
      message: response.data.message,
      rememberMe: Boolean(payload.rememberMe),
    };
  }

  const user = saveAuthResponse(response.data, Boolean(payload.rememberMe));

  return {
    requiresTwoFactor: false,
    user,
  };
}

export async function verifyTwoFactor(payload) {
  const response = await api.post("/auth/verify-2fa", {
    email: payload.email,
    code: payload.code,
  });

  const user = saveAuthResponse(response.data, Boolean(payload.rememberMe));

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
  const user = response.data.user || response.data;

  const rememberMe = Boolean(localStorage.getItem(TOKEN_KEY));
  saveUser(user, rememberMe);

  return user;
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(payload) {
  const response = await api.post("/auth/reset-password", {
    token: payload.token,
    password: payload.password,
  });

  return response.data;
}

export async function verifyEmail(token) {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    currentPassword: payload.currentPassword || undefined,
  });

  const user = response.data.user || response.data;
  const rememberMe = Boolean(localStorage.getItem(TOKEN_KEY));

  saveUser(user, rememberMe);

  return user;
}