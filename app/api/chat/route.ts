import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { getAllModels } from "@/lib/models"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { PERFORMANCE_CONFIG, getStreamingConfig, PerformanceMonitor } from "@/lib/performance-config"
import type { ProviderWithoutOllama } from "@/lib/user-keys"
import { Attachment } from "@ai-sdk/ui-utils"
import { Message as MessageAISDK, streamText, ToolSet } from "ai"
import {
  incrementMessageCount,
  logUserMessage,
  storeAssistantMessage,
  validateAndTrackUsage,
} from "./api"
import { createErrorResponse, extractErrorMessage } from "./utils"

export const maxDuration = 60

type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  userId: string
  model: string
  isAuthenticated: boolean
  systemPrompt: string
  enableSearch: boolean
  message_group_id?: string
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
      enableSearch,
      message_group_id,
    } = (await req.json()) as ChatRequest

    if (!messages || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    const supabase = await validateAndTrackUsage({
      userId,
      model,
      isAuthenticated,
    })

    // Increment message count for successful validation
    if (supabase) {
      incrementMessageCount({ supabase, userId }).catch(console.error)
    }

    const userMessage = messages[messages.length - 1]

    if (supabase && userMessage?.role === "user") {
      logUserMessage({
        supabase,
        userId,
        chatId,
        content: userMessage.content,
        attachments: userMessage.experimental_attachments as Attachment[],
        model,
        isAuthenticated,
        message_group_id,
      }).catch(console.error)
    }

    const provider = getProviderForModel(model)

    const [allModels, resolvedApiKey] = await Promise.all([
      getAllModels(),
      isAuthenticated && userId
        ? (async () => {
            const { getEffectiveApiKey } = await import("@/lib/user-keys")
            return getEffectiveApiKey(userId, provider as ProviderWithoutOllama)
          })()
        : Promise.resolve(undefined),
    ])

    const modelConfig = allModels.find((m) => m.id === model)

    if (!modelConfig || !modelConfig.apiSdk) {
      throw new Error(`Model ${model} not found`)
    }

    const effectiveSystemPrompt = systemPrompt || SYSTEM_PROMPT_DEFAULT

    const apiKey: string | undefined = resolvedApiKey || undefined

    // Start performance monitoring
    PerformanceMonitor.start(`chat-${model}-${chatId}`)

    const streamingConfig = getStreamingConfig()
    const result = streamText({
      model: modelConfig.apiSdk(apiKey, { enableSearch }),
      system: effectiveSystemPrompt,
      messages: messages,
      tools: {} as ToolSet,
      ...streamingConfig,
      onError: (err: unknown) => {
        console.error("Streaming error occurred:", err)
        PerformanceMonitor.end(`chat-${model}-${chatId}`)
        // Don't set streamError anymore - let the AI SDK handle it through the stream
      },

      onFinish: async ({ response }) => {
        // End performance monitoring
        const duration = PerformanceMonitor.end(`chat-${model}-${chatId}`)
        if (duration && PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MODE) {
          console.log(`✅ Chat response completed in ${duration}ms for model ${model}`)
        }

        if (supabase) {
          await storeAssistantMessage({
            supabase,
            chatId,
            messages:
              response.messages as unknown as import("@/app/types/api.types").Message[],
            message_group_id,
            model,
          })
        }
      },
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      getErrorMessage: (error: unknown) => {
        console.error("Error forwarded to client:", error)
        return extractErrorMessage(error)
      },
    })
  } catch (err: unknown) {
    console.error("Error in /api/chat:", err)
    const error = err as {
      code?: string
      message?: string
      statusCode?: number
    }

    return createErrorResponse(error)
  }
}
