"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import authService from "@/services/authService";
import userService from "@/services/userService";

export type AuthUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
  status?: string;
  clubs?: any[];
  memberships?: any[];
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
      const storedUser = window.localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const res = await authService.getMe();
      let fetchedUser = res.data?.user ?? null;

      // Fallback to fetch clubs info
      if (fetchedUser) {
        try {
          const usersRes = await userService.getUsers();
          const usersData = Array.isArray(usersRes.data?.data)
            ? usersRes.data.data
            : Array.isArray(usersRes.data?.users)
            ? usersRes.data.users
            : Array.isArray(usersRes.data)
            ? usersRes.data
            : [];
            
          const fullUser = usersData.find((u: any) => u.id === fetchedUser.id);
          
          if (fullUser) {
            // Robust mapping if backend didn't map it already
            const clubs = fullUser.clubs || fullUser.memberships?.map((m: any) => m.club) || [];
            
            fetchedUser = { 
              ...fetchedUser, 
              ...fullUser,
              clubs
            };
          }
        } catch (error) {
          console.error("Failed to fetch full user info", error);
        }
      }

      setUser(fetchedUser);
      if (fetchedUser) {
        window.localStorage.setItem("user", JSON.stringify(fetchedUser));
      } else {
        window.localStorage.removeItem("user");
      }
    } catch {
      setUser(null);
      window.localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    authService.logout();
    window.localStorage.removeItem("user");
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
