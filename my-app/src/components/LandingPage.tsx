"use client";
import Link from "next/link";
import { 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  PlayCircle, 
  Star, 
  Users, 
  ArrowLeft,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-32 pb-20 px-6">
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-200 text-sm font-bold backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              متوافق مع النظام الجديد 2025
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              جيب البيرمي <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                من الدقة اللولة!
              </span>
            </h1>
            
            <p className="text-lg text-blue-100/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              ما تضيعش وقتك وفلوسك. تدرب على أكثر من 40 سلسلة حصرية، شرح بالدارجة، وتصحيح فوري. انضم لـ +10,000 مترشح نجحوا معنا.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/auth/register" 
                className="flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition shadow-xl shadow-blue-900/20"
              >
                إبدأ مجاناً الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link 
                href="/auth/login" 
                className="flex items-center justify-center gap-2 bg-transparent border border-blue-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition"
              >
                عندي حساب
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-blue-200/60 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-400"/> ضمان النجاح</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-400"/> أسئلة الامتحان</span>
            </div>
          </div>

          {/* Visuals / Stickers Area */}
          <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center">
            
            {/* Main Circle */}
            <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] border border-dashed border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

            {/* Floating Sticker 1: 40/40 */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 lg:top-20 lg:left-20 bg-white p-4 rounded-2xl shadow-2xl transform -rotate-12 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold">النتيجة</p>
                  <p className="text-2xl font-black text-slate-800">40/40</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Sticker 2: Audio Darija */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 bg-white p-4 rounded-2xl shadow-2xl transform rotate-6 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-700">شرح بالدارجة 🇲🇦</p>
              </div>
            </motion.div>

            {/* Center Image */}
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5 }}
               className="relative z-10"
            >
                <div className="relative bg-gradient-to-b from-slate-200 to-slate-300 w-64 h-80 rounded-[3rem] border-8 border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 w-40 h-6 bg-slate-900 rounded-b-xl z-20"></div>
                    {/* Mock App UI */}
                    <div className="w-full h-full bg-white pt-10 px-4 space-y-4">
                        <div className="h-32 bg-slate-100 rounded-xl w-full animate-pulse"></div>
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="h-12 bg-blue-600 rounded-lg"></div>
                            <div className="h-12 bg-slate-100 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- 2. FEATURES SECTION --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              علاش تختار <span className="text-blue-600">CodeRoute</span>؟
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              جمعنا ليك كل ما كتحتاج باش دوز الامتحان وأنت مرتاح وبدون خوف.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">القراءة الصوتية</h3>
              <p className="text-slate-500 leading-relaxed">
                ماعندكش مع القراءة؟ هانية! التطبيق كيقرا ليك الأسئلة والأجوبة بوضوح وبالدارجة المغربية.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">سلسلات الامتحان</h3>
              <p className="text-slate-500 leading-relaxed">
                كنوفروا ليك نفس الأسئلة والصور اللي كتحط يوم الامتحان (PDF 2025) باش ماتفاجأش.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">تتبع التقدم</h3>
              <p className="text-slate-500 leading-relaxed">
                كنحفظوا ليك النقط والأغلاط ديالك فكل امتحان، باش تعرف راسك واش واجد ولا مزال.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. PRICING / CTA SECTION --- */}
      <section className="py-20 px-6 bg-slate-900 text-white overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-6">استثمر فمستقبلك بثمن قهوة ☕</h2>
            <p className="text-blue-200 text-lg">اختر الخطة المناسبة ليك وبدا الحفاظة اليوم.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Free Plan */}
            <div className="p-8 rounded-3xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition">
              <h3 className="text-2xl font-bold mb-2">مجاني</h3>
              <p className="text-slate-400 mb-6">تجربة التطبيق واكتشاف الميزات.</p>
              <div className="text-4xl font-black mb-6">0 <span className="text-lg font-medium text-slate-400">درهم</span></div>
              
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500"/> السلسلة رقم 1 فقط</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500"/> تصحيح فوري</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500"/> وضع التدريب</li>
              </ul>

              <Link href="/dashboard/B" className="block w-full py-4 rounded-xl border border-slate-600 text-center font-bold hover:bg-white hover:text-slate-900 transition">
                جرب مجاناً
              </Link>
            </div>

            {/* Premium Plan - Highlighted */}
            <div className="relative p-8 rounded-3xl border-2 border-blue-500 bg-gradient-to-b from-blue-900 to-slate-900 shadow-2xl transform md:scale-105">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                الأكثر طلباً
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-white">Premium VIP</h3>
              <p className="text-blue-200 mb-6">كل ما تحتاجه للنجاح من المحاولة الأولى.</p>
              <div className="text-5xl font-black mb-6 text-white">49 <span className="text-lg font-medium text-blue-300">درهم / شهر</span></div>
              
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400"/> جميع السلسلات (40 سلسلة)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400"/> أسئلة PDF الحصرية</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400"/> حفظ سجل الأخطاء</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400"/> بدون إعلانات مزعجة</li>
              </ul>

              <Link href="/auth/register?plan=premium" className="block w-full py-4 rounded-xl bg-blue-600 text-white text-center font-bold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 transition">
                اشترك الآن وابدأ النجاح
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- 4. FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12" dir="rtl">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">CodeRoute.ma</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              منصتك الأولى في المغرب لتعلم قانون السير واجتياز امتحان رخصة السياقة بنجاح. محتوى محدث وموثوق.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="/auth/login" className="hover:text-blue-600">تسجيل الدخول</Link></li>
              <li><Link href="/auth/register" className="hover:text-blue-600">إنشاء حساب</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600">نصائح وإرشادات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">قانوني</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link href="/terms" className="hover:text-blue-600">شروط الاستخدام</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">سياسة الخصوصية</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">اتصل بنا</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2025 CodeRoute. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition"></div>
            <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition"></div>
            <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-blue-100 cursor-pointer transition"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}