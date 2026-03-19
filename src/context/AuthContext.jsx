import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (payload) => {
    const loggedUser = await loginApi(payload);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (payload) => {
    const newUser = await registerApi(payload);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const updatedUser = await updateProfileApi(payload);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      authLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}