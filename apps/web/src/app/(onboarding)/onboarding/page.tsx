"use client";

import { useEffect } from "react";
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
import {
  getOnboardingCompleted,
  setOnboardingAssignedClub,
  setOnboardingCompleted,
} from "@/lib/onboardingStorage";
import useOnboardingStore from "@/store/useOnboardingStore";
import { toast } from "sonner";

const OnboardingPage = () => {
  const router = useRouter();
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();

  const totalSteps = onboardingQuestions.length;
  const safeStep = Math.min(currentStep, totalSteps - 1);
  const question = onboardingQuestions[safeStep];
  const selectedOptionIndex = answers[question.id];
  const canContinue = typeof selectedOptionIndex === "number";
  const progress = ((safeStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (getOnboardingCompleted()) {
      router.replace("/");
    }
  }, [router]);

  const handleContinue = () => {
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
    setOnboardingAssignedClub(assignedClub);
    setOnboardingCompleted(true);
    router.push(`/onboarding/result?club=${assignedClub}`);
  };

  return (
    <Card className="w-full max-w-md shadow-lg px-6 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <CardHeader className="space-y-3">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
            Step {safeStep + 1} of {totalSteps}
          </p>
          <div className="h-2 w-full rounded-full bg-muted mt-2 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
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
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition ${
                  isSelected
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
          disabled={!canContinue}
        >
          {safeStep === totalSteps - 1 ? "See my club" : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingPage;
