import { Suspense } from "react"
import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — HireLoop",
  description: "Sign in to your HireLoop account to continue.",
}

const SigninPage = () => {
  // SignInForm reads `useSearchParams()`, which must sit under a Suspense
  // boundary or the prerendered page fails to build.
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

export default SigninPage
