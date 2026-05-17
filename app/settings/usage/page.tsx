"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Zap,
  Cpu,
  TrendingUp,
  Loader2,
  Crown,
} from "lucide-react";
import { type Plan, MODELS } from "@/types";

interface UsageStats {
  plan: Plan;
  totalMessages: number;
  weekMessages: number;
  totalTokensIn: number;
  totalTokensOut: number;
  byModel: Record<string, { count: number; tokensIn: number; tokensOut: number }>;
  byDay: Record<string, { count: number; tokensIn: number; tokensOut: number }>;
  dailyLimit: number;
}

export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/usage-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load usage data</p>
      </div>
    );
  }

  const days = Object.keys(stats.byDay).sort();
  const maxDayCount = Math.max(...Object.values(stats.byDay).map((d) => d.count), 1);

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
            <span className="text-lg font-semibold">Usage Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                stats.plan === "pro"
                  ? "bg-primary/10 text-primary"
                  : stats.plan === "enterprise"
                  ? "bg-accent/10 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stats.plan === "pro" ? "⭐ Pro" : stats.plan === "enterprise" ? "👑 Enterprise" : "Free"}
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<MessageSquare className="h-4 w-4" />}
            label="Total Messages"
            value={stats.totalMessages.toLocaleString()}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Last 7 Days"
            value={stats.weekMessages.toLocaleString()}
          />
          <StatCard
            icon={<Cpu className="h-4 w-4" />}
            label="Tokens In"
            value={formatTokens(stats.totalTokensIn)}
          />
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Tokens Out"
            value={formatTokens(stats.totalTokensOut)}
          />
        </div>

        {/* Daily Limit */}
        {stats.dailyLimit !== Infinity && (
          <div className="mt-6 rounded-xl border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Daily Limit</span>
              </div>
              <Link
                href="/settings/billing"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Crown className="h-3 w-3" />
                Upgrade for unlimited
              </Link>
            </div>
            <p className="text-2xl font-bold">
              {stats.dailyLimit === Infinity ? "∞" : `${stats.dailyLimit}`}{" "}
              <span className="text-sm font-normal text-muted-foreground">messages/day</span>
            </p>
          </div>
        )}

        {/* 7-Day Chart */}
        {days.length > 0 && (
          <div className="mt-6 rounded-xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-medium mb-4">7-Day Activity</h3>
            <div className="flex items-end gap-2 h-32">
              {days.map((day) => {
                const d = stats.byDay[day];
                const height = (d.count / maxDayCount) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{d.count}</span>
                    <div className="w-full relative">
                      <div
                        className="w-full rounded-t bg-primary/80 transition-all"
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Model Breakdown */}
        {Object.keys(stats.byModel).length > 0 && (
          <div className="mt-6 rounded-xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-medium mb-4">Model Usage</h3>
            <div className="space-y-3">
              {Object.entries(stats.byModel)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([model, data]) => {
                  const modelInfo = MODELS.find((m) => m.id === model);
                  return (
                    <div key={model} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {modelInfo?.name ?? model}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {data.count} msgs · {formatTokens(data.tokensIn + data.tokensOut)} tokens
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-1.5 rounded-full bg-primary/60"
                          style={{
                            width: `${(data.count / stats.weekMessages) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {stats.totalMessages === 0 && (
          <div className="mt-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No usage data yet. Start chatting to see your stats!
            </p>
            <Link
              href="/chat"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Go to Chat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
