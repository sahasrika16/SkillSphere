import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { socket } from "../services/socket";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const saveSession = (token, userData) => {
  localStorage.setItem("skillsphere_token", token);
  localStorage.setItem("skillsphere_user", JSON.stringify(userData));
  setUser(userData);

  socket.auth = {
    userId: userData._id || userData.id,
  };

  socket.connect();
};

  const clearSession = () => {
  socket.disconnect();

  localStorage.removeItem("skillsphere_token");
  localStorage.removeItem("skillsphere_user");

  setUser(null);
};

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveSession(data.token, data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    saveSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    clearSession();
  };

  const fetchMe = async () => {
    const token = localStorage.getItem("skillsphere_token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      localStorage.setItem("skillsphere_user", JSON.stringify(data.user));
    } catch {
      clearSession();
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};