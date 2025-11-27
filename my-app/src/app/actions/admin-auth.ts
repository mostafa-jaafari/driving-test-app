"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin_access_token";
const MAX_AGE = 60 * 60 * 24; // 24 hours

export async function loginAdmin(pin: string) {
  // Check against the environment variable
  if (pin === process.env.ADMIN_ACCESS_KEY) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
    });
    return { success: true };
  }
  
  return { success: false, error: "كود غير صحيح" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function checkAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.has(COOKIE_NAME);
}