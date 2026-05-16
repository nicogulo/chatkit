import Link from "next/link";
import { ArrowRight, Zap, Shield, MessageSquare, CreditCard, History, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[128px]" />
      </div>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ChatKit</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="hidden text-sm text-muted-foreground hover:text-foreground transition sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="glow rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
        <div className="glow-sm mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm text-muted-foreground backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5 text-primary" />
          Ship your AI product in hours, not months
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Build your{" "}
          <span className="gradient-text">AI Chat product</span>{" "}
          with Next.js
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Production-ready starter kit with multi-model AI streaming, Stripe billing,
          Supabase auth, and a premium dark UI. Clone → configure → deploy.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </div>

        {/* Social proof */}
        <div className="mt-16 flex flex-col items-center gap-3">
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
        </div>
      </section>

      {/* Chat Preview Mock */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <div className="glow rounded-2xl border border-border/50 bg-card/80 p-1 backdrop-blur-sm">
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
                  Quantum computing uses <span className="text-foreground font-medium">qubits</span> instead of classical bits...
                  <span className="inline-block w-1.5 animate-pulse bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to <span className="gradient-text">launch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Not a template. A production-ready codebase with best practices baked in.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group gradient-border rounded-xl bg-card/50 p-6 backdrop-blur-sm transition hover:bg-card/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Modern Tech Stack</h2>
          <p className="mt-4 text-muted-foreground">
            Built with the latest and greatest. No legacy bloat.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS v4",
            "shadcn/ui v4",
            "Supabase",
            "AI SDK v6",
            "GLM Models",
            "Stripe",
            "Zustand",
            "Framer Motion",
          ].map((tech) => (
            <span
              key={tech}
              className="gradient-border rounded-lg bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition hover:text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="glow rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to ship your AI product?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Get the complete codebase. Add your API keys. Deploy to Vercel. Done.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="glow rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Get Started Free →
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-border/50 bg-card px-8 py-3.5 text-base font-semibold text-card-foreground hover:bg-card/80 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium gradient-text">ChatKit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ChatKit. Built with Next.js + Supabase + AI SDK
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Multi-Model AI",
    description:
      "GLM-5, GLM-4.7, and GLM-4.7 Flash via ZAI API. Switch models with a dropdown. Streaming responses out of the box.",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "Token-by-token streaming with markdown rendering, code syntax highlighting, and copy buttons. Just like ChatGPT.",
  },
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Supabase Auth with email/password and GitHub OAuth. Protected routes, session management, and middleware.",
  },
  {
    icon: CreditCard,
    title: "Stripe Billing",
    description:
      "Subscriptions with Free, Pro, and Enterprise tiers. Customer portal, webhooks, and usage tracking built in.",
  },
  {
    icon: History,
    title: "Chat History",
    description:
      "Persistent conversations stored in Supabase. Search, rename, delete. Auto-titled from first message.",
  },
  {
    icon: MessageSquare,
    title: "Premium UI",
    description:
      "Dark theme with AI gradient glow, glassmorphism, and smooth animations. Responsive and accessible.",
  },
];
