"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 1. Save a new result
export async function saveExamResult(data: {
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const isPassed = data.score >= (data.totalQuestions >= 40 ? 32 : Math.ceil(data.totalQuestions * 0.6));

  const { error } = await supabase.from("exam_results").insert({
    user_id: user.id,
    exam_id: data.examId,
    exam_title: data.examTitle,
    score: data.score,
    total_questions: data.totalQuestions,
    is_passed: isPassed
  });

  if (error) {
    console.error("Error saving result:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// 2. Fetch User History
export async function getUserHistory() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("exam_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}