"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EXAM_SERIES } from "@/lib/data";
import { Lock, Unlock, PlayCircle, Star, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PermisType } from "@/types";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CategoryDashboard() {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Get Category
  const category = params.category as PermisType;
  const categorySeries = EXAM_SERIES.filter(s => s.permisType === category);

  // 2. Check Auth
  useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (categorySeries.length === 0) {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold mb-4">الصنف غير موجود</h2>
            <Link href="/categories" className="text-blue-600 underline">العودة للاختيار</Link>
        </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12 animate-in fade-in" dir="rtl">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link href="/categories" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition">
            <ArrowRight className="w-5 h-5" />
            <span className="font-bold">تغيير الصنف</span>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                امتحانات رخصة السياقة - صنف {category}
                </h1>
                <p className="text-slate-600 text-lg">
                {user 
                    ? "أنت متصل الآن! جميع السلسلات المدفوعة متاحة لك." 
                    : "ابدأ بالامتحان التجريبي أو سجل الدخول للوصول للباقي."}
                </p>
            </div>
            
            {/* Login Prompt if guest */}
            {!user && !loading && (
                <Link href="/auth/login" className="hidden md:flex bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg items-center gap-2">
                    <Lock className="w-4 h-4" />
                    تسجيل الدخول لفتح السلسلات
                </Link>
            )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {loading ? (
             /* Loading Skeletons */
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>
             ))
        ) : (
            categorySeries.map((series) => {
                // LOGIC: It is locked ONLY if it is Premium AND User is NOT logged in
                const isLocked = series.isPremium && !user;

                return (
                <div 
                    key={series.id} 
                    className={`relative group flex flex-col bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl ${
                    isLocked 
                        ? "border-slate-100" 
                        : "border-blue-500 shadow-md ring-4 ring-blue-50"
                    }`}
                >
                    {/* Locked Overlay */}
                    {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white p-4 rounded-full shadow-2xl mb-3 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                        <Lock className="w-8 h-8 text-slate-900" />
                        </div>
                        <Link 
                            href="/auth/login"
                            className="font-bold text-white bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-full shadow-lg transition transform scale-95 hover:scale-105"
                        >
                        تسجيل الدخول للفتح
                        </Link>
                    </div>
                    )}

                    <div className="p-8 flex flex-col h-full">
                    
                    {/* Badges */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl ${isLocked ? 'bg-amber-100' : 'bg-blue-100'}`}>
                        {isLocked ? (
                            <Lock className="w-6 h-6 text-amber-600" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        )}
                        </div>

                        {series.isPremium ? (
                            isLocked ? (
                                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-slate-400 text-slate-400" />
                                    مدفوع
                                </span>
                            ) : (
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                                    <Unlock className="w-3 h-3" />
                                    تم الفتح
                                </span>
                            )
                        ) : (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                مجاني
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{series.title}</h3>
                    <p className="text-slate-500 mb-8 text-sm leading-relaxed flex-grow">
                        {series.description}
                    </p>
                    
                    {/* Actions */}
                    {isLocked ? (
                        <Link 
                            href="/auth/login"
                            className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-400 font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                        <Lock className="w-4 h-4" />
                        مغلق (نسخة مدفوعة)
                        </Link>
                    ) : (
                        <Link 
                            href={`/quiz/${series.id}`}
                            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <PlayCircle className="w-5 h-5" />
                            {user && series.isPremium ? "إبدأ الامتحان" : "إبدأ مجاناً"}
                        </Link>
                    )}
                    </div>
                </div>
                );
            })
        )}
      </div>
    </div>
  );
}