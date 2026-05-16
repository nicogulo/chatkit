"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  PanelLeftClose,
  Settings,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getConversations,
  createConversation,
  renameConversation,
  deleteConversation,
} from "@/lib/actions/conversations";
import { useChatStore } from "@/lib/store/chat-store";
import { createClient } from "@/lib/supabase/client";
import type { Conversation } from "@/types";

export function ChatSidebar() {
  const router = useRouter();
  const params = useParams();
  const {
    sidebarOpen,
    toggleSidebar,
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    editingId,
    setEditingId,
  } = useChatStore();

  const [search, setSearch] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Set active from URL
  useEffect(() => {
    const id = params?.id as string | undefined;
    if (id) setActiveConversationId(id);
  }, [params?.id, setActiveConversationId]);

  // Fetch conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const data = await getConversations();
    setConversations(data as Conversation[]);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Filter by search
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group by date
  const today = new Date();
  const groups: Record<string, Conversation[]> = {};
  for (const c of filtered) {
    const date = new Date(c.updated_at);
    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    let label: string;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Yesterday";
    else if (diffDays < 7) label = "This Week";
    else if (diffDays < 30) label = "This Month";
    else label = "Older";
    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  }

  // ✅ OPTIMISTIC: New chat — instant navigate, API in background
  const handleNew = async () => {
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    // Optimistic: add temp conversation to list
    const tempConvo: Conversation = {
      id: tempId,
      user_id: "",
      title: "New Chat",
      model: "glm-4.7-flash",
      system_prompt: null,
      created_at: now,
      updated_at: now,
    };
    setConversations([tempConvo, ...conversations]);
    setActiveConversationId(tempId);
    router.push(`/chat/${tempId}`);

    // Background API call
    try {
      const result = await createConversation();
      if (result && "id" in result) {
        // Replace temp with real
        setConversations((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: result.id } : c))
        );
        setActiveConversationId(result.id);
        router.replace(`/chat/${result.id}`);
      }
    } catch {
      // Rollback on failure
      setConversations((prev) => prev.filter((c) => c.id !== tempId));
      setActiveConversationId(null);
      router.push("/chat");
    }
  };

  // ✅ OPTIMISTIC: Rename — instant update title, API in background
  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    const oldTitle = conversations.find((c) => c.id === id)?.title;
    setEditingId(null);

    // Optimistic
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c))
    );

    try {
      await renameConversation(id, editTitle.trim());
    } catch {
      // Rollback
      if (oldTitle) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: oldTitle } : c))
        );
      }
    }
  };

  // ✅ OPTIMISTIC: Delete — instant remove, API in background
  const handleDelete = async (id: string) => {
    setDeleteConfirm(null);
    const wasActive = activeConversationId === id;

    // Optimistic: remove from list
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (wasActive) {
      setActiveConversationId(null);
      router.push("/chat");
    }

    // Background API call
    try {
      await deleteConversation(id);
    } catch {
      // Rollback by reloading
      loadConversations();
    }
  };

  const startEditing = (c: Conversation) => {
    setEditingId(c.id);
    setEditTitle(c.title);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen flex-shrink-0 overflow-hidden border-r border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex h-full w-[280px] flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <h2 className="text-sm font-semibold gradient-text">ChatKit</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNew}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={toggleSidebar}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md bg-muted/50 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
          {Object.entries(groups).map(([label, convos]) => (
            <div key={label} className="mb-3">
              <p className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {label}
              </p>
              {convos.map((c) => (
                <div
                  key={c.id}
                  className={`group relative flex items-center rounded-lg px-2 py-1.5 text-sm cursor-pointer transition ${
                    activeConversationId === c.id
                      ? "bg-gradient-to-r from-primary/10 to-transparent text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  onClick={() => {
                    if (editingId !== c.id) {
                      setActiveConversationId(c.id);
                      router.push(`/chat/${c.id}`);
                    }
                  }}
                >
                  <MessageSquare className="mr-2 h-3.5 w-3.5 flex-shrink-0" />

                  {editingId === c.id ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input
                        ref={editInputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(c.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 rounded bg-muted px-1.5 py-0.5 text-xs outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(c.id);
                        }}
                        className="p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate text-xs">{c.title}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(c);
                          }}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        {deleteConfirm === c.id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(c.id);
                            }}
                            className="rounded p-0.5 text-destructive hover:text-destructive/80"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(c.id);
                              setTimeout(() => setDeleteConfirm(null), 3000);
                            }}
                            className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-2 py-8 text-center text-xs text-muted-foreground/60">
              {search ? "No results" : "No conversations yet"}
            </div>
          )}
        </div>

        {/* User Menu — Bottom */}
        <div ref={userMenuRef} className="relative border-t border-border/50 p-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-accent/60 text-xs font-bold text-white">
              N
            </div>
            <span className="flex-1 truncate text-xs">Nico</span>
            <ChevronUp className={`h-3.5 w-3.5 transition ${userMenuOpen ? "" : "rotate-180"}`} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border border-border/50 bg-card p-1 shadow-xl"
              >
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/settings/billing");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                >
                  <User className="h-3.5 w-3.5" />
                  Billing
                </button>
                <div className="my-1 border-t border-border/30" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/5 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
