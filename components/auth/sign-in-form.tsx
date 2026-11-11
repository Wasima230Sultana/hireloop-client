"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
      return
    }

    setPending(true)

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    })

    if (error) {
      setError(error.message ?? "Unable to sign in. Please try again.")
      setPending(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md gap-6 shadow-sm">
      <CardHeader className="gap-1.5">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue to HireLoop.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-10"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="mt-1 h-10 w-full rounded-xl"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1.5 bg-transparent">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?
        </span>
        <Link
          href="/sign-up"
          className="text-sm font-medium text-primary hover:underline"
        >
          Get started
        </Link>
      </CardFooter>
    </Card>
  )
}

export { SignInForm }
