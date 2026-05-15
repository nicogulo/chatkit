import { create } from "zustand";
import type { Conversation, ModelId } from "@/types";

interface ChatStore {
  // Sidebar
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;

  // Chat
  selectedModel: ModelId;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  setActiveConversation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedModel: (model: ModelId) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  searchQuery: "",
  selectedModel: "gpt-4o-mini",

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id
          ? null
          : state.activeConversationId,
    })),

  updateConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      ),
    })),

  setActiveConversation: (id) =>
    set({ activeConversationId: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedModel: (model) => set({ selectedModel: model }),
}));
