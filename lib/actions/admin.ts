"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

/** Create a service-role Supabase client that bypasses RLS */
async function createAdminClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

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
  const adminClient = await createAdminClient();

  const [users, conversations, messages, usage] = await Promise.all([
    adminClient.from("profiles").select("id, plan, created_at", { count: "exact" }),
    adminClient.from("conversations").select("id", { count: "exact" }),
    adminClient.from("messages").select("id", { count: "exact" }),
    adminClient.from("usage").select("tokens_input, tokens_output"),
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

  // Note: to delete from auth.users, need Supabase admin API
  revalidatePath("/admin");
  return { success: true };
}
