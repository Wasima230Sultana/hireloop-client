"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Briefcase, Globe, MapPin } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { createJob, updateJob } from "@/lib/actions/jobs"
import {
    jobCategories,
    jobTypes,
    salaryFrequencies,
    type JobFormData,
    type JobListing,
} from "@/lib/jobs"
import { ErrorAlert } from "@/app/dashboard/_components/error-alert"

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
                <span className="size-2 rounded-full bg-primary" aria-hidden />
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

/** Blank payload used when no existing job is passed in. */
const emptyForm: JobFormData = {
    title: "",
    companyName: "",
    companyId: "",
    recruiterId: "",
    category: "",
    jobType: "Full-time",
    isRemote: false,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    salaryFrequency: "hour",
    responsibilities: "",
    requirements: "",
    applicants: 0,
    status: "Active",
}

type JobFormProps = {
    /** Existing listing to prefill — omit to publish a new job. */
    job?: JobListing
}

/**
 * Create/edit form shared by the "Post a New Job" and "Edit Job" pages.
 * Saves through `POST /jobs` or `PATCH /jobs/:id`, then returns to the
 * manage-jobs list (create) or the job's detail page (edit).
 */
export function JobForm({ job }: JobFormProps) {
    const editing = Boolean(job)
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const [form, setForm] = useState<JobFormData>(() => job ?? emptyForm)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    function handleChange<K extends keyof JobFormData>(
        name: K,
        value: JobFormData[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        if (!form.category) {
            setError("Please select a job category.")
            return
        }

        setSaving(true)
        try {
            if (job) {
                await updateJob(job._id, form)
                toast.add({
                    title: "Changes saved",
                    description: "The job post has been updated.",
                })
                router.push(`/dashboard/recruiter/jobs/${job._id}`)
            } else {
                // The session may resolve after the first render, so stamp the
                // owner at submit time instead of baking it into the initial state.
                await createJob({
                    ...form,
                    recruiterId: session?.user.id ?? form.recruiterId,
                })
                toast.add({
                    title: "Job published",
                    description: "The job is now live.",
                })
                router.push("/dashboard/recruiter/jobs")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <ErrorAlert message={error} />}

            {/* 1. Basic Information */}
            <Section number={1} title="Basic Information">
                <Field htmlFor="title" label="Job Title" required>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
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
                                name="companyName"
                                value={form.companyName}
                                onChange={(e) =>
                                    handleChange("companyName", e.target.value)
                                }
                                required
                                placeholder="HirePulse Network"
                                className="h-10 pl-9"
                            />
                        </div>
                    </Field>

                    <Field label="Job Category" required>
                        <Select
                            value={form.category}
                            onValueChange={(value) =>
                                handleChange(
                                    "category",
                                    (value ?? "") as JobFormData["category"]
                                )
                            }
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
                        value={[form.jobType]}
                        onValueChange={(values) => {
                            if (values[0]) {
                                handleChange(
                                    "jobType",
                                    values[0] as JobFormData["jobType"]
                                )
                            }
                        }}
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
                        <Globe className="size-4" aria-hidden />
                    </span>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Remote Work Allowed</p>
                        <p className="text-xs text-muted-foreground">
                            Enable worldwide or distributed candidate applications
                        </p>
                    </div>
                    <Switch
                        checked={form.isRemote}
                        onCheckedChange={(checked) => handleChange("isRemote", checked)}
                        aria-label="Remote work allowed"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field htmlFor="location" label="Job Location" required>
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                required
                                placeholder="New York, USA"
                                className="h-10 pl-9"
                            />
                        </div>
                    </Field>

                    <Field htmlFor="deadline" label="Application Deadline">
                        <Input
                            id="deadline"
                            name="deadline"
                            type="date"
                            value={form.deadline}
                            onChange={(e) => handleChange("deadline", e.target.value)}
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
                                value={form.minSalary}
                                onChange={(e) => handleChange("minSalary", e.target.value)}
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
                                value={form.maxSalary}
                                onChange={(e) => handleChange("maxSalary", e.target.value)}
                                placeholder="40"
                                className="h-10 pl-7"
                            />
                        </div>
                    </Field>

                    <Field label="Frequency">
                        <Select
                            value={form.salaryFrequency}
                            onValueChange={(value) =>
                                handleChange(
                                    "salaryFrequency",
                                    (value ?? "hour") as JobFormData["salaryFrequency"]
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
                        value={form.responsibilities}
                        onChange={(e) =>
                            handleChange("responsibilities", e.target.value)
                        }
                        required
                        rows={4}
                        placeholder="Describe the key responsibilities..."
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
                        name="requirements"
                        value={form.requirements}
                        onChange={(e) => handleChange("requirements", e.target.value)}
                        required
                        rows={4}
                        placeholder="List the qualifications, experience, and skills..."
                        className="resize-y"
                    />
                </Field>
            </Section>

            <section className="flex flex-wrap items-center gap-3">
                <Button
                    type="submit"
                    disabled={saving || (!editing && isPending)}
                    className="h-10 rounded-xl px-5"
                >
                    {saving ? "Saving…" : editing ? "Save Changes" : "Publish Job"}
                    <ArrowRight aria-hidden />
                </Button>
                <Link
                    href={
                        job
                            ? `/dashboard/recruiter/jobs/${job._id}`
                            : "/dashboard/recruiter/jobs"
                    }
                    className={buttonVariants({
                        variant: "outline",
                        className: "h-10 rounded-xl px-5",
                    })}
                >
                    Cancel
                </Link>
            </section>
        </form>
    )
}
