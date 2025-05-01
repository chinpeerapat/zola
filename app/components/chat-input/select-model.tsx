import { ModelSelector } from "@/components/common/model-selector"
import { useFeatureGate } from "@/app/hooks/use-feature-gate"
// Removed unused model and provider lookups

export type SelectModelProps = {
  selectedModel: string
  onSelectModel: (model: string) => void
}

export function SelectModel({
  selectedModel,
  onSelectModel,
}: SelectModelProps) {
  // Users can pick models via the dropdown; model availability is enforced in the selector
  useFeatureGate()

  return (
    <ModelSelector
      selectedModelId={selectedModel}
      setSelectedModelId={onSelectModel}
      className="rounded-full"
    />
  )
}
