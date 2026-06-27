"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { loadProfileFromServer } from "~/lib/stores/profile";
import { SESSION_DURATION_DAYS } from "~/lib/auth";

const SESSION_KEY = "session_token";

interface User {
  id: string;
  email: string;
  displayName?: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function setSessionCookie(token: string) {
  const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `session=${token}; Path=/; SameSite=Lax${secure}; Max-Age=${maxAge}`;
  localStorage.setItem(SESSION_KEY, token);
}

function clearSessionCookie() {
  document.cookie = "session=; Path=/; SameSite=Lax; Max-Age=0";
  localStorage.removeItem(SESSION_KEY);
}

function restoreSessionFromStorage() {
  const token = localStorage.getItem(SESSION_KEY);
  if (token) {
    const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `session=${token}; Path=/; SameSite=Lax${secure}; Max-Age=${maxAge}`;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      restoreSessionFromStorage();
      const token = localStorage.getItem(SESSION_KEY);
      const headers: Record<string, string> = {};
      if (token) headers["x-session-token"] = token;
      const res = await fetch("/api/auth/me", { headers });
      const data = (await res.json()) as { user?: { id: string; email: string; displayName?: string | null } };
      setUser(data.user ?? null);
      if (data.user) {
        loadProfileFromServer();
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { user?: any; token?: string; error?: string };
      if (!res.ok) return { error: data.error ?? "Login failed" };
      if (data.token) setSessionCookie(data.token);
      setUser(data.user);
      syncStorageFromServer();
      loadProfileFromServer();
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { user?: any; token?: string; error?: string };
      if (!res.ok) return { error: data.error ?? "Registration failed" };
      if (data.token) setSessionCookie(data.token);
      setUser(data.user);
      syncStorageFromServer();
      loadProfileFromServer();
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    clearSessionCookie();
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, loading, login, register, logout, refresh };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

async function syncStorageFromServer() {
  try {
    const token = localStorage.getItem(SESSION_KEY);
    const headers: Record<string, string> = {};
    if (token) headers["x-session-token"] = token;
    const res = await fetch("/api/sync", { headers });
    if (!res.ok) return;
    const data = (await res.json()) as Record<string, any>;
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("__")) continue;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}
