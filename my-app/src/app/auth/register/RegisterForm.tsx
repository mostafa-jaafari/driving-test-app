"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  UploadCloud, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  CreditCard,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Generate Random 8-Digit Code on Mount ---
  useEffect(() => {
    // Generate a random number between 10000000 and 99999999
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setPaymentCode(code);
  }, []);

  // --- Helpers ---
  const handleCopyCode = () => {
    navigator.clipboard.writeText(paymentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone, // Save in metadata
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("حدث خطأ أثناء إنشاء الحساب");

      const userId = authData.user.id;

      // 2. Upload Screenshot
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${paymentCode}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Save Order/Subscription Request to Database
      // Assuming you have a table 'subscription_requests' or you update 'profiles'
      const { error: dbError } = await supabase
        .from('profiles') // Or 'orders'
        .upsert({
          id: userId,
          full_name: formData.fullName,
          phone_number: formData.phone,
          payment_ref_code: paymentCode, // The 8-digit code
          payment_proof_url: fileName,
          subscription_status: 'pending', // Waiting for admin approval
          email: formData.email
        });

      if (dbError) throw dbError;

      // Success! Redirect to dashboard or success page
      router.push("/dashboard?welcome=true");

    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans" dir="rtl">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* --- RIGHT SIDE: Payment Instructions (The "Bill") --- */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <CreditCard className="w-3 h-3" />
              معلومات الدفع
            </div>
            
            <h2 className="text-3xl font-black mb-4">أتمم عملية التسجيل</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              للاستفادة من جميع السلسلات (40 سلسلة)، المرجو إرسال مبلغ الاشتراك (49 درهم) وإرفاق صورة التحويل.
            </p>

            {/* --- THE RANDOM CODE BOX --- */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <p className="text-blue-200 text-sm font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                هام جداً:
              </p>
              <p className="text-sm mb-4 opacity-90">
                المرجو كتابة هذا الرقم في <span className="font-bold text-white underline">ملاحظة/وصف</span> عملية التحويل البنكي لنتمكن من تفعيل حسابك فوراً.
              </p>
              
              <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-white/10 relative group">
                <span className="text-3xl font-mono font-black tracking-widest text-white w-full text-center">
                  {paymentCode}
                </span>
                <button 
                  onClick={handleCopyCode}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-lg transition"
                  title="نسخ الرمز"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
              {copied && <p className="text-green-400 text-xs mt-2 text-center font-bold">تم نسخ الرمز بنجاح!</p>}
            </div>

            {/* Bank Details Mockup */}
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>البنك:</span>
                <span className="font-bold text-white">CIH Bank</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>رقم الحساب (RIB):</span>
                <span className="font-mono font-bold text-white" dir="ltr">230 780 1234567890001234 55</span>
              </div>
              <div className="flex justify-between">
                <span>المستفيد:</span>
                <span className="font-bold text-white">CodeRoute Team</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-400 text-center">
            تواجه مشكلة؟ <Link href="/contact" className="text-white underline">تواصل معنا عبر واتساب</Link>
          </div>
        </div>

        {/* --- LEFT SIDE: The Form --- */}
        <div className="p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 mb-2">إنشاء حساب جديد</h1>
            <p className="text-slate-500 text-sm">أدخل معلوماتك الشخصية وصورة التوصيل.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محمد العلوي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="tel" 
                  required
                  dir="ltr"
                  placeholder="06 00 00 00 00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-right"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-right"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-right"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-700">صورة توصيل الدفع (Recu)</label>
              <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition hover:bg-slate-50 ${file ? 'border-green-400 bg-green-50' : 'border-slate-300'}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">اضغط هنا لرفع الصورة أو اسحبها هنا</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التسجيل...
                </>
              ) : (
                <>
                  تأكيد الطلب
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              لديك حساب بالفعل؟ <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">سجل الدخول</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}