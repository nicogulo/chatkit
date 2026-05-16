import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan ?? "free";
    const isPro = plan === "pro" || plan === "enterprise";

    // Count messages today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    const limit = isPro ? Infinity : 20;

    return NextResponse.json({
      count: count ?? 0,
      limit,
    });
  } catch (error) {
    console.error("[Billing Usage Error]", error);
    return NextResponse.json({ count: 0, limit: 20 });
  }
}
