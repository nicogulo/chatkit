import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// One-time migration: add role + banned columns to profiles
export async function GET() {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if already admin (after first run)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return NextResponse.json({ message: "Already migrated and admin" });
  }

  // First run: use service role to alter table
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // Direct SQL via PostgREST won't work for DDL.
  // Instead, let's try to update with the new columns - if they exist
  // This requires the columns to be added manually via Supabase SQL Editor.

  return NextResponse.json({
    message: "Run this SQL in Supabase SQL Editor:",
    sql: [
      "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' NOT NULL;",
      "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false NOT NULL;",
      `UPDATE profiles SET role = 'admin' WHERE id = '${user.id}';`,
    ],
    userId: user.id,
  });
}
