"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Verify current user is admin — throws if not */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const adminClient = await createAdminClient();
  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[requireAdmin] profile fetch error:", error.message);
    throw new Error("Forbidden — admin only");
  }

  if (!profile || profile.role !== "admin") {
    throw new Error("Forbidden — admin only");
  }

  return { userId: user.id };
}

export async function getAdminStats() {
  await requireAdmin();
  const adminClient = await createAdminClient();

  const [users, conversations, messages, usage] = await Promise.all([
    adminClient.from("profiles").select("id, plan, created_at", { count: "exact" }),
    adminClient.from("conversations").select("id", { count: "exact" }),
    adminClient.from("messages").select("id", { count: "exact" }),
    adminClient.from("usage").select("tokens_input, tokens_output"),
  ]);

  if (users.error) console.error("[getAdminStats] users error:", users.error.message);
  if (conversations.error) console.error("[getAdminStats] conversations error:", conversations.error.message);
  if (messages.error) console.error("[getAdminStats] messages error:", messages.error.message);
  if (usage.error) console.error("[getAdminStats] usage error:", usage.error.message);

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
  await requireAdmin();
  const adminClient = await createAdminClient();

  const page = opts?.page ?? 1;
  const perPage = opts?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = adminClient
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

  const { data, count, error } = await query;

  if (error) console.error("[getAdminUsers] error:", error.message);

  return {
    users: data ?? [],
    total: count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((count ?? 0) / perPage),
  };
}

export async function getAdminUserDetail(userId: string) {
  await requireAdmin();
  const adminClient = await createAdminClient();

  const [profile, conversations, recentUsage] = await Promise.all([
    adminClient.from("profiles").select("*").eq("id", userId).single(),
    adminClient
      .from("conversations")
      .select("id, title, model, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    adminClient
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
  await requireAdmin();
  const adminClient = await createAdminClient();

  const { data, error } = await adminClient
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
  await requireAdmin();
  const adminClient = await createAdminClient();

  // Delete user data
  await Promise.all([
    adminClient.from("usage").delete().eq("user_id", userId),
    adminClient.from("messages").delete().in(
      "conversation_id",
      (await adminClient.from("conversations").select("id").eq("user_id", userId))
        .data?.map((c) => c.id) ?? []
    ),
    adminClient.from("conversations").delete().eq("user_id", userId),
    adminClient.from("subscriptions").delete().eq("user_id", userId),
  ]);

  // Delete profile
  await adminClient.from("profiles").delete().eq("id", userId);

  revalidatePath("/admin");
  return { success: true };
}
