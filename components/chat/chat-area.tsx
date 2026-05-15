"use client";

import { useState } from "react";
import { Send, ChevronDown, Sparkles, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const mockMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content:
      "Hello! I'm your AI assistant powered by ChatKit. How can I help you today? 🚀",
  },
  {
    id: "2",
    role: "user" as const,
    content: "Build me a todo app with React and TypeScript",
  },
  {
    id: "3",
    role: "assistant" as const,
    content: `Sure! Here's a clean Todo App with React and TypeScript:

\`\`\`typescript
"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
\`\`\`

This gives you a working todo app with add functionality. Want me to add delete and complete features?`,
  },
];

export function ChatArea({ conversationId }: { conversationId: string }) {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-sm font-medium">New Conversation</h1>
        <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          GPT-4o
          <ChevronDown className="h-3 w-3" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "glass"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t px-4 py-4">
        <div className="gradient-border mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message ChatKit..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />
            <button
              className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          ChatKit can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
