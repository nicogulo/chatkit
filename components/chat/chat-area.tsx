"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Send, Loader2, PanelLeft, Sparkles, Brain, Atom, Wand, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/lib/store/chat-store";
import { getMessages, createConversation } from "@/lib/actions/conversations";
import { ModelSelector, ModelPill } from "./model-selector";

/** Extract text from UIMessage parts (AI SDK v6) */
function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function dbMessagesToUIMessages(dbMessages: Array<{ role: string; content: string; created_at: string }>): UIMessage[] {
  return dbMessages.map((msg, i) => ({
    id: `hist-${i}`,
    role: msg.role as "user" | "assistant",
    parts: [{ type: "text" as const, text: msg.content }],
    createdAt: new Date(msg.created_at),
  }));
}

function MessageSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <div
            className={`rounded-2xl px-5 py-3.5 ${i % 2 === 0 ? "bg-primary/20" : "bg-card border border-border"}`}
            style={{ width: `${i % 2 === 0 ? 55 : 75}%` }}
          >
            <div className="flex flex-wrap gap-y-2">
              <div className="h-3 rounded-full bg-muted animate-pulse" style={{ width: `${55 + Math.random() * 30}%` }} />
              <div className="h-3 rounded-full bg-muted animate-pulse" style={{ width: `${45 + Math.random() * 35}%` }} />
              {i % 2 === 1 && (
                <div className="h-3 rounded-full bg-muted animate-pulse" style={{ width: `${60 + Math.random() * 25}%` }} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Claude-style thinking indicator with rotating phrases */
function ThinkingIndicator() {
  const phrases = [
    { icon: Brain, text: "Thinking..." },
    { icon: Atom, text: "Analyzing your question..." },
    { icon: Wand, text: "Crafting a response..." },
    { icon: Lightbulb, text: "Connecting the dots..." },
    { icon: Sparkles, text: "Almost there..." },
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const current = phrases[phraseIdx];
  const Icon = current.icon;

  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-card border border-primary/20 px-4 py-3 text-sm">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary animate-pulse" />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={phraseIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-muted-foreground"
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/** Typing cursor for streaming assistant messages */
function TypingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      className="inline-block w-[2px] h-[1.1em] bg-primary ml-0.5 align-middle rounded-full"
    />
  );
}

// ─── Welcome Screen (no conversation, no useChat) ───
function WelcomeScreen() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar, selectedModel, setConversations, conversations } = useChatStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const text = input.trim();
    setSending(true);

    try {
      const result = await createConversation(text.slice(0, 60));
      if (result && "id" in result) {
        const now = new Date().toISOString();
        setConversations([{
          id: result.id,
          user_id: "",
          title: text.slice(0, 60) + (text.length > 60 ? "…" : ""),
          model: selectedModel,
          system_prompt: null,
          created_at: now,
          updated_at: now,
        }, ...conversations]);
        // Soft navigate — no page reload
        router.push(`/chat/${result.id}?send=${encodeURIComponent(text)}`);
      }
    } catch {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
        <button onClick={toggleSidebar} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <PanelLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium gradient-text truncate">New Chat</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
          <h1 className="text-2xl font-bold gradient-text sm:text-3xl">ChatKit</h1>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs text-center sm:text-sm sm:max-w-md">
          Start a conversation or select one from the sidebar.
        </p>
      </div>

      <div className="border-t border-border p-2 sm:p-4">
        <form onSubmit={handleSend} className="mx-auto max-w-3xl">
          <div className="mb-1.5 flex items-center">
            <ModelPill />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex-1 min-w-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder="Send a message..."
                rows={1}
                disabled={sending}
                className="w-full resize-none rounded-xl bg-card px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/50 transition placeholder:text-muted-foreground/60 disabled:opacity-50 sm:px-4 sm:py-3"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="glow shrink-0 rounded-xl bg-primary h-[42px] w-[42px] sm:h-[44px] sm:w-[44px] flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Chat View (has conversation, uses useChat) ───
function ChatView({ conversationId }: { conversationId: string }) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sidebarOpen, toggleSidebar, selectedModel, setConversations, conversations } = useChatStore();
  const [input, setInput] = useState("");
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/chat",
      body: { model: selectedModel, conversationId },
    }),
    [selectedModel, conversationId]
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({
    id: conversationId,
    transport,
    onError: (err) => console.error("[Chat Error]", err),
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  // Load chat history
  useEffect(() => {
    if (historyLoaded === conversationId) return;
    let cancelled = false;
    setLoadingHistory(true);

    getMessages(conversationId).then((data) => {
      if (cancelled) return;
      if (data && data.length > 0) {
        setMessages(dbMessagesToUIMessages(data as Array<{ role: string; content: string; created_at: string }>));
      } else {
        setMessages([]);
      }
      setHistoryLoaded(conversationId);
      setLoadingHistory(false);

      // Auto-send message from welcome screen (?send=...)
      const sendParam = searchParams.get("send");
      if (sendParam) {
        // Clean URL
        router.replace(`/chat/${conversationId}`);
        // Send after a short delay to let useChat initialize
        setTimeout(() => sendMessage({ text: sendParam }), 300);
      }
    });

    return () => { cancelled = true; };
  }, [conversationId, historyLoaded, setMessages, sendMessage]);

  useEffect(() => {
    if (isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      const text = input.trim();
      setInput("");
      sendMessage({ text });

      // Update sidebar title from first message
      const convo = conversations.find((c) => c.id === conversationId);
      if (convo && convo.title === "New Chat") {
        const title = text.slice(0, 60) + (text.length > 60 ? "…" : "");
        setConversations((prev: import("@/types").Conversation[]) =>
          prev.map((c: import("@/types").Conversation) => c.id === conversationId ? { ...c, title } : c)
        );
      }
    },
    [input, isLoading, sendMessage, conversationId, conversations, setConversations]
  );

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
        <button onClick={toggleSidebar} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <PanelLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-foreground truncate">Chat</span>
        {loadingHistory && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingHistory ? (
          <MessageSkeleton count={4} />
        ) : (
          <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, i) => {
                  const isStreaming = isLoading && message.role === "assistant" && i === messages.length - 1;
                  const msgText = getMessageText(message);

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[85%] sm:px-4 sm:py-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                        {message.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                const code = String(children).replace(/\n$/, "");
                                const blockId = `block-${i}`;
                                if (match) {
                                  return (
                                    <div className="relative group my-3">
                                      <div className="flex items-center justify-between rounded-t-lg bg-[#282c34] px-4 py-1.5 text-xs text-gray-400">
                                        <span>{match[1]}</span>
                                        <button onClick={() => copyCode(code, blockId)} className="text-xs text-gray-400 hover:text-white transition">
                                          {copiedBlock === blockId ? "Copied!" : "Copy"}
                                        </button>
                                      </div>
                                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" customStyle={{ margin: 0, borderRadius: "0 0 0.5rem 0.5rem" }}>
                                        {code}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                }
                                return <code className="rounded bg-muted px-1.5 py-0.5 text-xs" {...props}>{children}</code>;
                              },
                            }}>
                              {msgText}
                            </ReactMarkdown>
                            {isStreaming && <TypingCursor />}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isLoading && messages[messages.length - 1]?.role === "user" && !error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <ThinkingIndicator />
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive max-w-md text-center">
                    Failed to get response. Please try again.
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="mb-1.5 flex items-center">
            <ModelPill />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                placeholder="Send a message..."
                rows={1}
                className="w-full resize-none rounded-xl bg-card px-3 py-2.5 text-sm outline-none border border-border focus:border-primary/50 transition placeholder:text-muted-foreground/60 sm:px-4 sm:py-3"
              />
            </div>
            <button type="submit" disabled={isLoading || !input.trim()} className="glow shrink-0 rounded-xl bg-primary h-[42px] w-[42px] sm:h-[44px] sm:w-[44px] flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ChatArea Router ───
export function ChatArea() {
  const params = useParams();
  const conversationId = params?.id as string | undefined;

  if (!conversationId) {
    return <WelcomeScreen />;
  }

  return <ChatView conversationId={conversationId} />;
}
