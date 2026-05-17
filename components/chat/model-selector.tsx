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
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition sm:py-1.5 sm:px-2.5"
      >
        <span className="max-w-[80px] truncate sm:max-w-none">{current.name}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-3 bottom-[70px] z-50 rounded-lg border border-border bg-card p-1 shadow-xl sm:fixed sm:inset-x-auto sm:bottom-auto sm:left-auto sm:right-0 sm:top-auto sm:mb-1 sm:w-52 sm:absolute sm:bottom-full"
            style={{ maxHeight: "50vh" }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: "calc(50vh - 16px)" }}>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
