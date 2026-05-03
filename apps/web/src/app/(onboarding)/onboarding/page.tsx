"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { onboardingQuestions } from "@/constants/onboardingQuestions";
import { calculateClub } from "@/lib/calculateClub";
import { useAuth } from "@/components/AuthProvider";
import userService from "@/services/userService";
import clubService from "@/services/clubService";
import useOnboardingStore from "@/store/useOnboardingStore";
import { toast } from "sonner";

const OnboardingPage = () => {
  const router = useRouter();
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const { user, loading, refresh } = useAuth();

  const totalSteps = onboardingQuestions.length;
  const safeStep = Math.min(currentStep, totalSteps - 1);
  const question = onboardingQuestions[safeStep];
  const selectedOptionIndex = answers[question.id];
  const canContinue = typeof selectedOptionIndex === "number";

  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    // Don't redirect if we just completed onboarding (navigating to result)
    if (user.onboardingCompleted && !isSubmittingRef.current) {
      router.replace("/home");
    }
  }, [loading, router, user]);

  const handleContinue = async () => {
    if (!canContinue) {
      toast.error("Please select an option to continue.");
      return;
    }

    const isLastStep = safeStep === totalSteps - 1;

    if (!isLastStep) {
      nextStep();
      return;
    }

    const assignedClub = calculateClub(answers);

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      // 1. Get clubs list
      const clubsRes = await clubService.getClubs();
      const clubs = clubsRes.data;

      // Category → slug mapping (from seed.ts)
      const categorySlugMap: Record<string, string> = {
        literature: "literature-club",
        foreign_language: "foreign-language-club",
        art: "art-club",
        music: "music-club",
        digital_gaming: "digital-games-club",
      };

      const targetSlug = categorySlugMap[assignedClub];

      // 2. Find club by slug first, fallback to name
      const targetClub = clubs.find((c: any) => c.slug === targetSlug)
        ?? clubs.find((c: any) => c.name?.toLowerCase().includes(assignedClub.replace("_", " ")));
      if (targetClub) {
        await clubService.joinClub(targetClub.id);
      }

      // 3. Only then mark onboarding as complete
      await userService.updateUser(user.id, { onboardingCompleted: true });
      await refresh();

      router.push(`/onboarding/result?club=${assignedClub}`);
    } catch (err: unknown) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg px-6 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <CardHeader className="space-y-3">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
            Step {safeStep + 1} of {totalSteps}
          </p>
          <progress
            value={safeStep + 1}
            max={totalSteps}
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
          />
        </div>
        <CardTitle className="text-3xl font-bold">Student Onboarding</CardTitle>
        <CardDescription className="text-base font-medium leading-relaxed text-foreground">
          {question.question}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnswer(question.id, index)}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition ${isSelected
                    ? "border-primary bg-primary/12 text-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 rounded-none bg-background">
        <Button
          type="button"
          size="lg"
          className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer"
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
        >
          {isSubmitting ? "Setting up your club..." : safeStep === totalSteps - 1 ? "See my club" : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingPage;
