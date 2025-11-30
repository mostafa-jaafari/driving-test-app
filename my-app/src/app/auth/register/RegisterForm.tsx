"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Phone, 
  UploadCloud, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  CreditCard,
  AlertCircle,
  Building2,
  BadgeCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Helper Component for Copy Button
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
      title="نسخ"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  
  // Form Fields (Email/Pass removed)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Generate Random 8-Digit Code on Mount ---
  useEffect(() => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setPaymentCode(code);
  }, []);

  // --- Helpers ---
  const handleCopyCode = () => {
    navigator.clipboard.writeText(paymentCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!file) throw new Error("المرجو إرفاق صورة التوصيل (Screenshot)");

      // 1. Upload Screenshot
      // We use phone number + code as unique ID since we don't have auth ID yet
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.phone.replace(/\s/g, '')}-${paymentCode}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Save Request to Database
      // Insert into a 'subscription_requests' table (Create this table in Supabase)
      const { error: dbError } = await supabase
        .from('subscription_requests') 
        .insert({
          full_name: formData.fullName,
          phone_number: formData.phone,
          payment_ref_code: paymentCode,
          payment_proof_url: fileName,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Success
      router.push("/auth/success?ref=" + paymentCode);

    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع، المرجو المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans" dir="rtl">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* --- RIGHT SIDE: Payment Instructions --- */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <CreditCard className="w-3 h-3" />
              معلومات الدفع
            </div>
            
            <h2 className="text-3xl font-black mb-4">طريقة الأداء</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              للاستفادة من جميع السلسلات، المرجو إرسال مبلغ الاشتراك (49 درهم) إلى الحساب التالي:
            </p>

            {/* --- BANK DETAILS (With Copy Buttons) --- */}
            <div className="space-y-4 text-sm bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
              
              {/* Bank Name */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-4 h-4" />
                  البنك:
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-lg">CIH Bank</span>
                  <CopyButton text="CIH Bank" />
                </div>
              </div>

              {/* RIB */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 text-slate-300">
                  <CreditCard className="w-4 h-4" />
                  رقم الحساب (RIB):
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white tracking-wider text-right" dir="ltr">
                    230 780 1234567890001234 55
                  </span>
                  <CopyButton text="230780123456789000123455" />
                </div>
              </div>

              {/* Beneficiary */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-300">
                  <User className="w-4 h-4" />
                  المستفيد (Nom):
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">CodeRoute Team</span>
                  <CopyButton text="CodeRoute Team" />
                </div>
              </div>
            </div>

            {/* --- RANDOM CODE BOX --- */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-2xl p-6">
              <p className="text-blue-200 text-sm font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                هام جداً:
              </p>
              <p className="text-sm mb-4 text-slate-200">
                المرجو كتابة هذا الرقم في <span className="font-bold text-white underline">ملاحظة (Motif)</span> التحويل البنكي لتفعيل حسابك بسرعة.
              </p>
              
              <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-xl border border-blue-500/50 relative group">
                <span className="text-3xl font-mono font-black tracking-widest text-white w-full text-center">
                  {paymentCode}
                </span>
                <button 
                  onClick={handleCopyCode}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-lg transition"
                  title="نسخ الرمز"
                >
                  {codeCopied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400 text-center">
            تواجه مشكلة؟ <Link href="/contact" className="text-white underline">تواصل معنا عبر واتساب</Link>
          </div>
        </div>

        {/* --- LEFT SIDE: The Form --- */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 mb-2">تأكيد الاشتراك</h1>
            <p className="text-slate-500">أدخل معلوماتك وأرفق صورة التوصيل لتفعيل حسابك.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محمد العلوي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">رقم الهاتف (واتساب)</label>
              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input 
                  type="tel" 
                  required
                  dir="ltr"
                  placeholder="06 00 00 00 00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-right font-mono"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                صورة التوصيل (Recu)
                <span className="text-xs font-normal text-slate-400">مطلوب *</span>
              </label>
              
              <div className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${file ? 'border-green-500 bg-green-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2 text-green-700 animate-in zoom-in">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                       <BadgeCheck className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-green-600">تم اختيار الصورة بنجاح</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-slate-600 font-bold">اضغط لإضافة صورة التوصيل</p>
                    <p className="text-xs text-slate-400 mt-1">أو اسحب الصورة هنا</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال الطلب
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}