'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckIcon } from "lucide-react"
import { Button } from "@base-ui/react"
import { cn } from "cn"

import { Badge } from "../ui/badge"
import { useSession } from "@/lib/auth-client"
import { formatCompensation, JobListing } from "@/lib/jobs"
import { applicationAllowance } from "@/lib/payments"
import { createApplication, ApplicationRejectedError } from "@/lib/actions/applications"
import {
    getApplicationsByCount,
    hasAppliedForJob,
} from "@/lib/api/applications"
import { getPaymentsByUser } from "@/lib/api/payments"

const JobHeaderPage = ({ job }: { job: JobListing }) => {
    const { data: session } = useSession()
    const user = session?.user
    const isExpired = job.status === "Expired"
    const router = useRouter()

    const [applying, setApplying] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Apply flow: sign in → already applied? → quota (5 free, then pay) →
     * submit. Every step either moves the seeker forward, sends them to
     * `/payment`, or leaves an explanation on screen.
     */
    const handleApply = async () => {
        setError(null)

        if (!user) {
            router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
            return
        }

        if (user.type !== "seeker") {
            setError("Only job seeker accounts can apply for jobs.")
            return
        }

        setApplying(true)
        try {
            // Re-clicking Apply on an old job must not count against (or
            // charge) someone who is already at their limit.
            if (await hasAppliedForJob(user.id, job._id)) {
                setError("You have already applied to this job.")
                return
            }

            // Quota: 5 free, +10 per Application Pack, HireLoop Pro unlimited.
            const [{ count }, payments] = await Promise.all([
                getApplicationsByCount(user.id),
                getPaymentsByUser(user.id),
            ])
            const allowance = applicationAllowance(payments)

            if (allowance !== null && count >= allowance) {
                router.push("/payment")
                return
            }

            // Store every detail the seeker will need to recognise this
            // application later on their dashboard, without re-joining the
            // jobs collection.
            const application = {
                jobId: job._id,
                userId: user.id,
                email: user.email,
                applicantName: user.name ?? user.email ?? "Unknown applicant",
                jobTitle: job.title,
                companyName: job.companyName,
                location: job.location,
                jobType: job.jobType,
                workMode: job.workMode,
                category: job.category,
                compensation: formatCompensation(job),
                status: "Applied" as const,
            }

            const result = await createApplication(application)

            if (result.insertedId) {
                router.push("/dashboard/seeker/applications")
            } else {
                setError("We could not submit your application. Please try again.")
            }
        } catch (err) {
            // The API has the final word on the quota: a 402 means the count
            // moved under us (another tab, or a stale check) — send them to
            // the page that fixes it rather than showing a dead end.
            if (err instanceof ApplicationRejectedError && err.status === 402) {
                router.push("/payment")
                return
            }
            setError(
                err instanceof Error
                    ? err.message
                    : "We could not submit your application. Please try again."
            )
        } finally {
            setApplying(false)
        }
    }

    return (
        <div>
            {/* Header */}
            <header className="flex flex-wrap items-start gap-4 rounded-xl border border-border bg-card p-6">
                <span
                    aria-hidden
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xl font-semibold text-muted-foreground"
                >
                    {job.companyName.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {job.title}
                    </h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {job.companyName}
                        </span>
                        <span aria-hidden>•</span>
                        <Badge
                            className={cn(
                                isExpired
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            )}
                        >
                            {!isExpired && <CheckIcon aria-hidden />}
                            {job.status}
                        </Badge>
                        <span aria-hidden>•</span>
                        <span className="text-xs">{job.postedLabel}</span>
                    </div>
                </div>

                <Button
                    onClick={handleApply}
                    disabled={applying || isExpired}
                    className="inline-flex h-10 shrink-0 items-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {applying ? "Applying…" : "Apply Now"}
                </Button>
            </header>

            {error && (
                <p
                    role="alert"
                    className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                    {error}
                </p>
            )}
        </div>
    )
}

export default JobHeaderPage
