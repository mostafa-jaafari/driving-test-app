"use client";
import Link from "next/link";
import { Car, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read URL parameters
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("البيانات غير صحيحة، يرجى المحاولة مرة أخرى.");
      setLoading(false);
    } else {
      // 1. Check if there is a returnUrl (e.g. they came from a locked quiz)
      const returnUrl = searchParams.get("returnUrl");
      
      // 2. Refresh the router to update the Navbar (show user icon)
      router.refresh();

      // 3. Redirect to the return URL or the Dashboard Hub
      router.push(returnUrl || "/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="mx-auto bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-slate-400 text-sm">أدخل الكود أو الحساب الذي حصلت عليه</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6" dir="rtl">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="client_1234@code.ma"
                required
              />
              <Mail className="w-5 h-5 text-slate-400 absolute top-3.5 right-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-slate-400 absolute top-3.5 right-3" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}