"use server";

import { createClient } from "@supabase/supabase-js";
import { checkAdminSession } from "./admin-auth";

// 1. Initialize Admin Client with SERVICE ROLE KEY
// This allows bypassing Row Level Security (RLS) to create users directly.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function generateRandomAccount() {
  // 2. Security Check: Ensure the requester is the Admin
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized: You must be logged in as admin." };
  }

  try {
    // 3. Generate Random Credentials
    const randomId = Math.floor(1000 + Math.random() * 9000); 
    const email = `client_${randomId}@code.ma`;
    const password = Math.random().toString(36).slice(-8); // 8 character random password

    // 4. CREATE USER IN SUPABASE DATABASE
    // This function adds the user to the 'auth.users' table in Supabase
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email so they can login immediately without checking inbox
    });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // 5. Return the credentials to the Admin UI
    return { success: true, email, password, userId: data.user.id };

  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user in database" };
  }
}