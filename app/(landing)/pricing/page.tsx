export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold">
          Simple, transparent <span className="gradient-text">pricing</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { name: "Free", price: "$0", features: ["10 messages/day", "GPT-4o mini", "Chat history"] },
            { name: "Pro", price: "$19", popular: true, features: ["Unlimited messages", "All AI models", "Priority support", "Custom system prompts"] },
            { name: "Enterprise", price: "$49", features: ["Everything in Pro", "Team management", "API access", "Custom models", "SLA guarantee"] },
          ].map((plan) => (
            <div
              key={plan.name}
              className={plan.popular ? "gradient-border rounded-xl bg-card p-8 glow-sm" : "rounded-xl bg-card p-8 border border-border"}
            >
              {plan.popular && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">
                {plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                {plan.name === "Free" ? "Get Started" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
