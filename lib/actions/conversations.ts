"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getConversations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("conversations")
    .select("id, title, model, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function createConversation(title?: string, model: string = "gpt-4o-mini") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title: title ?? "New Chat",
      model,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to create conversation" };

  redirect(`/chat/${data.id}`);
}

export async function renameConversation(id: string, title: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteConversation(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Delete messages first (cascade should handle this, but be safe)
  await supabase.from("messages").delete().eq("conversation_id", id);
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
