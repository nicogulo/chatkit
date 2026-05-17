import { create } from "zustand";
import type { Conversation, ModelId } from "@/types";

interface ChatState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Conversations
  conversations: Conversation[];
  setConversations: (convos: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Model
  selectedModel: ModelId;
  setSelectedModel: (model: ModelId) => void;

  // Editing
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Sidebar — default closed on mobile, open on desktop
  sidebarOpen: typeof window !== 'undefined' && window.innerWidth >= 768,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  conversations: [],
  setConversations: (input) =>
    set((state) => ({
      conversations: typeof input === "function" ? input(state.conversations) : input,
    })),
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  selectedModel: "glm-4.5-air",
  setSelectedModel: (model) => set({ selectedModel: model }),

  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
}));
