import { ModelSelector } from "@/components/common/model-selector"
import { FeatureGatePrompt } from "@/components/common/feature-gate-prompt"
import { useFeatureGate } from "@/app/hooks/use-feature-gate"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS } from "../../../lib/config"

export type SelectModelProps = {
  selectedModel: string
  onSelectModel: (model: string) => void
}

export function SelectModel({
  selectedModel,
  onSelectModel,
}: SelectModelProps) {
  const { canSelectModel } = useFeatureGate()
  const model = MODELS_OPTIONS.find((model) => model.id === selectedModel)
  const provider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === model?.provider
  )

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
