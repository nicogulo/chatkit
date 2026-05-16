// ChatKit — Type Definitions

export type Plan = "free" | "pro" | "enterprise";
export type MessageRole = "user" | "assistant" | "system";
export type ModelId = "glm-5" | "glm-4.7" | "glm-4.7-flash";
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
  description: string;
  minPlan: Plan;
}

export const MODELS: ModelConfig[] = [
  {
    id: "glm-4.7-flash",
    name: "GLM-4.7 Flash",
    description: "Fast & lightweight",
    minPlan: "free",
  },
  {
    id: "glm-4.7",
    name: "GLM-4.7",
    description: "Balanced performance",
    minPlan: "free",
  },
  {
    id: "glm-5",
    name: "GLM-5",
    description: "Most capable",
    minPlan: "pro",
  },
];

export const PLAN_LIMITS: Record<Plan, { messagesPerDay: number }> = {
  free: { messagesPerDay: 20 },
  pro: { messagesPerDay: Infinity },
  enterprise: { messagesPerDay: Infinity },
};
