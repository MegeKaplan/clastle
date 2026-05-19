import {
  clubCategories,
  type ClubCategory,
  onboardingQuestions,
} from "@/constants/onboardingQuestions";

export const calculateClub = (answers: Record<string, number>): ClubCategory => {
  const scoreByCategory: Record<ClubCategory, number> = {
    literature: 0,
    foreign_language: 0,
    art: 0,
    music: 0,
    digital_gaming: 0,
  };

  for (const question of onboardingQuestions) {
    const selectedOptionIndex = answers[question.id];

    if (typeof selectedOptionIndex !== "number") {
      continue;
    }

    const selectedOption = question.options[selectedOptionIndex];

    if (!selectedOption) {
      continue;
    }

    scoreByCategory[selectedOption.category] += 1;
  }

  let topCategory: ClubCategory = clubCategories[0];
  let topScore = scoreByCategory[topCategory];

  for (const category of clubCategories.slice(1)) {
    if (scoreByCategory[category] > topScore) {
      topCategory = category;
      topScore = scoreByCategory[category];
    }
  }

  return topCategory;
};
