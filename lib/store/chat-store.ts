import { create } from "zustand";
import type { Conversation, ModelId } from "@/types";

interface ChatState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Conversations
  conversations: Conversation[];
  setConversations: (convos: Conversation[]) => void;
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
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  conversations: [],
  setConversations: (convos) => set({ conversations: convos }),
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  selectedModel: "glm-4.7-flash",
  setSelectedModel: (model) => set({ selectedModel: model }),

  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
}));
