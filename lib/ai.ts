import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import type { ModelId } from "@/types";

/**
 * Model registry — maps model IDs to Vercel AI SDK model instances.
 * Add your API keys in .env.local to enable providers.
 */

export function getModel(modelId: ModelId) {
  switch (modelId) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "gpt-4o-mini":
      return openai("gpt-4o-mini");
    case "claude-sonnet-4-20250514":
      return anthropic("claude-sonnet-4-20250514");
    case "gemini-2.0-flash":
      return google("gemini-2.0-flash");
    default:
      // Fallback to GPT-4o Mini
      return openai("gpt-4o-mini");
  }
}

export const DEFAULT_MODEL: ModelId = "gpt-4o-mini";
