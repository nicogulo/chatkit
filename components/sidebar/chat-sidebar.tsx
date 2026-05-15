"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getConversations,
  createConversation,
  deleteConversation,
  renameConversation,
} from "@/lib/actions/conversations";
import { logout } from "@/lib/actions/auth-logout";
import { groupConversationsByDate } from "@/lib/utils/conversations";
import type { Conversation } from "@/types";

export function ChatSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const currentId = pathname.split("/chat/")[1] || "";

  const fetchConversations = useCallback(async () => {
    const data = await getConversations();
    setConversations(data as Conversation[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Refresh on route change
  useEffect(() => {
    if (pathname.startsWith("/chat")) {
      fetchConversations();
    }
  }, [pathname, fetchConversations]);

  const filtered = search
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  const groups = groupConversationsByDate(filtered);

  const handleNew = async () => {
    await createConversation();
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    if (currentId === id) {
      router.push("/chat");
    }
    fetchConversations();
  };

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/chat" className="text-lg font-bold gradient-text">
          ChatKit
        </Link>
        <button
          onClick={handleNew}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
          title="New Chat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-background px-3 py-2 text-sm border border-border focus:border-primary outline-none transition placeholder:text-muted-foreground"
        />
      </div>

      {/* Conversation list */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
        {loading ? (
          <div className="px-2 py-4 text-center text-xs text-muted-foreground">
            Loading...
          </div>
        ) : groups.length === 0 ? (
          <div className="px-2 py-4 text-center text-xs text-muted-foreground">
            {search ? "No results" : "No conversations yet"}
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-2">
              <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              {group.conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === currentId}
                  onDelete={() => handleDelete(conv.id)}
                  onRename={(title) => {
                    renameConversation(conv.id, title);
                    fetchConversations();
                  }}
                />
              ))}
            </div>
          ))
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              U
            </div>
            <div>
              <p className="text-xs font-medium">User</p>
              <p className="text-[10px] text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-background transition"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 8a5.5 5.5 0 01-.15 1.3l1.2.7a.3.3 0 01.07.38l-1.13 1.96a.3.3 0 01-.36.13l-1.4-.56a5.5 5.5 0 01-1.13.65l-.21 1.5a.3.3 0 01-.3.24H7.9a.3.3 0 01-.29-.24l-.22-1.5a5.5 5.5 0 01-1.12-.65l-1.41.56a.3.3 0 01-.36-.13L3.37 10.4a.3.3 0 01.07-.39l1.2-.7A5.5 5.5 0 014.5 8c0-.45.05-.88.15-1.3l-1.2-.7a.3.3 0 01-.07-.38l1.13-1.96a.3.3 0 01.36-.13l1.4.56a5.5 5.5 0 011.13-.65l.21-1.5a.3.3 0 01.3-.24h2.26a.3.3 0 01.29.24l.22 1.5c.42.16.8.38 1.12.65l1.41-.56a.3.3 0 01.36.13l1.13 1.96a.3.3 0 01-.07.39l-1.2.7c.1.42.15.85.15 1.3z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                title="Logout"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* Individual conversation item */
function ConversationItem({
  conversation,
  isActive,
  onDelete,
  onRename,
}: {
  conversation: Conversation;
  isActive: boolean;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const [showActions, setShowActions] = useState(false);

  const truncatedTitle =
    conversation.title.length > 28
      ? conversation.title.slice(0, 28) + "..."
      : conversation.title;

  const handleSubmitRename = () => {
    if (editTitle.trim() && editTitle !== conversation.title) {
      onRename(editTitle.trim());
    }
    setEditing(false);
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`group relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition cursor-pointer ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-background"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-50">
        <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 6h6M5 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {editing ? (
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSubmitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitRename();
            if (e.key === "Escape") setEditing(false);
          }}
          className="flex-1 bg-background px-1 py-0 text-sm border border-primary rounded outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Link href={`/chat/${conversation.id}`} className="flex-1 truncate">
          {truncatedTitle}
        </Link>
      )}

      {/* Action buttons */}
      {showActions && !editing && (
        <div className="absolute right-1.5 flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              setEditTitle(conversation.title);
            }}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-background transition"
            title="Rename"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            title="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5.3 4V2.7a.7.7 0 01.7-.7h4a.7.7 0 01.7.7V4M12 4v9.3a.7.7 0 01-.7.7H4.7a.7.7 0 01-.7-.7V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
