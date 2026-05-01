export type ClubCategory =
  | "literature"
  | "foreign_language"
  | "art"
  | "music"
  | "digital_gaming";

export interface OnboardingOption {
  label: string;
  category: ClubCategory;
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  options: OnboardingOption[];
}

export const clubCategories: ClubCategory[] = [
  "literature",
  "foreign_language",
  "art",
  "music",
  "digital_gaming",
];

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "creative-energy",
    question: "When you have free time, which activity gives you the deepest sense of flow?",
    options: [
      { label: "Reading stories, essays, or writing personal reflections", category: "literature" },
      { label: "Practicing a new language through media or conversation", category: "foreign_language" },
      { label: "Sketching, designing visuals, or exploring aesthetics", category: "art" },
      { label: "Listening closely to music or experimenting with melodies", category: "music" },
      { label: "Playing or analyzing games and interactive systems", category: "digital_gaming" },
    ],
  },
  {
    id: "challenge-style",
    question: "What kind of challenge feels most rewarding to solve?",
    options: [
      { label: "Interpreting complex ideas and expressing them clearly", category: "literature" },
      { label: "Communicating meaning across cultural and language differences", category: "foreign_language" },
      { label: "Turning abstract concepts into compelling visual forms", category: "art" },
      { label: "Building emotional impact through rhythm and sound", category: "music" },
      { label: "Mastering mechanics, strategy, and rapid decision making", category: "digital_gaming" },
    ],
  },
  {
    id: "group-role",
    question: "In team projects, which role do you naturally take on first?",
    options: [
      { label: "Narrator or editor who shapes the core message", category: "literature" },
      { label: "Bridge-builder who helps everyone understand each other", category: "foreign_language" },
      { label: "Visual lead who defines look, tone, and presentation", category: "art" },
      { label: "Sound and mood curator who drives atmosphere", category: "music" },
      { label: "Systems thinker who optimizes interaction and rules", category: "digital_gaming" },
    ],
  },
  {
    id: "growth-goal",
    question: "Which personal growth goal feels most important right now?",
    options: [
      { label: "Developing a stronger voice through reading and writing", category: "literature" },
      { label: "Becoming confident in multilingual communication", category: "foreign_language" },
      { label: "Sharpening visual creativity and design instincts", category: "art" },
      { label: "Improving musical expression and listening depth", category: "music" },
      { label: "Advancing strategic thinking through interactive media", category: "digital_gaming" },
    ],
  },
  {
    id: "impact",
    question: "What type of contribution do you most want to make in a community?",
    options: [
      { label: "Inspiring thought through stories, essays, and discussion", category: "literature" },
      { label: "Connecting people from different linguistic backgrounds", category: "foreign_language" },
      { label: "Creating visual works that shape shared identity", category: "art" },
      { label: "Uniting people through performances and sound experiences", category: "music" },
      { label: "Building engaging game experiences that foster collaboration", category: "digital_gaming" },
    ],
  },
];
