// src/types.ts

export type PermisType = "A" | "B" | "C" | "D" | "EC" | "Tractor";

export interface PermisCategoryInfo {
  id: PermisType;
  label: string;
  description: string;
  iconName: string; // Helper for UI mapping
}

export enum QuizTopic {
  GENERAL = "GENERAL",
  SIGNS = "SIGNS",
  SAFETY = "SAFETY",
  SCENARIOS = "SCENARIOS",
  FINES = "FINES",
}

export interface Question {
  id: string;
  imageUrl: string;
  questionText: string;
  options: string[];
  correctAnswerIndices: number[];
  explanation: string;
  category: string;
}

export interface ExamSeries {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
  permisType: PermisType; // <--- ADDED THIS
  questions: Question[];
}