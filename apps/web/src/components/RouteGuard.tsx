"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

const isAdmin = (role?: string) => role === "ADMIN" || role === "SUPERADMIN";

type RouteGuardProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
};

const RouteGuard = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback,
  redirectTo = "/login",
}: RouteGuardProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (requireAuth && !user) {
      router.replace(redirectTo);
      return;
    }

    if (requireAdmin && !isAdmin(user?.role)) {
      router.replace("/home");
      return;
    }

    if (!user?.onboardingCompleted && !isAdmin(user?.role) && requireAuth) {
      router.replace("/onboarding");
    }
  }, [loading, redirectTo, requireAuth, requireAdmin, router, user]);

  if (loading) {
    return (
      fallback || (
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireAdmin && !isAdmin(user?.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
