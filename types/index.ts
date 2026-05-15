// ChatKit — Type Definitions

export type Plan = "free" | "pro" | "enterprise";
export type MessageRole = "user" | "assistant" | "system";
export type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-sonnet-4-20250514"
  | "gemini-2.0-flash";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model: ModelId;
  system_prompt: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_input: number | null;
  tokens_output: number | null;
  model: string | null;
  created_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface ModelConfig {
  id: ModelId;
  name: string;
  provider: "openai" | "anthropic" | "google";
  description: string;
  minPlan: Plan;
}

export const MODELS: ModelConfig[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast & affordable",
    minPlan: "free",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Most capable OpenAI model",
    minPlan: "pro",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Balanced speed & intelligence",
    minPlan: "pro",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Fast multimodal by Google",
    minPlan: "free",
  },
];

export const PLAN_LIMITS: Record<Plan, { messagesPerDay: number }> = {
  free: { messagesPerDay: 10 },
  pro: { messagesPerDay: Infinity },
  enterprise: { messagesPerDay: Infinity },
};
