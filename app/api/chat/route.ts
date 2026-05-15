import { streamText } from "ai";
import { getModel, DEFAULT_MODEL } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { canSendMessage, recordUsage } from "@/lib/actions/usage";
import { type ModelId } from "@/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Usage limit check
    const canSend = await canSendMessage();
    if (!canSend) {
      return new Response(
        JSON.stringify({
          error: "Daily message limit reached. Upgrade to Pro for unlimited messages.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { messages, model: modelId } = await req.json();
    const selectedModel = (modelId as ModelId) ?? DEFAULT_MODEL;

    // Stream AI response
    const result = streamText({
      model: getModel(selectedModel),
      messages,
      onFinish: async ({ usage }) => {
        // Save usage asynchronously (non-blocking)
        await recordUsage(
          selectedModel,
          usage.inputTokens ?? 0,
          usage.outputTokens ?? 0
        );
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[Chat API Error]", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
