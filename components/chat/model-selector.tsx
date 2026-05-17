"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MODELS } from "@/types";
import { useChatStore } from "@/lib/store/chat-store";
import type { ModelId } from "@/types";

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition border border-border/50"
      >
        <span className="max-w-[120px] truncate">{current.name}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 w-52 rounded-lg border border-border bg-card p-1 shadow-xl z-50"
          >
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id as ModelId);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs hover:bg-muted/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{model.name}</div>
                  <div className="text-muted-foreground truncate">{model.description}</div>
                </div>
                {selectedModel === model.id && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact inline pill — goes above the textarea in the input area */
export function ModelPill() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground/80 hover:text-foreground hover:bg-muted/50 transition"
      >
        {current.name}
        <ChevronDown className={`h-2.5 w-2.5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1.5 w-48 rounded-lg border border-border bg-card p-1 shadow-xl z-50"
          >
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id as ModelId);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] hover:bg-muted/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground">{model.name}</span>
                  <span className="text-muted-foreground ml-1">{model.description}</span>
                </div>
                {selectedModel === model.id && (
                  <Check className="h-3 w-3 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
