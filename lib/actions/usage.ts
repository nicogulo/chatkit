"use server";

import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type Plan } from "@/types";

export async function getUsageToday() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { count: 0, limit: PLAN_LIMITS.free.messagesPerDay, tokensIn: 0, tokensOut: 0 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";
  const limit = PLAN_LIMITS[plan].messagesPerDay;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  // Get token usage today
  const { data: tokenData } = await supabase
    .from("usage")
    .select("tokens_input, tokens_output")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  const tokensIn = tokenData?.reduce((sum, r) => sum + (r.tokens_input ?? 0), 0) ?? 0;
  const tokensOut = tokenData?.reduce((sum, r) => sum + (r.tokens_output ?? 0), 0) ?? 0;

  return { count: count ?? 0, limit, tokensIn, tokensOut };
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

export async function getUsageStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan ?? "free";

  // Last 7 days usage
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: weekData } = await supabase
    .from("usage")
    .select("model, tokens_input, tokens_output, created_at")
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // Per-model breakdown
  const byModel: Record<string, { count: number; tokensIn: number; tokensOut: number }> = {};
  // Per-day breakdown
  const byDay: Record<string, { count: number; tokensIn: number; tokensOut: number }> = {};

  let totalTokensIn = 0;
  let totalTokensOut = 0;

  for (const row of weekData ?? []) {
    const model = row.model ?? "unknown";
    const day = new Date(row.created_at).toISOString().split("T")[0];

    if (!byModel[model]) byModel[model] = { count: 0, tokensIn: 0, tokensOut: 0 };
    byModel[model].count++;
    byModel[model].tokensIn += row.tokens_input ?? 0;
    byModel[model].tokensOut += row.tokens_output ?? 0;

    if (!byDay[day]) byDay[day] = { count: 0, tokensIn: 0, tokensOut: 0 };
    byDay[day].count++;
    byDay[day].tokensIn += row.tokens_input ?? 0;
    byDay[day].tokensOut += row.tokens_output ?? 0;

    totalTokensIn += row.tokens_input ?? 0;
    totalTokensOut += row.tokens_output ?? 0;
  }

  // Total messages all-time
  const { count: totalMessages } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return {
    plan,
    totalMessages: totalMessages ?? 0,
    weekMessages: weekData?.length ?? 0,
    totalTokensIn,
    totalTokensOut,
    byModel,
    byDay,
    dailyLimit: PLAN_LIMITS[plan].messagesPerDay,
  };
}
