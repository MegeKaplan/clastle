"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NewContentPage = () => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start creating</CardTitle>
          <CardDescription>Choose what you want to create today.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button className="h-12 w-full" onClick={() => router.push("/new/announcement")}>
            Create Announcement
          </Button>
          <Button className="h-12 w-full" onClick={() => router.push("/new/post")}>
            Create Post
          </Button>
          <Button className="h-12 w-full" variant="outline" onClick={() => router.push("/new/club")}>
            Create Club
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewContentPage;
