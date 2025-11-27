"use client";
import Link from "next/link";
import { Car, Bike, Truck, Bus, Tractor, ArrowLeft, Lock } from "lucide-react";
import { PermisType } from "@/types";

const CATEGORIES: { id: PermisType; label: string; icon: any; color: string }[] = [
  { id: "B", label: "صنف B (سيارة)", icon: Car, color: "bg-blue-600" },
  { id: "A", label: "صنف A (دراجة نارية)", icon: Bike, color: "bg-orange-600" },
  { id: "C", label: "صنف C (شاحنة)", icon: Truck, color: "bg-green-600" },
  { id: "D", label: "صنف D (حافلة)", icon: Bus, color: "bg-purple-600" },
  { id: "EC", label: "صنف EC (رموك)", icon: Truck, color: "bg-slate-700" },
  { id: "Tractor", label: "جرار / آليات", icon: Tractor, color: "bg-amber-600" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            اختر صنف رخصة السياقة
          </h1>
          <p className="text-xl text-slate-600">
            حدد نوع الرخصة التي تريد اجتياز امتحانها للوصول إلى السلسلات المخصصة لها.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const isDisabled = cat.id !== "B";

            // 1. RENDER DISABLED CARD
            if (isDisabled) {
              return (
                <div 
                  key={cat.id} 
                  className="relative bg-slate-100 rounded-3xl p-8 border border-slate-200 overflow-hidden opacity-70 grayscale cursor-not-allowed"
                >
                  <div className="absolute top-4 left-4 bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    قريباً
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-2xl bg-slate-300 text-white flex items-center justify-center mb-6`}>
                      <cat.icon className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-500 mb-2">{cat.label}</h3>
                    <p className="text-slate-400 text-sm font-medium mb-6">
                      غير متاح حالياً
                    </p>

                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <span>دخول للفضاء</span>
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            }

            // 2. RENDER ACTIVE CARD (CATEGORY B)
            return (
              <Link 
                key={cat.id} 
                href={`/dashboard/${cat.id}`}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                    <cat.icon className="w-10 h-10" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{cat.label}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-6">
                    سلسلات مجانية ومدفوعة
                  </p>

                  <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                    <span>دخول للفضاء</span>
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}