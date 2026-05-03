"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NewClubPage = () => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new club</CardTitle>
        <CardDescription>Start a new community and gather people with similar interests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-xl mb-6 font-medium">
          Note: Creating a new club is currently unavailable as the backend API endpoint does not exist yet. This form is disabled.
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="club-name">Club Name</Label>
            <Input
              id="club-name"
              placeholder="E.g., Astronomy Club"
              className="h-11"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="club-description">Description</Label>
            <Textarea
              id="club-description"
              placeholder="Describe what this club is about"
              disabled
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled>
            Create Club
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewClubPage;
