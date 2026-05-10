"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import contentService from "@/services/contentService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/AuthProvider";

export default function AnnouncementPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const { id } = use(params as any);
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await contentService.getContent<any>(id);
      if (!mounted) return;
      if (!data) {
        router.push("/home");
        return;
      }
      setAnnouncement(data);
      setLoading(false);
    };
    void load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{loading ? <Skeleton className="h-6 w-48" /> : announcement?.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{loading ? null : new Date(announcement.createdAt).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="prose max-w-none">
            <p>{announcement.body}</p>
            <div className="mt-6 flex gap-2">
              {user?.id === announcement.authorId ? (
                <Button onClick={() => router.push(`/edit/announcement/${announcement.id}`)}>Edit announcement</Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
