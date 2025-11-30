import { Suspense } from "react";
import { SuccessContent } from "./SuccessPage";





export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12 font-sans" dir="rtl">
      <Suspense fallback={
        <div className="text-center text-slate-500 flex flex-col items-center">
            <span className="animate-spin text-4xl mb-4">⏳</span>
            <p>جاري تحميل الصفحة...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}