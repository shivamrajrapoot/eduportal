// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/refresh");
        const newToken = res.data.data.accessToken;
        setAccessToken(newToken);
        window.__accessToken__ = newToken;

        // AuthContext.jsx mein yeh line update karo
        const userRes = await axiosInstance.get("/user/profile");
        setUser({
          userId: userRes.data.data.user._id,
          name: userRes.data.data.user.name,
          email: userRes.data.data.user.email,
          mobile: userRes.data.data.user.mobile,
          role: userRes.data.data.user.role,
        });
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    window.__accessToken__ = token;
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    window.__accessToken__ = null;
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
