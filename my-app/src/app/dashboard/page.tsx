import Link from "next/link";
import { getUserHistory } from "@/app/actions/history";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { 
  Car, 
  History, 
  Trophy, 
  TrendingUp, 
  PlayCircle, 
  ArrowLeft, 
  LayoutGrid,
  AlertCircle
} from "lucide-react";

export default async function DashboardHome() {
  // 1. Initialize Supabase on Server
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // 2. Get User
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Get History (If logged in)
  const history = user ? await getUserHistory() : [];

  // 4. Calculate Stats
  const totalExams = history.length;
  const passedExams = history.filter(h => h.is_passed).length;
  const successRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  const lastExam = history.length > 0 ? history[0] : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12 animate-in fade-in" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- HERO SECTION --- */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        {user ? `مرحباً بك مجدداً!` : `مرحباً بك في CodeRoute!`}
                    </h1>
                    <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                        {user 
                           ? "أنت جاهز لاجتياز امتحان جديد؟ تابع تقدمك وحقق النجاح."
                           : "أفضل منصة للتدرب على امتحان رخصة السياقة بالمغرب. سجل الدخول لحفظ تقدمك."
                        }
                    </p>
                </div>

                {/* Quick Action Button */}
                <Link 
                    href="/dashboard/B" 
                    className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-3"
                >
                    <Car className="w-6 h-6" />
                    <span>إبدأ امتحان صنف B</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>

        {/* --- STATS GRID (Only if User is Logged In) --- */}
        {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold">نسبة النجاح</p>
                        <p className="text-3xl font-black text-slate-800">{successRate}%</p>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-6 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                        <PlayCircle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold">مجموع الامتحانات</p>
                        <p className="text-3xl font-black text-slate-800">{totalExams}</p>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-6 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold">آخر نتيجة</p>
                        <p className="text-3xl font-black text-slate-800">
                            {lastExam ? `${lastExam.score}/40` : "--"}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* --- NAVIGATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Link 1: Categories */}
            <Link href="/categories" className="group bg-white p-8 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <LayoutGrid className="w-6 h-6 text-slate-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">جميع الأصناف</h3>
                <p className="text-slate-500 text-sm">تصفح جميع أصناف رخص السياقة (B, A, C, D...)</p>
            </Link>

            {/* Link 2: History (If User) */}
            {user ? (
                <Link href="/history" className="group bg-white p-8 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <History className="w-6 h-6 text-slate-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">سجل النتائج</h3>
                    <p className="text-slate-500 text-sm">راجع أخطاءك السابقة وتتبع تطور مستواك.</p>
                </Link>
            ) : (
                <Link href="/auth/login" className="group bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 hover:bg-white hover:border-blue-400 transition-all">
                    <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">تسجيل الدخول</h3>
                    <p className="text-slate-400 text-sm">سجل الدخول للوصول إلى السلسلات المدفوعة.</p>
                </Link>
            )}

            {/* Link 3: Category B (Direct) */}
            <Link href="/dashboard/B" className="group bg-white p-8 rounded-2xl border-b border-neutral-300 ring ring-neutral-300/80 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Car className="w-6 h-6 text-slate-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">امتحانات السيارة</h3>
                <p className="text-slate-500 text-sm">ادخل مباشرة إلى سلسلات الصنف B الأكثر طلباً.</p>
            </Link>

        </div>
      </div>
    </div>
  );
}