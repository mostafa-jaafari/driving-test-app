// src/types.ts

export enum QuizTopic {
  GENERAL = "GENERAL",
  SIGNS = "SIGNS",
  SAFETY = "SAFETY",
  SCENARIOS = "SCENARIOS",
  FINES = "FINES",
}

export interface Question {
  id: string;
  imageUrl: string; // URL or empty string
  questionText: string;
  options: string[];
  correctAnswerIndices: number[]; // Array because some questions have multiple correct answers (e.g., 1 and 3)
  explanation: string;
  category: string;
  isLoadingImage?: boolean; // Added optional to match your data mapping logic
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<string, number[]>; // Maps Question ID to selected indices
  isFinished: boolean;
  score: number;
}