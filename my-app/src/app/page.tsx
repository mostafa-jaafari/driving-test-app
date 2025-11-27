import Link from "next/link";
import { Car, Play, BookOpen, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 max-w-4xl w-full text-center space-y-10">
        
        {/* Hero Icon */}
        <div className="mx-auto bg-gradient-to-tr from-blue-600 to-blue-400 p-6 rounded-3xl shadow-2xl w-24 h-24 flex items-center justify-center transform hover:scale-110 transition duration-500">
          <Car className="w-12 h-12 text-white" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            امتحان رخصة السياقة
            <span className="text-blue-600 block mt-2 text-3xl md:text-5xl">المغرب</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            المنصة الأفضل للتحضير لامتحان السياقة. أسئلة حقيقية، شروحات مفصلة، ومحاكاة دقيقة لظروف الامتحان الرسمي.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-bold text-slate-800">أسئلة متنوعة</h3>
            <p className="text-sm text-slate-500">تغطي جميع قواعد السير</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <Award className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="font-bold text-slate-800">نتيجة فورية</h3>
            <p className="text-sm text-slate-500">مع تصحيح وشرح للأخطاء</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <Car className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-bold text-slate-800">محاكاة واقعية</h3>
            <p className="text-sm text-slate-500">نفس نظام الامتحان الرسمي</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link 
            href="/quiz"
            className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white text-xl font-bold px-12 py-5 rounded-full shadow-xl hover:bg-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>إبدأ الامتحان التجريبي</span>
            <div className="absolute inset-0 rounded-full ring-4 ring-white/20 group-hover:ring-white/40 transition-all"></div>
          </Link>
          <p className="mt-4 text-slate-400 text-sm">مجاني 100% ولا يتطلب التسجيل</p>
        </div>

      </main>
    </div>
  );
}