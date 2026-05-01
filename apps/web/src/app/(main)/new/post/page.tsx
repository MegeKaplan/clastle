"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const clubOptions = [{ value: "club-1", label: "Main Club" }];

const NewPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [club, setClub] = useState(clubOptions[0]?.value ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("Post publishing will be connected to the API soon.");
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
              value={club}
              onChange={(event) => setClub(event.target.value)}
              disabled
            >
              {clubOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Single club mode is enabled.</p>
          </div>
          <Button type="submit" className="w-full h-11">
            Publish Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPostPage;
