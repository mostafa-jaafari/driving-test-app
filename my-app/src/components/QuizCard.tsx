"use client";
import { Question } from "@/types";
import { CheckCircle2, Circle, ImageIcon } from "lucide-react";
import Image from "next/image";

interface QuizCardProps {
  question: Question;
  selectedAnswers: number[];
  onToggleAnswer: (index: number) => void;
}

export default function QuizCard({ question, selectedAnswers, onToggleAnswer }: QuizCardProps) {
  return (
    <div className="w-full max-w-[830px] mx-auto bg-white rounded-2xl border-b border-neutral-300 ring ring-neutral-200/80 shadow overflow-hidden transition-all">
      
      {/* 1. Image Area */}
      <div className="relative w-full h-58 md:h-96 bg-slate-200 flex flex-col items-center justify-center border-b border-slate-100 group">
        {question.imageUrl ? (
          <Image
            src={question.imageUrl}
            alt="Driving Scenario"
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 gap-3">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <p className="font-medium text-sm">لا توجد صورة لهذا السؤال</p>
          </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="p-6 md:p-8">
        {/* Category Badge */}
        <div className="flex justify-start mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-normal">
          {question.questionText}
        </h2>

        {/* Options Grid - Updated to 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            // Check logic based on indices
            const isActive = selectedAnswers.includes(idx); 

            return (
              <button
                key={idx}
                onClick={() => onToggleAnswer(idx)}
                className={`group relative flex items-center w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md h-full ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-900 shadow-inner"
                    : "border-slate-200 bg-white hover:border-blue-200 text-slate-600 cursor-pointer"
                }`}
              >
                {/* Icon Circle */}
                <div className={`flex-shrink-0 ml-4 rounded-full p-1 transition-colors ${
                    isActive ? "bg-blue-200" : "bg-slate-100 group-hover:bg-blue-50"
                }`}>
                  {isActive ? (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />
                  )}
                </div>
                
                {/* Text */}
                <span className={`text-lg md:text-xl font-bold text-right w-full leading-snug ${
                    isActive ? "text-blue-900" : "text-slate-700"
                }`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}