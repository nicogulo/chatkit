"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Forbidden — admin only");
  }

  return { supabase, userId: user.id };
}

export async function getAdminStats() {
  const { supabase } = await requireAdmin();

  const [users, conversations, messages, usage] = await Promise.all([
    supabase.from("profiles").select("id, plan, created_at", { count: "exact" }),
    supabase.from("conversations").select("id", { count: "exact" }),
    supabase.from("messages").select("id", { count: "exact" }),
    supabase.from("usage").select("tokens_input, tokens_output"),
  ]);

  const totalUsers = users.count ?? 0;
  const totalConversations = conversations.count ?? 0;
  const totalMessages = messages.count ?? 0;
  const planBreakdown = {
    free: users.data?.filter((u) => u.plan === "free").length ?? 0,
    pro: users.data?.filter((u) => u.plan === "pro").length ?? 0,
    enterprise: users.data?.filter((u) => u.plan === "enterprise").length ?? 0,
  };
  const totalTokensIn =
    usage.data?.reduce((sum, u) => sum + (u.tokens_input || 0), 0) ?? 0;
  const totalTokensOut =
    usage.data?.reduce((sum, u) => sum + (u.tokens_output || 0), 0) ?? 0;

  return {
    totalUsers,
    totalConversations,
    totalMessages,
    planBreakdown,
    totalTokensIn,
    totalTokensOut,
  };
}

export async function getAdminUsers(opts?: {
  search?: string;
  plan?: string;
  page?: number;
  perPage?: number;
}) {
  const { supabase } = await requireAdmin();

  const page = opts?.page ?? 1;
  const perPage = opts?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.search) {
    query = query.or(
      `display_name.ilike.%${opts.search}%,id.ilike.%${opts.search}%`
    );
  }
  if (opts?.plan && opts.plan !== "all") {
    query = query.eq("plan", opts.plan);
  }

  const { data, count } = await query;

  return {
    users: data ?? [],
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  };
}

export async function getAdminUserDetail(userId: string) {
  const { supabase } = await requireAdmin();

  const [profile, conversations, recentUsage] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("conversations")
      .select("id, title, model, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("usage")
      .select("model, tokens_input, tokens_output, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const totalTokens =
    recentUsage.data?.reduce(
      (s, u) => s + (u.tokens_input || 0) + (u.tokens_output || 0),
      0
    ) ?? 0;

  return {
    profile: profile.data,
    conversations: conversations.data ?? [],
    recentUsage: recentUsage.data ?? [],
    totalTokens,
  };
}

export async function adminUpdateUser(
  userId: string,
  updates: { plan?: string; role?: string; banned?: boolean }
) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  return data;
}

export async function adminDeleteUser(userId: string) {
  const { supabase } = await requireAdmin();

  // Delete user data
  await Promise.all([
    supabase.from("usage").delete().eq("user_id", userId),
    supabase.from("messages").delete().in(
      "conversation_id",
      (await supabase.from("conversations").select("id").eq("user_id", userId))
        .data?.map((c) => c.id) ?? []
    ),
    supabase.from("conversations").delete().eq("user_id", userId),
    supabase.from("subscriptions").delete().eq("user_id", userId),
  ]);

  // Delete profile
  await supabase.from("profiles").delete().eq("id", userId);

  // Note: to delete from auth.users, need Supabase admin API
  revalidatePath("/admin");
  return { success: true };
}
