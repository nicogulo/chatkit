import { streamText, convertToModelMessages, createUIMessageStreamResponse } from "ai";
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

    const body = await req.json();
    const { messages: uiMessages, model: modelId, conversationId } = body;
    const selectedModel = (modelId as ModelId) ?? DEFAULT_MODEL;

    // Convert UI messages (parts-based) to model messages (content-based)
    const modelMessages = await convertToModelMessages(uiMessages);

    // Save user message to DB (background, non-blocking)
    if (conversationId && uiMessages?.length > 0) {
      const lastMsg = uiMessages[uiMessages.length - 1];
      if (lastMsg.role === "user") {
        const userText = lastMsg.parts
          ?.filter((p: { type: string }) => p.type === "text")
          ?.map((p: { text: string }) => p.text)
          ?.join("") ?? "";

        supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            role: "user",
            content: userText,
            model: selectedModel,
          })
          .then(() => {
            // Auto-title from first message
            if (uiMessages.length === 1 && userText) {
              const title = userText.slice(0, 60) + (userText.length > 60 ? "…" : "");
              supabase
                .from("conversations")
                .update({ title })
                .eq("id", conversationId);
            }
          });
      }
    }

    // Stream AI response
    const result = streamText({
      model: getModel(selectedModel),
      messages: modelMessages,
      maxOutputTokens: 4096,
      abortSignal: AbortSignal.timeout(30000), // 30s timeout — prevent infinite hang
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

    return createUIMessageStreamResponse({
      status: 200,
      stream: result.toUIMessageStream(),
    });
  } catch (error: unknown) {
    console.error("[Chat API Error]", error);
    
    // Handle specific API errors
    const message = error instanceof Error ? error.message : "Internal server error";
    const isRateLimit = message.includes("Rate limit") || message.includes("429");
    const isAuth = message.includes("Unauthorized") || message.includes("401");
    
    return new Response(
      JSON.stringify({ 
        error: isRateLimit 
          ? "AI API rate limit reached. Please wait a moment and try again."
          : isAuth
          ? "AI API authentication failed. Check ZAI_API_KEY."
          : message
      }),
      { status: isRateLimit ? 429 : 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
