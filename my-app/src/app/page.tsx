"use client";
import Link from "next/link";
import { EXAM_SERIES } from "@/lib/data"; // Ensure you have the data.ts from previous steps
import { Lock, Unlock, PlayCircle, Star, AlertCircle, Play } from "lucide-react";

export default function Dashboard() {
  return (
    <div
      className="h-140 w-full flex justify-center items-center gap-3"
    >
      <Link href="/categories" className="px-6 py-2 rounded-full border border-neutral-300 hover:border-neutral-500 cursor-pointer hover:bg-neutral-100">التصنيفات</Link>
      <Link href="/dashboard" className="px-6 py-2 rounded-full border border-neutral-300 hover:border-neutral-500 cursor-pointer hover:bg-neutral-100">لوحة التحكم</Link>
    </div>
  );
}