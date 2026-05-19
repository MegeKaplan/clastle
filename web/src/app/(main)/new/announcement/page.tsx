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

const NewAnnouncementPage = () => {
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
      toast.error("You must be part of a club to post an announcement.");
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
        type: "ANNOUNCEMENT",
        authorId: user.id,
        clubId: activeClub.id,
      });
      toast.success("Announcement published successfully!");
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
        <CardTitle>Create an announcement</CardTitle>
        <CardDescription>Share an important announcement with your club.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Title</Label>
            <Input
              id="announcement-title"
              placeholder="Announcement title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement-content">Content</Label>
            <Textarea
              id="announcement-content"
              placeholder="Write the details of your announcement"
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
            {isSubmitting ? "Publishing..." : "Publish Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewAnnouncementPage;
