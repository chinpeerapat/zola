/**
 * Performance configuration for AI model responses and streaming
 */

// Default timeout values (in milliseconds)
export const PERFORMANCE_CONFIG = {
  // AI Provider timeouts
  AI_REQUEST_TIMEOUT: parseInt(process.env.AI_REQUEST_TIMEOUT || '30000'),
  OLLAMA_REQUEST_TIMEOUT: parseInt(process.env.OLLAMA_REQUEST_TIMEOUT || '45000'),
  
  // Streaming configuration
  STREAM_TIMEOUT: parseInt(process.env.STREAM_TIMEOUT || '30000'),
  MAX_DURATION: 60, // seconds - Next.js API route timeout
  
  // UI responsiveness
  CHAT_PREVIEW_DEBOUNCE: 100, // milliseconds
  MESSAGE_CACHE_SIZE: 100, // number of messages to cache
  
  // Performance mode settings
  ENABLE_PERFORMANCE_MODE: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MODE === 'true',
  DISABLE_TELEMETRY: true,
  ENABLE_KEEP_ALIVE: true,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  
  // Connection pooling
  MAX_CONCURRENT_REQUESTS: 10,
} as const

/**
 * Get optimized fetch options for AI providers
 */
export function getOptimizedFetchOptions(timeout?: number) {
  const timeoutMs = timeout || PERFORMANCE_CONFIG.AI_REQUEST_TIMEOUT
  
  return {
    signal: AbortSignal.timeout(timeoutMs),
    keepalive: PERFORMANCE_CONFIG.ENABLE_KEEP_ALIVE,
    headers: {
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=30, max=100',
    },
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static startTimes = new Map<string, number>()
  
  static start(operation: string): void {
    if (PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MODE) {
      this.startTimes.set(operation, Date.now())
    }
  }
  
  static end(operation: string): number | null {
    if (!PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MODE) return null
    
    const startTime = this.startTimes.get(operation)
    if (!startTime) return null
    
    const duration = Date.now() - startTime
    this.startTimes.delete(operation)
    
    // Log slow operations (> 5 seconds)
    if (duration > 5000) {
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration}ms`)
    }
    
    return duration
  }
}

/**
 * Optimized streaming configuration for AI SDK
 */
export function getStreamingConfig() {
  return {
    experimental_continueSteps: true,
    experimental_telemetry: {
      isEnabled: !PERFORMANCE_CONFIG.DISABLE_TELEMETRY,
    },
    maxSteps: 10,
  }
}