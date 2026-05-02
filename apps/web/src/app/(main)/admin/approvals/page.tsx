"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyStateCard from "@/components/EmptyStateCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import StatusBadge, { type UserStatusValue } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
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

const ApprovalsAdminPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const pendingUsers = useMemo(
    () => users.filter((user) => resolveUserStatus(user) === "PENDING"),
    [users]
  );

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

  const handleApprove = async (userId: string) => {
    setActionUserId(userId);
    try {
      await userService.approveUser(userId);
      toast.success("User approved successfully");
      await loadUsers();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Failed to approve user";
      toast.error(message);
    } finally {
      setActionUserId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionUserId(userId);
    try {
      await userService.rejectUser(userId);
      toast.success("User rejected successfully");
      await loadUsers();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Failed to reject user";
      toast.error(message);
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Approvals"
        description="Approve or reject pending accounts."
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
          ) : pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-separate border-spacing-y-2 text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="rounded-lg bg-muted/40">
                      <td className="px-3 py-3 font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-3 py-3">
                        {user.role ? <Badge variant="outline">{user.role}</Badge> : "-"}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={formatStatusValue("PENDING") as UserStatusValue} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleApprove(user.id)}
                            disabled={actionUserId === user.id}
                            className="h-10"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(user.id)}
                            disabled={actionUserId === user.id}
                            className="h-10"
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStateCard
              title="No pending users"
              description="All pending users have been reviewed."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalsAdminPage;
