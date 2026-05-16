"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TypewriterText, TypingChatBubble } from "./animations";

export function HeroSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glow-sm mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm text-muted-foreground backdrop-blur-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Ship your AI product in hours, not months
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
      >
        Build your{" "}
        <span className="gradient-text">
          <TypewriterText
            texts={["AI Chat product", "SaaS in a weekend", "next unicorn", "revenue machine"]}
            speed={70}
            deleteSpeed={35}
            pauseMs={2500}
          />
        </span>
        {" "}with Next.js
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
      >
        Production-ready starter kit with multi-model AI streaming, Stripe billing,
        Supabase auth, and a premium dark UI. Clone → configure → deploy.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link
          href="/register"
          className="glow group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/chat"
          className="gradient-border rounded-xl bg-card px-8 py-3.5 text-base font-semibold text-card-foreground hover:bg-card/80 transition"
        >
          Live Demo
        </Link>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 flex flex-col items-center gap-3"
      >
        <div className="flex -space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-accent/60 text-xs font-bold text-white"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Trusted by <span className="text-foreground font-medium">500+</span> developers
        </p>
      </motion.div>
    </section>
  );
}

export function ChatPreviewSection() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glow rounded-2xl border border-border/50 bg-card/80 p-1 backdrop-blur-sm"
      >
        <div className="rounded-xl bg-background p-6">
          {/* Mock chat header */}
          <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-muted-foreground">ChatKit — New Chat</span>
          </div>
          {/* Mock messages */}
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                Explain quantum computing in simple terms
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <TypingChatBubble
                  text="Quantum computing uses qubits instead of classical bits. A qubit can be 0, 1, or both simultaneously — called superposition. This lets quantum computers explore many solutions at once, solving certain problems exponentially faster."
                  delay={800}
                  speed={20}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
