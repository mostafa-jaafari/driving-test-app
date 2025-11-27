"use client";
import { Question } from "@/types";
import { CheckCircle, Circle } from "lucide-react";
import Image from "next/image";

interface QuizCardProps {
  question: Question;
  selectedAnswers: number[];
  onToggleAnswer: (index: number) => void;
}

export default function QuizCard({ question, selectedAnswers, onToggleAnswer }: QuizCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      {/* Image Section */}
      <div className="relative w-full h-64 bg-slate-100 flex items-center justify-center border-b border-slate-200">
        {question.imageUrl ? (
          <Image
            src={question.imageUrl}
            alt="Scenario"
            fill
            className="object-contain"
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <span className="text-sm font-medium">Image Scenario Placeholder</span>
            <span className="text-xs">(Add URL in data file)</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6" dir="rtl">
        <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.questionText}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => onToggleAnswer(idx)}
                className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-blue-300 text-slate-600"
                }`}
              >
                <div className="ml-4">
                  {isSelected ? (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <span className="text-lg font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}