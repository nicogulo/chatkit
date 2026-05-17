import Link from "next/link";
import { Zap, Shield, MessageSquare, CreditCard, History, Sparkles } from "lucide-react";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection, ChatPreviewSection } from "@/components/landing/hero-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[128px]" />
      </div>

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <HeroSection />

      {/* Chat Preview Mock */}
      <ChatPreviewSection />

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Everything you need to <span className="gradient-text">launch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-muted-foreground">
            Not a template. A production-ready codebase with best practices baked in.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group gradient-border rounded-xl bg-card/50 p-5 sm:p-6 backdrop-blur-sm transition hover:bg-card/80"
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
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Modern Tech Stack</h2>
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
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="glow rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-8 sm:p-12 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Ready to ship your AI product?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-muted-foreground">
            Get the complete codebase. Add your API keys. Deploy to Vercel. Done.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/register"
              className="glow w-full rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition sm:w-auto"
            >
              Get Started Free →
            </Link>
            <Link
              href="/pricing"
              className="w-full rounded-xl border border-border/50 bg-card px-8 py-3.5 text-base font-semibold text-card-foreground hover:bg-card/80 transition sm:w-auto"
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
