"use client";

import { useState, useEffect } from "react";
import { generateRandomAccount } from "@/app/actions/auth";
import { loginAdmin, logoutAdmin, checkAdminSession } from "@/app/actions/admin-auth";
import { UserPlus, Copy, Check, Lock, LogOut, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminSession().then(setIsAuthenticated);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await loginAdmin(pin);
    if (result.success) setIsAuthenticated(true);
    else setError(result.error || "خطأ");
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setCredentials(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    // Add artificial delay for UX (feels more like "processing")
    const result = await generateRandomAccount();
    if (result.success && result.email && result.password) {
      setCredentials({ email: result.email, password: result.password });
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!credentials) return;
    const text = `البريد: ${credentials.email}\nالكود: ${credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAuthenticated === null) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><RefreshCw className="animate-spin"/></div>;

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="mx-auto bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-8 h-8 text-slate-700" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">مدير النظام</h1>
          <p className="text-slate-500 text-sm mb-8">أدخل رمز الحماية للمتابعة</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-center text-2xl font-bold tracking-[0.5em] transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6 px-2">
           <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="text-green-500 w-6 h-6" />
              <span className="font-bold text-lg">لوحة التحكم</span>
           </div>
           <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/20 text-white p-2 rounded-lg transition backdrop-blur-sm">
             <LogOut className="w-5 h-5" />
           </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">توليد حساب جديد</h2>
            <p className="text-slate-500">أنقر أسفله لاستخراج بريد وكلمة مرور للمترشح</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6" />
                توليد حساب جديد
              </>
            )}
          </button>

          {/* Credentials Result */}
          {credentials && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative bg-slate-900 rounded-2xl p-1 shadow-2xl overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
                <div className="bg-slate-900 rounded-xl p-6 relative z-10">
                  
                  <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-blue-400 w-5 h-5" />
                        <span className="text-slate-400 text-sm font-bold">بطاقة الدخول</span>
                    </div>
                    <span className="text-xs font-mono text-slate-600">#USER-{Math.floor(Math.random()*1000)}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="group/item">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">البريد الإلكتروني</label>
                      <div className="flex items-center justify-between">
                        <div className="text-white font-mono text-lg font-bold select-all">{credentials.email}</div>
                      </div>
                    </div>
                    <div className="group/item">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">كلمة المرور (الكود)</label>
                      <div className="flex items-center justify-between">
                        <div className="text-white font-mono text-lg font-bold select-all tracking-widest">{credentials.password}</div>
                      </div>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={copyToClipboard}
                    className="absolute bottom-6 left-6 p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all shadow-lg"
                    title="نسخ المعلومات"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>

                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 font-bold bg-green-50 py-2 rounded-lg">
                 <Check className="w-3 h-3" />
                 تم إنشاء الحساب بنجاح
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}