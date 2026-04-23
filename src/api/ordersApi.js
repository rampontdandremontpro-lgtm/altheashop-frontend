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

export async function getOrders() {
  const session = getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté.");
  }

  const users = getUsers();
  const user = users.find((item) => item.id === session.id);

  return user?.orders || [];
}

export async function createOrder(orderPayload) {
  const session = getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté.");
  }

  const users = getUsers();

  const order = {
    id: Date.now(),
    reference: `ALT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Confirmée",
    ...orderPayload,
  };

  const updatedUsers = users.map((user) => {
    if (user.id !== session.id) return user;

    return {
      ...user,
      orders: [order, ...(user.orders || [])],
    };
  });

  saveUsers(updatedUsers);

  return order;
}