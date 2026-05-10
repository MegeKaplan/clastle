"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contentService from "@/services/contentService";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const { id } = use(params as any);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
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
      setIsLoading(false);
    };
    void load();
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      toast.error("Content body is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await contentService.updateContent(id, { title, body: content });
      toast.success("Post updated");
      router.push("/profile");
    } catch (err: any) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Failed to update";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit post</CardTitle>
        <CardDescription>Update the post content.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-6 w-48 animate-pulse bg-muted" />
            <div className="h-32 w-full animate-pulse bg-muted" />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update post"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
