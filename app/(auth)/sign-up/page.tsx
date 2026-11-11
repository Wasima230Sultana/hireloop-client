import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign up — HireLoop",
  description: "Create your free HireLoop account and start today.",
}

const SignupPage = () => {
  return <SignUpForm />
}

export default SignupPage
