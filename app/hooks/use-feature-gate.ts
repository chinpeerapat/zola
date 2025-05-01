import { useUser } from "@/app/providers/user-provider"
import { MODELS_OPTIONS, MODELS_FREE, NON_AUTH_DAILY_MESSAGE_LIMIT, AUTH_DAILY_MESSAGE_LIMIT } from "@/lib/config"

export function useFeatureGate() {
  const { user } = useUser()
  const isAuthenticated = !!user && !user.anonymous
  const dailyLimit = isAuthenticated ? AUTH_DAILY_MESSAGE_LIMIT : NON_AUTH_DAILY_MESSAGE_LIMIT

  /**
   * Determine if a model can be selected by the current user.
   * Authenticated users can select any available model.
   * Unauthenticated (guest) users can only select free models.
   */
  function canSelectModel(modelId: string) {
    const model = MODELS_OPTIONS.find(m => m.id === modelId)
    if (!model?.available) {
      return false
    }
    if (isAuthenticated) {
      return true
    }
    // Guest users: only allow free models
    // MODELS_FREE contains the list of free-tier models
    return MODELS_FREE.some(m => m.id === modelId)
  }

  function canUploadFiles(modelId: string) {
    const model = MODELS_OPTIONS.find(m => m.id === modelId)
    return isAuthenticated && model?.features?.some(f => f.id === "file-upload" && f.enabled)
  }

  // Placeholder for premium logic
  function canAccessPremium() {
    return isAuthenticated && user?.premium
  }

  return { isAuthenticated, dailyLimit, canSelectModel, canUploadFiles, canAccessPremium }
} 