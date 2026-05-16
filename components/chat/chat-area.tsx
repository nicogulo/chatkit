"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Send, Loader2, PanelLeft, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/lib/store/chat-store";
import { getMessages, createConversation } from "@/lib/actions/conversations";
import { ModelSelector } from "./model-selector";
import { useRouter } from "next/navigation";

/** Extract text from UIMessage parts (AI SDK v6) */
function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/** Convert DB messages to UIMessage format */
function dbMessagesToUIMessages(dbMessages: Array<{ role: string; content: string; created_at: string }>): UIMessage[] {
  return dbMessages.map((msg, i) => ({
    id: `hist-${i}`,
    role: msg.role as "user" | "assistant",
    parts: [{ type: "text" as const, text: msg.content }],
    createdAt: new Date(msg.created_at),
  }));
}

/** Skeleton component for loading messages */
function MessageSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              i % 2 === 0
                ? "bg-primary/20"
                : "bg-card border border-border"
            }`}
          >
            <div className="space-y-2">
              <div
                className="h-3 rounded-full bg-muted animate-pulse"
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
              {Math.random() > 0.4 && (
                <div
                  className="h-3 rounded-full bg-muted animate-pulse"
                  style={{ width: `${40 + Math.random() * 40}%` }}
                />
              )}
              {Math.random() > 0.7 && (
                <div
                  className="h-3 rounded-full bg-muted animate-pulse"
                  style={{ width: `${20 + Math.random() * 30}%` }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatArea() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string | undefined;
  const { sidebarOpen, toggleSidebar, selectedModel } = useChatStore();
  const [input, setInput] = useState("");
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { model: selectedModel, conversationId },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedModel, conversationId]
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({
    id: conversationId ?? "new",
    transport,
    onError: (err) => {
      console.error("[Chat Error]", err);
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Load chat history when navigating to a conversation
  useEffect(() => {
    if (!conversationId || conversationId.startsWith("temp-")) {
      // New chat — clear messages immediately
      setMessages([]);
      setHistoryLoaded(conversationId ?? null);
      return;
    }
    if (historyLoaded === conversationId) return;

    let cancelled = false;
    setLoadingHistory(true);

    getMessages(conversationId).then((data) => {
      if (cancelled) return;
      if (data && data.length > 0) {
        const uiMsgs = dbMessagesToUIMessages(data as Array<{ role: string; content: string; created_at: string }>);
        setMessages(uiMsgs);
      } else {
        setMessages([]);
      }
      setHistoryLoaded(conversationId);
      setLoadingHistory(false);
    });

    return () => { cancelled = true; };
  }, [conversationId, historyLoaded, setMessages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingHistory]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      // If no conversation yet, create one first
      if (!conversationId) {
        try {
          const result = await createConversation(input.trim().slice(0, 60));
          if (result && "id" in result) {
            // Navigate to new conversation, then send message
            const newId = result.id;
            setHistoryLoaded(newId);
            router.push(`/chat/${newId}`);
            // Small delay to let URL update before sending
            setTimeout(() => sendMessage({ text: input.trim() }), 100);
            setInput("");
            return;
          }
        } catch (err) {
          console.error("[Create conversation failed]", err);
          return;
        }
      }

      sendMessage({ text: input.trim() });
      setInput("");
    },
    [input, isLoading, sendMessage, conversationId, router, setHistoryLoaded]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const inputElement = (
    <div className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            className="w-full resize-none rounded-xl bg-card px-4 py-3 text-sm outline-none border border-border focus:border-primary/50 transition placeholder:text-muted-foreground/60"
          />
        </div>
        <ModelSelector />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="glow rounded-xl bg-primary p-3 text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );

  // Empty state — no conversation selected
  if (!conversationId) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <span className="text-sm font-medium gradient-text">New Chat</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">ChatKit</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Start a conversation or select one from the sidebar.
          </p>
        </div>

        {inputElement}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
        <span className="text-sm font-medium text-foreground">Chat</span>
        {loadingHistory && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {loadingHistory ? (
          <MessageSkeleton count={4} />
        ) : (
          <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                const code = String(children).replace(/\n$/, "");
                                const blockId = `block-${i}`;

                                if (match) {
                                  return (
                                    <div className="relative group my-3">
                                      <div className="flex items-center justify-between rounded-t-lg bg-[#282c34] px-4 py-1.5 text-xs text-gray-400">
                                        <span>{match[1]}</span>
                                        <button
                                          onClick={() => copyCode(code, blockId)}
                                          className="text-xs text-gray-400 hover:text-white transition"
                                        >
                                          {copiedBlock === blockId
                                            ? "Copied!"
                                            : "Copy"}
                                        </button>
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: "0 0 0.5rem 0.5rem",
                                        }}
                                      >
                                        {code}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                }
                                return (
                                  <code
                                    className="rounded bg-muted px-1.5 py-0.5 text-xs"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {getMessageText(message)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">
                          {getMessageText(message)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading &&
                messages[messages.length - 1]?.role === "user" &&
                !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Thinking...
                    </div>
                  </motion.div>
                )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
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

      {inputElement}
    </div>
  );
}
