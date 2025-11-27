import { getUserHistory } from "@/app/actions/history";
import { CheckCircle2, XCircle, Calendar, Clock, BarChart3, History, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function HistoryPage() {
  // 1. Server-side Auth Check
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Fetch Data
  const history = await getUserHistory();

  // 3. Calculate Stats
  const totalExams = history.length;
  const passedExams = history.filter(h => h.is_passed).length;
  const avgScore = totalExams > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalExams) 
    : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12 animate-in fade-in" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <History className="w-8 h-8 text-blue-600" />
                سجل النتائج
            </h1>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition">
                <span>الامتحانات</span>
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                    <History className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-bold">عدد الامتحانات</p>
                    <p className="text-3xl font-black text-slate-800">{totalExams}</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-xl text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-bold">مرات النجاح</p>
                    <p className="text-3xl font-black text-slate-800">{passedExams}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-xl text-purple-600">
                    <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-bold">معدل النقاط</p>
                    <p className="text-3xl font-black text-slate-800">{avgScore}</p>
                </div>
            </div>
        </div>

        {/* List of Results */}
        <div className="space-y-4">
            {history.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <div className="mx-auto bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <History className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد نتائج بعد</h3>
                    <p className="text-slate-500 mb-6">لم تقم باجتياز أي امتحان حتى الآن.</p>
                    <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition inline-flex items-center gap-2">
                        إبدأ امتحان جديد
                    </Link>
                </div>
            ) : (
                history.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Left Side: Info */}
                        <div className="flex items-start md:items-center gap-4">
                            <div className={`p-4 rounded-xl ${item.is_passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {item.is_passed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.exam_title}</h3>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.created_at).toLocaleDateString('ar-MA')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(item.created_at).toLocaleTimeString('ar-MA', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Score */}
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                             <div className="text-center">
                                <span className={`block text-2xl font-black ${item.is_passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.score}
                                    <span className="text-sm text-slate-400 font-medium">/{item.total_questions}</span>
                                </span>
                                <span className="text-xs font-bold text-slate-400">النتيجة</span>
                             </div>
                             
                             <Link 
                                href={`/quiz/${item.exam_id}`} 
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition"
                             >
                                إعادة
                             </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}