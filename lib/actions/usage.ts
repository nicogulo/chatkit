"use server";

import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type Plan } from "@/types";

export async function getUsageToday() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { count: 0, limit: PLAN_LIMITS.free.messagesPerDay };

  // Get user's plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";
  const limit = PLAN_LIMITS[plan].messagesPerDay;

  // Count messages today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  return { count: count ?? 0, limit };
}

export async function canSendMessage() {
  const { count, limit } = await getUsageToday();
  return count < limit;
}

export async function recordUsage(
  model: string,
  tokensInput: number,
  tokensOutput: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("usage").insert({
    user_id: user.id,
    model,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
  });
}
