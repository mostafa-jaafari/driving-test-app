"use client";
import Link from "next/link";
import { Car, Menu, LogIn, User, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client"; // Ensure you have this file
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown
  
  const supabase = createClient();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Check User Session on Mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getUser();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // 2. Handle Click Outside Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16" dir="rtl">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">CodeRoute<span className="text-blue-600">.ma</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/categories" className="text-slate-600 hover:text-blue-600 font-medium transition">
              الامتحانات
            </Link>
            <Link href="/history" className="text-slate-600 hover:text-blue-600 font-medium transition">
              نتائجي
            </Link>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : user ? (
              /* LOGGED IN STATE */
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-3 pr-2 py-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate hidden lg:block">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-xs text-slate-400 font-bold mb-1">الحساب الحالي</p>
                      <p className="text-sm font-bold text-slate-800 truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* GUEST STATE */
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition text-sm font-bold"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 border-b border-slate-200">
          <div className="px-4 pt-2 pb-4 space-y-2 text-right">
            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-white">
              الامتحانات
            </Link>
            {user && (
               <Link href="/history" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-white">
               نتائجي
             </Link>
            )}
           
            <div className="border-t border-slate-200 my-2 pt-2">
              {user ? (
                 <>
                  <div className="px-3 py-2 text-sm text-slate-500 truncate">{user.email}</div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 text-red-600 font-bold hover:bg-red-50 rounded-md"
                  >
                    تسجيل الخروج
                  </button>
                 </>
              ) : (
                <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-white">
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}