"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EXAM_SERIES } from "@/lib/data";
import { Question } from "@/types";
import QuizCard from "@/components/QuizCard";
import Results from "@/components/Results";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js"; // <--- Import User type

export default function DynamicQuizPage() {
  const params = useParams();
  const router = useRouter();
  
  // State
  const [user, setUser] = useState<User | null>(null); // <--- 1. Add User State
  const [isSaving, setIsSaving] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [seriesTitle, setSeriesTitle] = useState("");
  
  // Quiz Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Get Series ID from URL
      const seriesId = params.id as string;
      const series = EXAM_SERIES.find(s => s.id === seriesId);

      if (!series) {
        router.push("/dashboard");
        return;
      }

      // 2. Initialize Supabase and Get User
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // <--- 2. Set the user state here
      setUser(session?.user ?? null); 

      // 3. Check Auth for Premium
      if (series.isPremium) {
        if (!session) {
          // Add a returnUrl so they come back to the quiz after login
          router.push(`/auth/login?returnUrl=/quiz/${seriesId}`);
          return; 
        }
      }

      // 4. Load Data if Allowed
      setQuestions(series.questions);
      setSeriesTitle(series.title);
      setLoading(false);
    };

    checkAccess();
  }, [params.id, router]);

  // Loading View
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">جاري تحميل الامتحان...</p>
      </div>
    );
  }

  // UPDATE: Logic when exam finishes
  if (isFinished) {
    const score = questions.reduce((acc, q) => {
      const userSelected = userAnswers[q.id] || [];
      const correct = q.correctAnswerIndices;
      const isCorrect = userSelected.length === correct.length && correct.every((val) => userSelected.includes(val));
      return isCorrect ? acc + 1 : acc;
    }, 0);

    // The logic inside Results component handles the saving,
    // so we just pass the necessary props.
    
    return (
      <Results 
        questions={questions} 
        userAnswers={userAnswers} 
        score={score} 
        onRetry={() => window.location.reload()} 
        examData={{ id: params.id as string, title: seriesTitle }}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Interaction Handlers
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
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition">
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm font-bold">خروج</span>
        </Link>
        <h2 className="text-slate-800 font-bold">{seriesTitle}</h2>
      </div>

      {/* Progress */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2" dir="rtl">
          <span>السؤال {currentQuestionIndex + 1} <span className="text-slate-300">/</span> {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <QuizCard
        question={currentQuestion}
        selectedAnswers={userAnswers[currentQuestion.id] || []}
        onToggleAnswer={handleToggleAnswer}
      />

      {/* Footer Navigation */}
      <div className="w-full max-w-4xl mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition ${
            currentQuestionIndex === 0 
              ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200" 
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm"
          }`}
        >
          <ArrowRight className="w-5 h-5" />
          السابق
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          {currentQuestionIndex === questions.length - 1 ? "إنهاء الامتحان" : "السؤال التالي"}
          {currentQuestionIndex !== questions.length - 1 && <ArrowLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}