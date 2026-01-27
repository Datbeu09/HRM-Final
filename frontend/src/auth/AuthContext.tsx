// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Role } from "./roles";
import { login as apiLogin } from "../api/auth.api"; // ✅ dùng lại auth api

export interface User {
  id: number;
  username: string;
  role: Role;
  employeeId: number;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadAuthFromStorage(): { user: User | null; token: string | null } {
  try {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (!savedUser || !savedToken) return { user: null, token: null };
    return { user: JSON.parse(savedUser) as User, token: savedToken };
  } catch {
    return { user: null, token: null };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initial = loadAuthFromStorage();
  const [user, setUser] = useState<User | null>(initial.user);
  const [initialized] = useState(true);

  const login = async (username: string, password: string) => {
    // ✅ auth.api.js đã normalize và trả { token, user }
    const res = await apiLogin(username, password);

    if (!res?.token) throw new Error("Không nhận được token từ API");
    if (!res?.user) throw new Error("Không nhận được user từ API");

    const rawUser = res.user;

    const normalizedUser: User = {
      id: Number(rawUser.id),
      username: String(rawUser.username),
      role: rawUser.role as Role,
      employeeId: Number(rawUser.employeeId),
      permissions: Array.isArray(rawUser.permissions) ? rawUser.permissions : [],
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", res.token);

    setUser(normalizedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialized,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
