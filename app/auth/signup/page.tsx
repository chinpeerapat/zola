"use client"

import { AuthForm } from "@/app/components/auth/auth-form"
import { useEffect, useState } from "react"
import { Tabs } from "@/components/ui/tabs"

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)

  // Using useEffect to ensure the component mounts only on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </a>
          </p>
        </div>
        
        <div className="mt-8">
          {/* We're using a key to force the Tabs component to remount with default value */}
          <Tabs defaultValue="signup" key="signup-form">
            <AuthForm redirectUrl="/" />
          </Tabs>
        </div>
      </div>
    </div>
  )
} 