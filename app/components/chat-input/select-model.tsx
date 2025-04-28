import { ModelSelector } from "@/components/common/model-selector"
import { FeatureGatePrompt } from "@/components/common/feature-gate-prompt"
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
  const { canSelectModel } = useFeatureGate()

  if (!canSelectModel(selectedModel)) {
    return <FeatureGatePrompt feature="select a model" />
  }

  return (
    <ModelSelector
      selectedModelId={selectedModel}
      setSelectedModelId={onSelectModel}
      className="rounded-full"
    />
  )
}
