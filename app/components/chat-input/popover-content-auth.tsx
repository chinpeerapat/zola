"use client"

import { Button } from "@/components/ui/button"
import { PopoverContent } from "@/components/ui/popover"
import React, { useState } from "react"
import { signInWithGoogle } from "../../../lib/api"
import { APP_NAME } from "../../../lib/config"
import { createClient } from "../../../lib/supabase/client"

export function PopoverContentAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

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
    <PopoverContent
      className="w-[300px] overflow-hidden rounded-xl p-0"
      side="top"
      align="start"
    >
      <img
        src="/banner_forest.jpg"
        alt={`calm paint generate by ${APP_NAME}`}
        className="h-32 w-full object-cover"
      />
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      <div className="p-3">
        <p className="text-primary mb-1 text-base font-medium">
          Login to try more features for free
        </p>
        <p className="text-muted-foreground mb-5 text-base">
          Add files, use more models, agents, and more.
        </p>
        <Button
          variant="secondary"
          className="w-full text-base"
          size="lg"
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
          <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
        </Button>
      </div>
    </PopoverContent>
  )
}
