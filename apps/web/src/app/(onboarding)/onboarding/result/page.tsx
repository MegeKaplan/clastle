"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ClubCategory, clubCategories } from "@/constants/onboardingQuestions";
import { useAuth } from "@/components/AuthProvider";
import useOnboardingStore from "@/store/useOnboardingStore";

const clubNameMap: Record<ClubCategory, string> = {
  literature: "Literature Club",
  foreign_language: "Foreign Language Club",
  art: "Art Club",
  music: "Music Club",
  digital_gaming: "Digital Games Club",
};

const OnboardingResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reset } = useOnboardingStore();
  const { user, loading } = useAuth();

  const rawClub = searchParams.get("club");
  const isValidClub = rawClub ? clubCategories.includes(rawClub as ClubCategory) : false;
  const assignedClub = (isValidClub ? rawClub : "literature") as ClubCategory;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    // Only redirect back if they somehow landed here without completing onboarding
    if (!user.onboardingCompleted) {
      router.replace("/onboarding");
    }
    // If onboardingCompleted=true, stay on this page and show the result
  }, [loading, router, user]);

  const handleGoHome = () => {
    reset();
    router.push("/home");
  };

  return (
    <Card className="w-full max-w-md shadow-lg px-6 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <CardHeader>
        <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Onboarding Complete</p>
        <CardTitle className="text-3xl font-bold">You are matched!</CardTitle>
        <CardDescription>
          Based on your responses, your strongest interest profile points to this club:
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-5">
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Recommended Club</p>
          <h2 className="text-2xl font-semibold mt-1">{clubNameMap[assignedClub]}</h2>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 rounded-none bg-background">
        <Button
          type="button"
          size="lg"
          className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer"
          onClick={handleGoHome}
        >
          Continue to dashboard
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingResultPage;
