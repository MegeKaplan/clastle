"use client";

import { useEffect, useState } from "react";
import { Megaphone, Newspaper } from "lucide-react";

import EmptyStateCard from "@/components/EmptyStateCard";
import RouteGuard from "@/components/RouteGuard";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import contentService, { Announcement, ClubPost } from "@/services/contentService";

const formatDate = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{announcement.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {formatDate(announcement.createdAt)}
          {announcement.authorName ? ` • ${announcement.authorName}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {announcement.body}
      </CardContent>
    </Card>
  );
};

const PostCard = ({ post }: { post: ClubPost }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{post.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {formatDate(post.createdAt)}
          {post.authorName ? ` • ${post.authorName}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {post.content}
      </CardContent>
    </Card>
  );
};

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const [nextAnnouncements, nextPosts] = await Promise.all([
        contentService.getAnnouncements(),
        contentService.getPosts(),
      ]);

      if (!mounted) {
        return;
      }

      setAnnouncements(nextAnnouncements);
      setPosts(nextPosts);
      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <RouteGuard requireAuth redirectTo="/">
      <div className="space-y-10">
        <section className="space-y-4">
          <SectionHeader
            title="Club Announcements"
            description="Latest updates from your club leaders and coordinators."
          />

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title="No announcements yet"
              description="When your club shares updates, they will appear here."
              icon={<Megaphone className="size-4" />}
            />
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Club Posts"
            description="Discussion posts and updates from club members."
          />

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title="No posts yet"
              description="Be the first to share something with your club."
              icon={<Newspaper className="size-4" />}
            />
          )}
        </section>
      </div>
    </RouteGuard>
  );
}
