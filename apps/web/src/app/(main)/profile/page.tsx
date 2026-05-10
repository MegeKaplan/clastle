"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Mail,
  Megaphone,
  Newspaper,
  Edit,
  PencilLine,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/AuthProvider";
import EmptyStateCard from "@/components/EmptyStateCard";
import RouteGuard from "@/components/RouteGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge, { type UserStatusValue } from "@/components/StatusBadge";
import userService from "@/services/userService";
import contentService, { type Announcement, type ClubPost } from "@/services/contentService";

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

const getFullName = (firstName?: string, lastName?: string) => {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Your profile";
};

const getInitials = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.trim().charAt(0) ?? "";
  const lastInitial = lastName?.trim().charAt(0) ?? "";
  return `${firstInitial}${lastInitial}`.trim() || "U";
};

const ContentCard = ({
  item,
  badgeLabel,
  icon,
  currentUserId,
}: {
  item: Announcement | ClubPost;
  badgeLabel: string;
  icon: React.ReactNode;
  currentUserId?: string;
}) => {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
      onClick={() => router.push(`/${badgeLabel.toLowerCase()}/${item.id}`)}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                {icon}
              </span>
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <CardTitle className="text-base font-semibold leading-tight">
              {item.title || "Untitled content"}
            </CardTitle>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0">
              {badgeLabel}
            </Badge>
            {currentUserId && (item as any).authorId === currentUserId ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/edit/${badgeLabel.toLowerCase()}/${item.id}`);
                }}
              >
                <Edit className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {item.body}
        </p>
      </CardContent>
    </Card>
  );
};

const SummaryStat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<ClubPost[]>([]);
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

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      if (!user?.id) {
        setAnnouncements([]);
        setPosts([]);
        setContentLoading(false);
        return;
      }

      setContentLoading(true);
      const [nextAnnouncements, nextPosts] = await Promise.all([
        contentService.getAnnouncementsByAuthor(user.id),
        contentService.getPostsByAuthor(user.id),
      ]);

      if (!mounted) {
        return;
      }

      setAnnouncements(nextAnnouncements);
      setPosts(nextPosts);
      setContentLoading(false);
    };

    void loadContent();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      await userService.updateUser(user.id, formData);
      await refresh();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (error as { message?: string })?.message || "Failed to update profile";
      toast.error(message);
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

  const fullName = useMemo(() => getFullName(user?.firstName, user?.lastName), [user?.firstName, user?.lastName]);
  const initials = useMemo(() => getInitials(user?.firstName, user?.lastName), [user?.firstName, user?.lastName]);
  const activeClubName = user?.clubs?.[0]?.name ?? "No active club";
  const clubCount = user?.clubs?.length ?? 0;

  return (
    <RouteGuard requireAuth>
      <div className="space-y-6">
        <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,rgba(15,23,42,1)_0%,rgba(30,41,59,1)_45%,rgba(51,65,85,1)_100%)] text-white shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-2xl font-semibold text-white shadow-lg backdrop-blur">
                  {initials}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Badge className="w-fit border-white/10 bg-white/10 text-white hover:bg-white/15">
                      {user?.role || "Member"}
                    </Badge>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{fullName}</h1>
                      <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                        Track your account details, club membership, and everything you have published from one place.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <Mail className="size-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <CalendarDays className="size-4" />
                      <span>Member since {formatDate(user?.createdAt)}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <BadgeCheck className="size-4" />
                      <StatusBadge status={statusLabel as UserStatusValue} />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="h-11 bg-white text-slate-950 hover:bg-slate-100"
                onClick={() => setIsEditing((current) => !current)}
              >
                <PencilLine className="mr-2 size-4" />
                {isEditing ? "Close editor" : "Edit profile"}
              </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <SummaryStat label="Published posts" value={String(posts.length)} icon={<Newspaper className="size-4" />} />
              <SummaryStat label="Announcements" value={String(announcements.length)} icon={<Megaphone className="size-4" />} />
              <SummaryStat label="Club memberships" value={String(clubCount)} icon={<Users className="size-4" />} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>Account details</CardTitle>
                  <CardDescription>Update your name and email address.</CardDescription>
                </div>
                {!loading && !isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-60" />
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : isEditing ? (
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={formData.firstName}
                          onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={formData.lastName}
                          onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={formData.email}
                        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</div>
                      <div className="mt-2 text-sm font-medium text-foreground">{fullName}</div>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</div>
                      <div className="mt-2 text-sm font-medium text-foreground">{user?.email}</div>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active club</div>
                      <div className="mt-2 text-sm font-medium text-foreground">{activeClubName}</div>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</div>
                      <div className="mt-2">
                        <StatusBadge status={statusLabel as UserStatusValue} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing ? (
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              ) : null}
            </Card>

            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Your announcements</h2>
                  <p className="text-sm text-muted-foreground">Announcements you published in your clubs.</p>
                </div>
                <Badge variant="outline" className="w-fit">
                  {announcements.length}
                </Badge>
              </div>

              {contentLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-36 w-full" />
                </div>
              ) : announcements.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {announcements.map((announcement) => (
                    <ContentCard
                      key={announcement.id}
                      item={announcement}
                      badgeLabel="Announcement"
                      icon={<Megaphone className="size-4" />}
                    />
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  title="No announcements yet"
                  description="When you publish an announcement, it will appear here."
                  icon={<Megaphone className="size-4" />}
                />
              )}
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Your posts</h2>
                  <p className="text-sm text-muted-foreground">Posts you shared with your club.</p>
                </div>
                <Badge variant="outline" className="w-fit">
                  {posts.length}
                </Badge>
              </div>

              {contentLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : posts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {posts.map((post) => (
                    <ContentCard
                      key={post.id}
                      item={post}
                      badgeLabel="Post"
                      icon={<Newspaper className="size-4" />}
                    />
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  title="No posts yet"
                  description="Start a discussion and your posts will show up here."
                  icon={<Newspaper className="size-4" />}
                />
              )}
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Shortcuts for common tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
                  <Button className="h-11 w-full" onClick={() => router.push("/admin/users")}>
                    <ArrowUpRight className="mr-2 size-4" />
                    Admin dashboard
                  </Button>
                ) : null}
                <Button variant="outline" className="h-11 w-full" onClick={() => router.push("/new")}>
                  <Sparkles className="mr-2 size-4" />
                  Create new content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership snapshot</CardTitle>
                <CardDescription>What your account is tied to right now.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Primary club</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{activeClubName}</div>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Joined clubs</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{clubCount} club{clubCount === 1 ? "" : "s"}</div>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account status</div>
                  <div className="mt-2">
                    <StatusBadge status={statusLabel as UserStatusValue} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default ProfilePage;