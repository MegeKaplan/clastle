"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import contentService from "@/services/contentService";

const NewPostPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeClub = user?.clubs?.[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!title || !content) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!activeClub?.id) {
      toast.error("You must be part of a club to post.");
      return;
    }

    if (!user?.id) {
      toast.error("User not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contentService.createContent({
        title,
        body: content,
        type: "POST",
        authorId: user.id,
        clubId: activeClub.id,
      });
      toast.success("Post published successfully!");
      router.push("/home");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
        <CardDescription>Share an update with your club.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="Share your update"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Write something helpful for your club"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="club-select">Club</Label>
            <Select
              id="club-select"
              value={activeClub?.id ?? ""}
              disabled
            >
              <option value={activeClub?.id ?? ""}>
                {activeClub?.name ?? "No active club"}
              </option>
            </Select>
            <p className="text-xs text-muted-foreground">You are posting as a member of this club.</p>
          </div>
          <Button type="submit" className="w-full h-11" disabled={isSubmitting || !activeClub}>
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPostPage;
