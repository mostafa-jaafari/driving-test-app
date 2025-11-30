"use client";
import Link from "next/link";
import { 
  Car, 
  Menu, 
  LogIn, 
  User, 
  LogOut, 
  ChevronDown, 
  Loader2, 
  LayoutGrid, 
  History 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Check User Session
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // 2. Handle Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    // Removed 'dir="rtl"' from nav to keep Logo on Left and Auth on Right naturally
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* RIGHT: Auth & Dropdown */}
          <div className="flex items-center gap-4">
            
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : user ? (
              /* --- LOGGED IN DROPDOWN --- */
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`cursor-pointer flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-200 ${
                    isDropdownOpen 
                      ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" 
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                      {user.email?.split('@')[0]}
                    </p>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                </button>

                {/* The Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border-b border-neutral-300 ring ring-neutral-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right"
                    dir="rtl" // Force RTL content inside the dropdown
                  >
                    {/* User Header */}
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-bold mb-1">مسجل الدخول بـ</p>
                      <p className="text-sm font-bold text-slate-800 truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>

                    {/* Navigation Links (Moved Here) */}
                    <div className="p-2 space-y-1">
                      <Link 
                        href="/categories" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                           <LayoutGrid className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">جميع الامتحانات</span>
                      </Link>

                      <Link 
                        href="/history" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                           <History className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">سجل النتائج</span>
                      </Link>
                    </div>
                    
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>

                    {/* Logout */}
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition">
                           <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* --- GUEST STATE --- */
              <div className="flex items-center gap-3" dir="rtl">
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition text-sm font-bold shadow-lg shadow-slate-200"
                >
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>

          {/* LEFT: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl shadow-sm group-hover:bg-blue-700 transition">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl text-slate-800 tracking-tight">
                CodeRoute<span className="text-blue-600">.ma</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}