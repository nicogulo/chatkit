"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TypewriterText, TypingChatBubble } from "./animations";
import { LogoMarquee } from "./logo-marquee";

export function HeroSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24 sm:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glow-sm mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2 sm:text-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Ship your AI product in hours, not months
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-4xl text-3xl font-bold tracking-tight leading-tight overflow-hidden sm:text-5xl lg:text-7xl"
      >
        Build your{" "}
        <TypewriterText
          texts={["AI Chat product", "SaaS in a weekend", "next unicorn", "revenue machine"]}
          speed={70}
          deleteSpeed={35}
          pauseMs={2500}
          className="gradient-text"
        />
        <br />
        with Next.js
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
      >
        Production-ready starter kit with multi-model AI streaming, Stripe billing,
        Supabase auth, and a premium dark UI. Clone → configure → deploy.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
      >
        <Link
          href="/register"
          className="glow group flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition sm:px-8 sm:py-3 sm:text-base sm:py-3.5"
        >
          Get Started Free
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </Link>
        <Link
          href="/chat"
          className="gradient-border rounded-xl bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground hover:bg-card/80 transition sm:px-8 sm:py-3 sm:text-base sm:py-3.5"
        >
          Live Demo
        </Link>
      </motion.div>

      {/* Company logos marquee */}
      <LogoMarquee />
    </section>
  );
}

export function ChatPreviewSection() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glow rounded-2xl border border-border/50 bg-card/80 p-1 backdrop-blur-sm"
      >
        <div className="rounded-xl bg-background p-4 sm:p-6">
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
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2.5 text-xs sm:max-w-[70%] sm:px-4 sm:text-sm text-primary-foreground">
                Explain quantum computing in simple terms
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-border/50 bg-card px-3 py-2.5 text-xs sm:max-w-[80%] sm:px-4 sm:text-sm text-muted-foreground">
                <LoopingChatBubble />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Chat bubble that loops: type → pause 2s → clear → type again */
function LoopingChatBubble() {
  const [key, setKey] = useState(0);

  return (
    <TypingChatBubble
      key={key}
      text="Quantum computing uses qubits instead of classical bits. A qubit can be 0, 1, or both simultaneously — called superposition. This lets quantum computers explore many solutions at once, solving certain problems exponentially faster."
      delay={500}
      speed={20}
      onComplete={() => setTimeout(() => setKey((k) => k + 1), 2000)}
    />
  );
}
