import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[128px]" />
      </div>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold gradient-text">
            ChatKit
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-8 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Simple, transparent{" "}
          <span className="gradient-text">pricing</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      {/* Plans */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.popular
                  ? "gradient-border glow-sm rounded-2xl bg-card p-8"
                  : "rounded-2xl border border-border/50 bg-card/50 p-8"
              }
            >
              {plan.popular && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block w-full rounded-xl py-2.5 text-center text-sm font-medium transition ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 glow"
                    : "border border-border/50 bg-card text-card-foreground hover:bg-card/80"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h4 className="font-medium text-foreground">{faq.q}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying things out",
    cta: "Get Started",
    features: [
      "20 messages per day",
      "GLM-4.7 Flash model",
      "Chat history",
      "GitHub OAuth",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    popular: true,
    description: "For power users and creators",
    cta: "Subscribe Now",
    features: [
      "Unlimited messages",
      "All AI models (GLM-5, GLM-4.7)",
      "Custom system prompts",
      "Priority support",
      "Advanced chat management",
    ],
  },
  {
    name: "Enterprise",
    price: "$49",
    description: "For teams and businesses",
    cta: "Contact Sales",
    features: [
      "Everything in Pro",
      "Team management",
      "API access",
      "Custom model fine-tuning",
      "SLA guarantee",
      "Dedicated support",
    ],
  },
];

const faqs = [
  {
    q: "Can I use my own API keys?",
    a: "Yes! ChatKit is a starter kit. You get the full source code and can configure any AI provider you want.",
  },
  {
    q: "Is there a one-time purchase option?",
    a: "ChatKit is available on Gumroad as a one-time purchase. You get lifetime access to all updates.",
  },
  {
    q: "Can I self-host?",
    a: "Absolutely. Deploy to Vercel, Railway, or any Node.js hosting. Supabase can be self-hosted too.",
  },
  {
    q: "Do I get the source code?",
    a: "Yes, full source code with TypeScript types, clean architecture, and documentation included.",
  },
];
