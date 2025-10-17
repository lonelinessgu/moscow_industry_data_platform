import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const logoutTimerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setAccessToken(null);
    setUser(null);
    clearTimeout(logoutTimerRef.current);
  }, []);

  const handleTokenChange = useCallback((token, userData) => {
    if (!token) {
      logout();
      return;
    }

    const decoded = decodeToken(token);
    const now = Date.now();
    const expiration = decoded?.exp ? decoded.exp * 1000 : null;

    if (!decoded?.exp || expiration < now) {
      logout();
      return;
    }

    localStorage.setItem("access_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));

    setUser(userData);
    setAccessToken(token);

    const expirationTime = expiration - now;
    clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, expirationTime);
  }, [logout]);

  const login = useCallback((token, userData) => {
    handleTokenChange(token, userData);
  }, [handleTokenChange]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("access_token");
    const userData = JSON.parse(localStorage.getItem("user_data"));

    if (!token || !userData) {
      setIsInitializing(false);
      return;
    }

    const decoded = decodeToken(token);
    const now = Date.now();
    const expiration = decoded?.exp ? decoded.exp * 1000 : null;

    if (!decoded?.exp || expiration < now) {
      logout();
      return;
    }

    setUser(userData);
    setAccessToken(token);

    const expirationTime = expiration - now;
    clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, expirationTime);

    setIsInitializing(false);
  }, [logout]);

  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === "access_token" || e.key === "user_data") {
        const token = localStorage.getItem("access_token");
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (!token || !userData) {
          setIsInitializing(true);
          checkAuth();
          return;
        }
        handleTokenChange(token, userData);
      }
    };

    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, [checkAuth, handleTokenChange]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo(() => ({
    accessToken,
    user,
    isAuthenticated: !!user,
    login,
    logout
  }), [accessToken, user, login, logout]);

  if (isInitializing) {
    return <div className="auth-loader">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};