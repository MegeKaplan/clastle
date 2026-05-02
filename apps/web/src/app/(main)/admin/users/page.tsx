"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyStateCard from "@/components/EmptyStateCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import StatusBadge, { type UserStatusValue } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import userService from "@/services/userService";

type UserSummary = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
  onboardingCompleted?: boolean;
};

const normalizeStatus = (value?: string) => value?.trim().toUpperCase();

const resolveUserStatus = (user: UserSummary) => {
  const normalized = normalizeStatus(user.status);
  if (normalized) {
    return normalized;
  }

  return user.onboardingCompleted ? "ACTIVE" : "PENDING";
};

const formatStatusValue = (value: string) => value.toUpperCase();

const UsersAdminPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const userCount = useMemo(() => users.length, [users]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await userService.getUsers();
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.users)
        ? res.data.users
        : Array.isArray(res.data)
        ? res.data
        : [];
      setUsers(data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Failed to load users";
      toast.error(message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Users"
        description="All registered users in the platform."
      />

      <Card>
        <CardContent className="pt-4">
          {loadingUsers ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="rounded-lg bg-muted/40">
                      <td className="px-3 py-3 font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-3 py-3">
                        {user.role ? <Badge variant="outline">{user.role}</Badge> : "-"}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge
                          status={formatStatusValue(resolveUserStatus(user)) as UserStatusValue}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStateCard
              title="No users available"
              description="When users register, they will appear here."
            />
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">Total users: {userCount}</div>
    </div>
  );
};

export default UsersAdminPage;
