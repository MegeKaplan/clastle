"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import RouteGuard from "@/components/RouteGuard";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import StatusBadge, { type UserStatusValue } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import userService from "@/services/userService";
import { toast } from "sonner";

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
  const { user, loading, refresh } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      await userService.updateUser(user.id, formData);
      await refresh();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account details and membership status.</CardDescription>
            </div>
            {!loading && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
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
              <div className="space-y-4 text-sm">
                {isEditing ? (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-base font-semibold text-foreground">
                        {user?.firstName} {user?.lastName}
                      </div>
                      {user?.role ? <Badge variant="outline">{user.role}</Badge> : null}
                      <StatusBadge status={statusLabel as UserStatusValue} />
                    </div>
                    <div className="text-muted-foreground">Email: {user?.email}</div>
                    {user?.clubs?.[0]?.name && (
                      <div className="text-muted-foreground">Active Club: <span className="font-medium text-foreground">{user.clubs[0].name}</span></div>
                    )}
                    <div className="text-muted-foreground">Member since: {formatDate(user?.createdAt)}</div>
                  </>
                )}
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Shortcuts for common actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
                <Button className="w-full h-11" onClick={() => router.push("/admin/users")}>
                Admin Dashboard
              </Button>
            ) : null}
            <Button variant="outline" className="w-full h-11" onClick={() => router.push("/new")}
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