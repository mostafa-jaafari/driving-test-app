"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { 
  CheckCircle2, 
  Copy, 
  Home, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Smartphone 
} from "lucide-react";
import { motion } from "framer-motion";

// Helper component to handle search params safely
export function SuccessContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "---";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      
      {/* 1. Header (Green) */}
      <div className="bg-green-600 text-white p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-20 h-20 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        
        <h1 className="text-3xl font-black mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-green-100 text-lg">شكراً لك، سيتم تفعيل حسابك قريباً.</p>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        
        {/* 2. Reference Code Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-500 font-bold mb-3">رمز المرجع الخاص بك (Reference)</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-black text-slate-800 tracking-widest">
              {refCode}
            </span>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-slate-200 rounded-lg transition text-slate-400 hover:text-slate-600"
              title="نسخ"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">يرجى الاحتفاظ بهذا الرمز للمراجعة</p>
        </div>

        {/* 3. What Happens Next? (Timeline) */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">ماذا سيحدث الآن؟</h3>
          <div className="space-y-6 relative before:absolute before:right-[19px] before:top-2 before:h-full before:w-0.5 before:bg-slate-100">
            
            {/* Step 1 */}
            <div className="flex gap-4 relative">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">مراجعة الطلب</h4>
                <p className="text-sm text-slate-500">يقوم فريقنا بالتحقق من صورة التوصيل والمبلغ.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 relative">
              <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-400">تفعيل الحساب</h4>
                <p className="text-sm text-slate-400">يتم إنشاء حسابك وتفعيله للوصول لجميع السلسلات.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 relative">
              <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-400">إشعار عبر واتساب</h4>
                <p className="text-sm text-slate-400">سنرسل لك بيانات الدخول (البريد وكلمة المرور) عبر واتساب.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <Link 
            href="/" 
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          
          <a 
            // Replace with your actual number
            href={`https://wa.me/212600000000?text=Salam, I made a payment with Ref: ${refCode}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-200"
          >
            <MessageCircle className="w-5 h-5" />
            تواصل معنا
          </a>
        </div>

      </div>
    </div>
  );
}