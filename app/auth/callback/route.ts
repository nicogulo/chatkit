import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful email verification or OAuth callback
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Check if this is an email confirmation with error
  const error_code = searchParams.get("error_code");
  if (error_code) {
    const error_description = searchParams.get("error_description") ?? "Verification failed";
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description)}`
    );
  }

  // Return to login on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
