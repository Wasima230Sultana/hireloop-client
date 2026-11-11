import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — HireLoop",
  description: "Sign in to your HireLoop account to continue.",
}

const SigninPage = () => {
  return <SignInForm />
}

export default SigninPage
