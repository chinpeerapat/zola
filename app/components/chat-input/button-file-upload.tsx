import {
  FileUpload,
  FileUploadContent,
  FileUploadTrigger,
} from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FileArrowUp, Paperclip } from "@phosphor-icons/react"
import { FeatureGatePrompt } from "@/components/common/feature-gate-prompt"
import { useFeatureGate } from "@/app/hooks/use-feature-gate"

type ButtonFileUploadProps = {
  onFileUpload: (files: File[]) => void
  model: string
}

export function ButtonFileUpload({
  onFileUpload,
  model,
}: ButtonFileUploadProps) {
  const { canUploadFiles } = useFeatureGate()

  if (!canUploadFiles(model)) {
    return <FeatureGatePrompt feature="upload files" />
  }

  return (
    <FileUpload
      onFilesAdded={onFileUpload}
      multiple
      accept=".txt,.md,image/jpeg,image/png,image/gif,image/webp,image/svg,image/heic,image/heif"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <FileUploadTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "border-border dark:bg-secondary size-9 rounded-full border bg-transparent"
              )}
              type="button"
              aria-label="Add files"
            >
              <Paperclip className="size-4" />
            </Button>
          </FileUploadTrigger>
        </TooltipTrigger>
        <TooltipContent>Add files</TooltipContent>
      </Tooltip>
      <FileUploadContent>
        <div className="border-input bg-background flex flex-col items-center rounded-lg border border-dashed p-8">
          <FileArrowUp className="text-muted-foreground size-8" />
          <span className="mt-4 mb-1 text-lg font-medium">Drop files here</span>
          <span className="text-muted-foreground text-sm">
            Drop any files here to add it to the conversation
          </span>
        </div>
      </FileUploadContent>
    </FileUpload>
  )
}
