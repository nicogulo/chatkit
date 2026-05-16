import { streamText } from "ai";
import { getModel, DEFAULT_MODEL } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { canSendMessage, recordUsage } from "@/lib/actions/usage";
import { type ModelId } from "@/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const canSend = await canSendMessage();
    if (!canSend) {
      return new Response(
        JSON.stringify({
          error: "Daily message limit reached. Upgrade to Pro for unlimited messages.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, model: modelId, conversationId } = await req.json();
    const selectedModel = (modelId as ModelId) ?? DEFAULT_MODEL;

    // Save user message to DB
    if (conversationId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: lastMsg.content,
          model: selectedModel,
        });

        // Auto-title from first message
        if (messages.length === 1) {
          const title = lastMsg.content.slice(0, 60) + (lastMsg.content.length > 60 ? "…" : "");
          await supabase
            .from("conversations")
            .update({ title })
            .eq("id", conversationId);
        }
      }
    }

    const result = streamText({
      model: getModel(selectedModel),
      messages,
      onFinish: async ({ usage, text }) => {
        // Save assistant message to DB
        if (conversationId) {
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: text,
            tokens_input: usage.inputTokens ?? 0,
            tokens_output: usage.outputTokens ?? 0,
            model: selectedModel,
          });

          // Update conversation timestamp
          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId);
        }

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
