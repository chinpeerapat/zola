"use client"

import { APP_NAME } from "@/lib/config"
import Link from "next/link"
import { HeaderGoBack } from "../components/header-go-back"
import { AuthForm } from "../components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="bg-background flex h-screen flex-col">
      <HeaderGoBack href="/" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-3">
              Sign in below to increase your message limits.
            </p>
          </div>
          
          <div className="mt-8">
            <AuthForm showSocialLogin={true} />
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground py-6 text-center text-sm">
        <p>
          By continuing, you agree to our{" "}
          <Link href="/" className="text-foreground hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  )
}
