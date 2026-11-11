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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { authClient } from "@/lib/auth-client"

const accountTypes = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Browse jobs and apply to opportunities",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and hire talented candidates",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage and oversee the HireLoop platform",
  },
] as const

type AccountType = (typeof accountTypes)[number]["value"]

function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [type, setType] = useState<AccountType>("seeker")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError("Please enter your name.")
      return
    }
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setPending(true)

    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      type,
    })

    if (error) {
      setError(error.message ?? "Unable to create your account. Please try again.")
      setPending(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md gap-6 shadow-sm">
      <CardHeader className="gap-1.5">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Join HireLoop and start your next loop today.
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
            <Label htmlFor="signup-name">Full name</Label>
            <Input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jane Doe"
              className="h-10"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
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
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="h-10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">I am a…</span>
            <RadioGroup
              value={type}
              onValueChange={(value: AccountType) => setType(value)}
              aria-label="Account type"
              className="flex flex-col gap-2"
            >
              {accountTypes.map((accountType) => (
                <Label
                  key={accountType.value}
                  className="group/field-label flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50"
                >
                  <RadioGroupItem
                    value={accountType.value}
                    className="mt-0.5"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {accountType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {accountType.description}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="mt-1 h-10 w-full rounded-xl"
          >
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1.5 bg-transparent">
        <span className="text-sm text-muted-foreground">
          Already have an account?
        </span>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}

export { SignUpForm }
