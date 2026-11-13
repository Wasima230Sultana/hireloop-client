"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, Globe, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const jobCategories = {
  "engineering-tech": "Engineering & Tech",
  design: "Design",
  marketing: "Marketing",
  sales: "Sales",
  finance: "Finance",
  "customer-support": "Customer Support",
  operations: "Operations",
} as const

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"] as const

const salaryFrequencies = {
  hour: "per hour",
  day: "per day",
  week: "per week",
  month: "per month",
  year: "per year",
} as const

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="size-2 rounded-full bg-primary" />
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

function Field({
  htmlFor,
  label,
  required,
  hint,
  children,
}: {
  htmlFor?: string
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-muted-foreground"> *</span>}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function NewJobPage() {
  const [category, setCategory] = useState("")
  const [frequency, setFrequency] =
    useState<keyof typeof salaryFrequencies>("hour")
  const [jobType, setJobType] = useState<string>("Full-time")
  const [isRemote, setIsRemote] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [published, setPublished] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!category) {
      setError("Please select a job category.")
      return
    }

    const data = Object.fromEntries(new FormData(event.currentTarget))
    const payload = { ...data, jobType, category, frequency, isRemote }
     fetch(`http://localhost:5000/jobs`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
     })
    // Hook your "create job" API call up here.
    console.log("New job:", payload)
    setPublished(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link
                href="/dashboard/recruiter/jobs"
                className="hover:text-foreground"
              >
                Manage Jobs
              </Link>
              <span aria-hidden>/</span>
              <span>Create New Listing</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight">
              Post a New Job
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
          </div>

        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        {published && (
          <p
            role="status"
            className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
          >
            Job published successfully.
          </p>
        )}

        {/* 1. Basic Information */}
        <Section number={1} title="Basic Information">
          <Field htmlFor="title" label="Job Title" required>
            <Input
              id="title"
              name="title"
              required
              placeholder="Frontend Developer"
              className="h-10"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field htmlFor="company" label="Company Name" required>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="company"
                  name="company"
                  required
                  placeholder="HirePulse Network"
                  className="h-10 pl-9"
                />
              </div>
            </Field>

            <Field label="Job Category" required>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
                items={jobCategories}
              >
                <SelectTrigger
                  aria-label="Job Category"
                  className="h-10 w-full"
                >
                  <SelectValue placeholder="Engineering & Tech" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(jobCategories).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Job Type" required>
            <ToggleGroup
              value={[jobType]}
              onValueChange={(values) => values[0] && setJobType(values[0])}
              variant="outline"
              className="w-full"
            >
              {jobTypes.map((type) => (
                <ToggleGroupItem
                  key={type}
                  value={type}
                  className="h-10 flex-1 aria-pressed:border-primary aria-pressed:bg-primary/10"
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
        </Section>

        {/* 2. Location, Compensation & Timeline */}
        <Section number={2} title="Location, Compensation & Timeline">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Remote Work Allowed (isRemote)
              </p>
              <p className="text-xs text-muted-foreground">
                Enable worldwide or distributed candidate applications
              </p>
            </div>
            <Switch
              checked={isRemote}
              onCheckedChange={setIsRemote}
              aria-label="Remote work allowed"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              htmlFor="location"
              label="Job Location (location)"
              required
              hint="Required"
            >
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="New York, USA"
                  className="h-10 pl-9"
                />
              </div>
            </Field>

            <Field htmlFor="deadline" label="Application Deadline (deadline)">
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="h-10"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field htmlFor="min-salary" label="Min Salary / Rate">
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  id="min-salary"
                  name="minSalary"
                  type="number"
                  min={0}
                  placeholder="25"
                  className="h-10 pl-7"
                />
              </div>
            </Field>

            <Field htmlFor="max-salary" label="Max Salary / Rate">
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  id="max-salary"
                  name="maxSalary"
                  type="number"
                  min={0}
                  placeholder="40"
                  className="h-10 pl-7"
                />
              </div>
            </Field>

            <Field label="Frequency">
              <Select
                value={frequency}
                onValueChange={(value) =>
                  setFrequency(
                    (value as keyof typeof salaryFrequencies) || "hour"
                  )
                }
                items={salaryFrequencies}
              >
                <SelectTrigger aria-label="Frequency" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(salaryFrequencies).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        {/* 3. Responsibilities & Requirements */}
        <Section number={3} title="Responsibilities & Requirements">
          <Field
            htmlFor="responsibilities"
            label="Key Responsibilities"
            required
          >
            <Textarea
              id="responsibilities"
              name="responsibilities"
              required
              rows={4}
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
              className="resize-y"
            />
          </Field>

          <Field
            htmlFor="qualifications"
            label="Qualifications & Requirements"
            required
          >
            <Textarea
              id="qualifications"
              name="qualifications"
              required
              rows={4}
              placeholder="List the must-have qualifications, experience, and skills candidates need for this role."
              className="resize-y"
            />
          </Field>
        </Section>
        <section>
            
          <Button type="submit" className="h-10 rounded-xl px-5">
            Publish Job
            <ArrowRight />
          </Button>
        </section>
      </form>
    </div>
  )
}
