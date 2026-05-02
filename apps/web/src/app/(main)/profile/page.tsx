"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import RouteGuard from "@/components/RouteGuard";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import StatusBadge, { type UserStatusValue } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ProfilePage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const statusLabel = useMemo(() => {
    if (user?.status) {
      return user.status.trim().toUpperCase();
    }

    return user?.onboardingCompleted ? "ACTIVE" : "PENDING";
  }, [user]);

  return (
    <RouteGuard requireAuth>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details and membership status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-base font-semibold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </div>
                  {user?.role ? <Badge variant="outline">{user.role}</Badge> : null}
                  <StatusBadge status={statusLabel as UserStatusValue} />
                </div>
                <div className="text-muted-foreground">Email: {user?.email}</div>
                <div className="text-muted-foreground">Member since: {formatDate(user?.createdAt)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Shortcuts for common actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
                <Button className="w-full" onClick={() => router.push("/admin/users")}>
                Admin Dashboard
              </Button>
            ) : null}
            <Button variant="outline" className="w-full" onClick={() => router.push("/new")}
            >
              Create new content
            </Button>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
};

export default ProfilePage;