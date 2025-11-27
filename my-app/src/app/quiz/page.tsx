"use client";
import { useState, useEffect } from "react";
import { generateQuestions } from "@/lib/questions";
import { Question, QuizTopic } from "@/types";
import QuizCard from "@/components/QuizCard";
import Results from "@/components/Results";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function QuizPage() {
  // State for data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // State for quiz progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Load questions on mount
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // You can change QuizTopic.GENERAL to specific topics if needed
        const data = await generateQuestions(QuizTopic.GENERAL);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  // Error/Empty State
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">لا توجد أسئلة متاحة حالياً.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleToggleAnswer = (optionIndex: number) => {
    const qId = currentQuestion.id;
    const currentSelected = userAnswers[qId] || [];
    
    let newSelected;
    if (currentSelected.includes(optionIndex)) {
      newSelected = currentSelected.filter((i) => i !== optionIndex);
    } else {
      newSelected = [...currentSelected, optionIndex].sort();
    }

    setUserAnswers({ ...userAnswers, [qId]: newSelected });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const userSelected = userAnswers[q.id] || [];
      const correct = q.correctAnswerIndices;

      // Exact match required for a point
      const isCorrect =
        userSelected.length === correct.length &&
        correct.every((val) => userSelected.includes(val));

      if (isCorrect) score++;
    });
    return score;
  };

  const handleRetry = () => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    // Optional: Shuffle questions here if desired
  };

  if (isFinished) {
    return (
      <Results 
        questions={questions} 
        userAnswers={userAnswers} 
        score={calculateScore()} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2" dir="rtl">
          <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
          <span>التقدم</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <QuizCard
        question={currentQuestion}
        selectedAnswers={userAnswers[currentQuestion.id] || []}
        onToggleAnswer={handleToggleAnswer}
      />

      {/* Navigation */}
      <div className="w-full max-w-2xl mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
            currentQuestionIndex === 0 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          السابق
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          {currentQuestionIndex === questions.length - 1 ? "إنهاء الاختبار" : "التالي"}
          {currentQuestionIndex !== questions.length - 1 && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}