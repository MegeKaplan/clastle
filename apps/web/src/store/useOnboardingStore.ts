import { create } from "zustand";

interface OnboardingState {
  currentStep: number;
  answers: Record<string, number>;
  setAnswer: (questionId: string, optionIndex: number) => void;
  nextStep: () => void;
  reset: () => void;
}

const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 0,
  answers: {},
  setAnswer: (questionId, optionIndex) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionIndex,
      },
    })),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),
  reset: () =>
    set({
      currentStep: 0,
      answers: {},
    }),
}));

export default useOnboardingStore;
