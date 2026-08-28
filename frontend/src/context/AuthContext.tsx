import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import type { UserSummary } from "../types";

interface AuthContextValue {
  user: UserSummary | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_STORAGE_KEY = "petmarket_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    });

    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    setAuthToken(stored);
    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const applyAuth = (token: string, expiresAt: string, userSummary: UserSummary) => {
    void expiresAt;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);
    setUser(userSummary);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    applyAuth(res.token, res.expiresAt, res.user);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const res = await authApi.register(email, password, displayName);
    applyAuth(res.token, res.expiresAt, res.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
