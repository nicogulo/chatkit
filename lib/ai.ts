import { createOpenAI } from "@ai-sdk/openai";
import type { ModelId } from "@/types";

/**
 * Model registry — uses GLM (ZAI) API via OpenAI-compatible endpoint.
 * API key in .env.local as ZAI_API_KEY.
 */

const zai = createOpenAI({
  baseURL: "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.ZAI_API_KEY ?? "",
});

export function getModel(modelId: ModelId) {
  return zai(modelId);
}

export const DEFAULT_MODEL: ModelId = "glm-4.7-flash";
