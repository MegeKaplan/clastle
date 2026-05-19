"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contentService from "@/services/contentService";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsLoading(true);

        const data = await contentService.getContent<any>(id);

        if (!mounted) return;

        if (!data) {
          toast.error("Content not found");
          router.push("/profile");
          return;
        }

        setTitle(data.title ?? "");
        setContent(data.body ?? "");
      } finally {
        if (mounted) {
          setIsLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      toast.error("Content body is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await contentService.updateContent(id, {
        title,
        body: content,
      });

      toast.success("Announcement updated");

      router.push("/profile");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit announcement</CardTitle>

        <CardDescription>
          Update the announcement content.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-6 w-48 animate-pulse bg-muted" />
            <div className="h-32 w-full animate-pulse bg-muted" />
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="announcement-title">
                Title
              </Label>

              <Input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-content">
                Content
              </Label>

              <Textarea
                id="announcement-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Updating..."
                : "Update announcement"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}