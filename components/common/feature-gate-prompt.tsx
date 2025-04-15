import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AuthForm } from "@/app/components/auth/auth-form"

export type FeatureGatePromptProps = {
  feature: string
}

export function FeatureGatePrompt({ feature }: FeatureGatePromptProps) {
  return (
    <Dialog open>
      <DialogContent>
        <DialogTitle>Sign in required</DialogTitle>
        <DialogDescription>
          Please sign in to {feature}.
        </DialogDescription>
        <div className="mt-4">
          <AuthForm showSocialLogin />
        </div>
      </DialogContent>
    </Dialog>
  )
} 