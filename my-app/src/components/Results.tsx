"use client";
import { Question } from "@/types";
import { Check, X, RotateCcw, Home, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveExamResult } from "@/app/actions/history";

interface ResultsProps {
  questions: Question[];
  userAnswers: Record<string, number[]>;
  score: number;
  onRetry: () => void;
  examData?: { id: string; title: string };
}

export default function Results({ questions, userAnswers, score, onRetry, examData }: ResultsProps) {
  // UPDATED: Passing score is exactly half of the questions (rounded up)
  const PASSING_SCORE = Math.ceil(questions.length / 2);
  const passed = score >= PASSING_SCORE;
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const hasSaved = useRef(false);

  useEffect(() => {
    const saveData = async () => {
      if (hasSaved.current || !examData) return;
      hasSaved.current = true;
      setSaveStatus("saving");

      const result = await saveExamResult({
        examId: examData.id,
        examTitle: examData.title,
        score: score,
        totalQuestions: questions.length,
        // isPassed: passed // Pass the calculated result to backend if needed
      });

      if (result.success) setSaveStatus("saved");
      else setSaveStatus("error");
    };

    saveData();
  }, [examData, score, questions.length, passed]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Score Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-center shadow-xl ${
        passed 
          ? "bg-gradient-to-br from-green-500 to-emerald-700 text-white" 
          : "bg-gradient-to-br from-red-500 to-rose-700 text-white"
      }`}>
        <div className="relative z-10">
          
          {/* Save Status Indicator */}
          <div className="absolute top-0 right-0 p-4">
             {saveStatus === "saving" && <div className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1 rounded-full"><Loader2 className="w-3 h-3 animate-spin"/> جاري الحفظ...</div>}
             {saveStatus === "saved" && <div className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1 rounded-full"><Check className="w-3 h-3"/> تم الحفظ</div>}
          </div>

          <h1 className="text-4xl font-black mb-2">
            {passed ? "🎉 مبروك عليك النجاح!" : "😔 للأسف، لم تنجح"}
          </h1>
          
          <p className="text-lg opacity-90 mb-6">
            {passed 
              ? "لقد تجاوزت الاختبار بنجاح." 
              : `يجب الحصول على ${PASSING_SCORE} نقاط على الأقل للنجاح.`
            }
          </p>
          
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 mb-6">
            <span className="text-6xl font-black">{score}</span>
            <span className="text-2xl opacity-75 mx-2">/</span>
            <span className="text-2xl opacity-75">{questions.length}</span>
          </div>

          <div className="flex justify-center gap-4 text-sm font-semibold">
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة المحاولة
            </button>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-black/20 text-white px-6 py-3 rounded-xl hover:bg-black/30 transition backdrop-blur-sm"
            >
              <Home className="w-4 h-4" />
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
      
      {/* Review Answers Section */}
       <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          مراجعة الأجوبة
        </h2>
        
        {questions.map((q, index) => {
          const userSelected = userAnswers[q.id] || [];
          const isCorrect = 
            q.correctAnswerIndices.length === userSelected.length &&
            q.correctAnswerIndices.every((val) => userSelected.includes(val));

          return (
            <div key={q.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
              isCorrect ? "border-slate-200" : "border-red-300 ring-4 ring-red-50"
            }`}>
              <div className={`p-4 flex items-center justify-between border-b ${
                isCorrect ? "bg-slate-50" : "bg-red-50"
              }`}>
                <span className="font-bold text-slate-500">السؤال {index + 1}</span>
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                    <Check className="w-4 h-4" /> صحيح
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">
                    <X className="w-4 h-4" /> خطأ
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">{q.questionText}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt, optIdx) => {
                    const isUserSelected = userSelected.includes(optIdx);
                    const isActuallyCorrect = q.correctAnswerIndices.includes(optIdx);
                    let styleClass = "border-slate-100 bg-slate-50 text-slate-500 opacity-70"; 
                    let icon = null;
                    if (isActuallyCorrect) {
                      styleClass = "border-green-500 bg-green-50 text-green-900 font-bold ring-1 ring-green-200";
                      icon = <Check className="w-5 h-5 text-green-600" />;
                    } 
                    if (isUserSelected && !isActuallyCorrect) {
                      styleClass = "border-red-500 bg-red-50 text-red-900 line-through";
                      icon = <X className="w-5 h-5 text-red-600" />;
                    }
                    return (
                      <div key={optIdx} className={`flex items-center justify-between p-3 rounded-lg border ${styleClass}`}>
                        <span>{opt}</span>
                        {icon}
                      </div>
                    )
                  })}
                </div>
                <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-l-lg">
                  <h4 className="font-bold text-blue-900 mb-1 text-sm">💡 الشرح:</h4>
                  <p className="text-blue-800 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}