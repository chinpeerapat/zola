import { useUser } from "@/app/providers/user-provider"
import { MODELS_OPTIONS, NON_AUTH_DAILY_MESSAGE_LIMIT, AUTH_DAILY_MESSAGE_LIMIT } from "@/lib/config"

export function useFeatureGate() {
  const { user } = useUser()
  const isAuthenticated = !!user && !user.anonymous
  const dailyLimit = isAuthenticated ? AUTH_DAILY_MESSAGE_LIMIT : NON_AUTH_DAILY_MESSAGE_LIMIT

  function canSelectModel(modelId: string) {
    const model = MODELS_OPTIONS.find(m => m.id === modelId)
    return isAuthenticated && model?.available
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