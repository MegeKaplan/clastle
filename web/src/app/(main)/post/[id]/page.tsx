"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import contentService from "@/services/contentService";
import { useAuth } from "@/components/AuthProvider";

export default function PostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { user } = useAuth();

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const data = await contentService.getContent<any>(id);

        if (!mounted) return;

        if (!data) {
          router.push("/home");
          return;
        }

        setPost(data);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      void load();
    }

    return () => {
      mounted = false;
    };
  }, [id, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            post?.title
          )}
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground">
          {loading
            ? null
            : new Date(post.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="prose max-w-none">
            <p>{post.body}</p>

            <div className="mt-6 flex gap-2">
              {user?.id === post.authorId ? (
                <Button
                  onClick={() =>
                    router.push(`/edit/post/${post.id}`)
                  }
                >
                  Edit post
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}