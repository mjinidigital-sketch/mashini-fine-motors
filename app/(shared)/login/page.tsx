import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <SignIn signUpUrl="/signup" />
    </div>
  )
}
