"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Loader2,
  CreditCard,
  ExternalLink,
  ArrowLeft,
  Crown,
  Zap,
} from "lucide-react";

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface UsageData {
  count: number;
  limit: number;
}

function BillingContent() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageData>({ count: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL params for success/cancel messages
    const billing = searchParams.get("billing");
    if (billing === "success") setMessage("🎉 Subscription activated successfully!");
    if (billing === "cancelled") setMessage("Checkout cancelled.");

    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      const [usageRes, subRes] = await Promise.all([
        fetch("/api/billing/usage"),
        fetch("/api/billing/subscription"),
      ]);

      if (usageRes.ok) {
        const data = await usageRes.json();
        setUsage(data);
      }

      if (subRes.ok) {
        const data = await subRes.json();
        if (data.subscription) setSubscription(data.subscription);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    } finally {
      setUpgrading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = subscription?.plan ?? "free";
  const usagePercent = usage.limit === Infinity ? 0 : (usage.count / usage.limit) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Settings
            </Link>
            <span className="text-lg font-semibold">Billing</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {message && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      currentPlan === "pro" || currentPlan === "enterprise"
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-muted"
                    }`}
                  >
                    {currentPlan === "pro" || currentPlan === "enterprise" ? (
                      <Crown className="h-5 w-5 text-white" />
                    ) : (
                      <Zap className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold capitalize">
                      {currentPlan} Plan
                    </h2>
                    {subscription ? (
                      <p className="text-xs text-muted-foreground">
                        {subscription.cancel_at_period_end
                          ? `Cancels ${new Date(subscription.current_period_end).toLocaleDateString()}`
                          : `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {usage.limit === Infinity
                          ? "Unlimited messages"
                          : `${usage.limit} messages per day`}
                      </p>
                    )}
                  </div>
                </div>

                {subscription && (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                  >
                    {portalLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                    Manage
                  </button>
                )}
              </div>
            </div>

            {/* Usage */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="font-semibold">Usage Today</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Messages sent</span>
                  <span>
                    {usage.count}{" "}
                    {usage.limit === Infinity ? "(unlimited)" : `/ ${usage.limit}`}
                  </span>
                </div>
                {usage.limit !== Infinity && (
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        usagePercent > 80 ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Upgrade Plans */}
            {currentPlan === "free" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Upgrade</h3>
                {[
                  {
                    id: "pro",
                    name: "Pro",
                    price: "$19/mo",
                    features: [
                      "Unlimited messages",
                      "All AI models (GLM-5, GLM-4.7)",
                      "Custom system prompts",
                      "Priority support",
                    ],
                  },
                  {
                    id: "enterprise",
                    name: "Enterprise",
                    price: "$49/mo",
                    features: [
                      "Everything in Pro",
                      "Team management",
                      "API access",
                      "SLA guarantee",
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.id}
                    className="gradient-border rounded-xl bg-card/50 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{plan.name}</h4>
                          {plan.id === "pro" && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-2xl font-bold">{plan.price}</p>
                      </div>
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={upgrading === plan.id}
                        className="glow flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {upgrading === plan.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5" />
                        )}
                        Subscribe
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                      {plan.features.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
