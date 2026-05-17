import { getAdminStats } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Users,
  MessageSquare,
  BarChart3,
  Zap,
} from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      sub: `${stats.planBreakdown.free} free · ${stats.planBreakdown.pro} pro · ${stats.planBreakdown.enterprise} enterprise`,
    },
    {
      label: "Conversations",
      value: stats.totalConversations,
      icon: MessageSquare,
      sub: "Total created",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      icon: BarChart3,
      sub: "All-time total",
    },
    {
      label: "Tokens Used",
      value: `${((stats.totalTokensIn + stats.totalTokensOut) / 1_000_000).toFixed(2)}M`,
      icon: Zap,
      sub: `${stats.totalTokensIn.toLocaleString()} in · ${stats.totalTokensOut.toLocaleString()} out`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your ChatKit instance
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border/50 bg-card/50 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
