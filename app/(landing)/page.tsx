import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-xl font-bold gradient-text">ChatKit</span>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition"
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
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-32 text-center">
        <div className="glow-sm mx-auto mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          ✨ Ship your AI product in hours, not months
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Build your{" "}
          <span className="gradient-text">AI Chat product</span>{" "}
          with Next.js
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Production-ready starter kit with multi-model AI, Stripe billing,
          Supabase auth, and a beautiful dark UI. Clone, configure, deploy.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="glow rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Get Started Free →
          </Link>
          <Link
            href="/chat"
            className="gradient-border rounded-lg bg-card px-8 py-3 text-base font-semibold text-card-foreground hover:bg-card/80 transition"
          >
            Live Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">
          Everything you need to launch
        </h2>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="gradient-border rounded-xl bg-card p-6"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">Modern Tech Stack</h2>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS v4",
            "shadcn/ui",
            "Supabase",
            "Vercel AI SDK",
            "Stripe",
            "Zustand",
            "Framer Motion",
          ].map((tech) => (
            <span
              key={tech}
              className="gradient-border rounded-lg bg-card px-4 py-2 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 ChatKit. Built with Next.js + Supabase + AI SDK</p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🤖",
    title: "Multi-Model AI",
    description:
      "Switch between GPT-4o, Claude, and Gemini with one line of code. Vercel AI SDK handles the rest.",
  },
  {
    icon: "⚡",
    title: "Streaming Responses",
    description:
      "Real-time token streaming with markdown rendering and syntax highlighting. Just like ChatGPT.",
  },
  {
    icon: "🔐",
    title: "Authentication",
    description:
      "Supabase Auth with email, Google, and GitHub OAuth. Session management and protected routes.",
  },
  {
    icon: "💳",
    title: "Stripe Billing",
    description:
      "Subscriptions, usage-based pricing, and customer portal. Free, Pro, and Enterprise tiers.",
  },
  {
    icon: "💬",
    title: "Chat History",
    description:
      "Persistent conversations with search, rename, and delete. All stored in Supabase.",
  },
  {
    icon: "🎨",
    title: "Beautiful UI",
    description:
      "Dark theme with AI gradient glow, glassmorphism, and smooth animations. Looks premium.",
  },
];
