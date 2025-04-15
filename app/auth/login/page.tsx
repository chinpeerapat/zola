import { AuthForm } from "@/app/components/auth/auth-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              continue as guest
            </a>
          </p>
        </div>
        
        <div className="mt-8">
          <AuthForm redirectUrl="/" />
        </div>
      </div>
    </div>
  )
} 