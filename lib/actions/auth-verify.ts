"use server";

import { createClient } from "@/lib/supabase/server";

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function checkEmailVerified() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { verified: false, email: null };

  return {
    verified: user.email_confirmed_at !== null,
    email: user.email ?? null,
  };
}
