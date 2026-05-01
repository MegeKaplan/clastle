"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import authService from "@/services/authService";

export type AuthUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  status?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const hasAccessToken = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem("accessToken"));
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!hasAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.getMe();
      setUser(res.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, signOut }),
    [user, loading, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
