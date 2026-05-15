import type { Conversation } from "@/types";

type ConversationGroup = {
  label: string;
  conversations: Conversation[];
};

export function groupConversationsByDate(
  conversations: Conversation[]
): ConversationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };

  for (const conv of conversations) {
    const updatedAt = new Date(conv.updated_at);

    if (updatedAt >= today) {
      groups["Today"].push(conv);
    } else if (updatedAt >= yesterday) {
      groups["Yesterday"].push(conv);
    } else if (updatedAt >= lastWeek) {
      groups["Last 7 Days"].push(conv);
    } else {
      groups["Older"].push(conv);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, conversations]) => ({ label, conversations }));
}
