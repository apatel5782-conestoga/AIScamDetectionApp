import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthUser } from "../models/AuthUser";
import { getMyProfile, loginUser, registerUser, requestPasswordReset, updateMyProfile } from "../services/authService";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: Partial<Pick<AuthUser, "name" | "email" | "phone" | "username">>) => Promise<void>;
  loginAsDemo: (role: "user" | "admin") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const login = useCallback(async (identifier: string, password: string) => {
    const { token: newToken, user: newUser } = await loginUser({ identifier, password });
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    localStorage.setItem("auth_token", newToken);
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; phone: string; password: string }) => {
    const { token: newToken, user: newUser } = await registerUser(payload);
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    localStorage.setItem("auth_token", newToken);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const response = await requestPasswordReset(email);
    return response.message;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await getMyProfile(token);
    setUser(profile);
    localStorage.setItem("auth_user", JSON.stringify(profile));
  }, [token]);

  const updateProfile = useCallback(async (payload: Partial<Pick<AuthUser, "name" | "email" | "phone" | "username">>) => {
    if (!token) return;
    const profile = await updateMyProfile(token, payload);
    setUser(profile);
    localStorage.setItem("auth_user", JSON.stringify(profile));
  }, [token]);

  const loginAsDemo = (role: "user" | "admin") => {
    const demoUser: AuthUser = {
      id: crypto.randomUUID(),
      name: role === "admin" ? "Admin Analyst" : "Fraud Analyst",
      username: role === "admin" ? "admin_analyst" : "fraud_analyst",
      email: role === "admin" ? "admin@fraud-intel.local" : "user@fraud-intel.local",
      phone: "(555) 010-2040",
      role,
    };

    const demoToken = `demo-jwt-${crypto.randomUUID()}`;
    setUser(demoUser);
    setToken(demoToken);
    localStorage.setItem("auth_user", JSON.stringify(demoUser));
    localStorage.setItem("auth_token", demoToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      forgotPassword,
      refreshProfile,
      updateProfile,
      loginAsDemo,
      logout,
    }),
    [user, token, login, register, forgotPassword, refreshProfile, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
