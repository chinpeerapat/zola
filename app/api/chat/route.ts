import { loadAgent } from "@/lib/agents/load-agent"
import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { loadMCPToolsFromURL } from "@/lib/mcp/load-mcp-from-url"
import { getAllModels } from "@/lib/models"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { Provider } from "@/lib/user-keys"
import { validateUserIdentity } from "@/lib/server/api"
import { checkUsageByModel, enforceModelAccess, NotPremiumError } from "@/lib/usage"
import { Attachment } from "@ai-sdk/ui-utils"
import { Message as MessageAISDK, streamText, ToolSet } from "ai"
import {
  logUserMessage,
  storeAssistantMessage,
  trackSpecialAgentUsage,
} from "./api"
import { cleanMessagesForTools } from "./utils"

export const maxDuration = 60

type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  userId: string
  model: string
  isAuthenticated: boolean
  systemPrompt: string
  agentId?: string
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      chatId,
      userId,
      model,
      isAuthenticated,
      systemPrompt,
      agentId,
    } = (await req.json()) as ChatRequest

    if (!messages || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    const supabase = await validateUserIdentity(userId, isAuthenticated)

    if (supabase) {
      // Enforce premium entitlement for pro models
      await enforceModelAccess(supabase, userId, model)
      // Check and increment usage caps
      await checkUsageByModel(supabase, userId, model, isAuthenticated)
    }

    const userMessage = messages[messages.length - 1]

    if (supabase && userMessage?.role === "user") {
      await logUserMessage({
        supabase,
        userId,
        chatId,
        content: userMessage.content,
        attachments: userMessage.experimental_attachments as Attachment[],
        model,
        isAuthenticated,
      })
    }

    let agentConfig = null

    if (agentId) {
      agentConfig = await loadAgent(agentId)
    }

    const allModels = await getAllModels()
    const modelConfig = allModels.find((m) => m.id === model)

    if (!modelConfig || !modelConfig.apiSdk) {
      throw new Error(`Model ${model} not found`)
    }

    const effectiveSystemPrompt =
      agentConfig?.systemPrompt || systemPrompt || SYSTEM_PROMPT_DEFAULT

    let toolsToUse = undefined

    if (agentConfig?.mcpConfig) {
      const { tools } = await loadMCPToolsFromURL(agentConfig.mcpConfig.server)
      toolsToUse = tools
    } else if (agentConfig?.tools) {
      toolsToUse = agentConfig.tools
      if (supabase) {
        await trackSpecialAgentUsage(supabase, userId)
      }
    }

    // Clean messages when switching between agents with different tool capabilities
    const hasTools = !!toolsToUse && Object.keys(toolsToUse).length > 0
    const cleanedMessages = cleanMessagesForTools(messages, hasTools)

    let streamError: Error | null = null

    let apiKey: string | undefined
    if (isAuthenticated && userId) {
      const { getEffectiveApiKey } = await import("@/lib/user-keys")
      const provider = getProviderForModel(model)
      apiKey =
        (await getEffectiveApiKey(userId, provider as Provider)) || undefined
    }

    const result = streamText({
      model: modelConfig.apiSdk(apiKey),
      system: effectiveSystemPrompt,
      messages: cleanedMessages,
      tools: toolsToUse as ToolSet,
      maxSteps: 10,
      onError: (err: unknown) => {
        console.error("🛑 streamText error:", err)
        streamError = new Error(
          (err as { error?: string })?.error ||
            "AI generation failed. Please check your model or API key."
        )
      },

      onFinish: async ({ response }) => {
        if (supabase) {
          await storeAssistantMessage({
            supabase,
            chatId,
            messages:
              response.messages as unknown as import("@/app/types/api.types").Message[],
          })
        }
      },
    })

    if (streamError) {
      throw streamError
    }

    const originalResponse = result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    })
    const headers = new Headers(originalResponse.headers)
    headers.set("X-Chat-Id", chatId)

    return new Response(originalResponse.body, {
      status: originalResponse.status,
      headers,
    })
  } catch (err: unknown) {
    console.error("Error in /api/chat:", err)
    
    // Handle premium access errors
    if (err instanceof NotPremiumError) {
      return new Response(
        JSON.stringify({ error: err.message, code: err.code }),
        { status: 402 }
      )
    }
    
    // Return a structured error response if the error is a UsageLimitError.
    const error = err as { code?: string; message?: string }
    if (error.code === "DAILY_LIMIT_REACHED") {
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 403 }
      )
    }

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    )
  }
}
