"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithPassword, signUpWithPassword, signInWithGoogle } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type AuthFormProps = {
  redirectUrl?: string
  showSocialLogin?: boolean
}

export function AuthForm({ redirectUrl = "/", showSocialLogin = true }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const supabase = createClient()

  const handleSignInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      
      await signInWithPassword(supabase, email, password)
      
      // Successful login will automatically redirect due to Supabase's session handling
      // But we can add an explicit redirect if needed
      window.location.href = redirectUrl
    } catch (err: any) {
      console.error("Error signing in with password:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await signUpWithPassword(supabase, email, password)
      
      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("Please check your email for a confirmation link.")
      } else {
        window.location.href = redirectUrl
      }
    } catch (err: any) {
      console.error("Error signing up with password:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await signInWithGoogle(supabase)

      // Redirect to the provider URL
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error("Error signing in with Google:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm mb-4">
            {error}
          </div>
        )}
        
        <TabsContent value="signin">
          <form onSubmit={handleSignInWithPassword} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUpWithPassword} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email-signup"
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                id="password-signup"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </TabsContent>
        
        {showSocialLogin && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2 size-4"
              />
              <span>Google</span>
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  )
} 