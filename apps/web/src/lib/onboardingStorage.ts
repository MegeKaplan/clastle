const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";
const ONBOARDING_ASSIGNED_CLUB_KEY = "onboardingAssignedClub";

export const getOnboardingCompleted = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
};

export const setOnboardingCompleted = (value: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, String(value));
};

export const getPostAuthRedirectPath = (): string => {
  return getOnboardingCompleted() ? "/" : "/onboarding";
};

export const getOnboardingAssignedClub = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ONBOARDING_ASSIGNED_CLUB_KEY);
};

export const setOnboardingAssignedClub = (club: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ONBOARDING_ASSIGNED_CLUB_KEY, club);
};
