"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    BadgeDollarSign,
    Briefcase,
    ChevronRight,
    Code2,
    Globe,
    LineChart,
    LoaderCircle,
    MapPin,
    Megaphone,
    Palette,
    Plus,
    Server,
    Users,
    type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
    categoryLabel,
    formatCompensation,
    formatDeadline,
    jobCategories,
    mapApiJob,
    type JobFormData,
    type JobListing,
    type JobStatus,
} from "@/lib/jobs"
import { cn } from "cn"
import { getJobs } from "@/lib/api/jobs"
import DeletedJobDialog from "@/app/components/DeletedJobDialog"

const categoryMeta: Record<
    keyof typeof jobCategories,
    { icon: LucideIcon; tile: string; label: string }
> = {
    "engineering-tech": {
        icon: Code2,
        tile: "bg-primary/10 text-primary",
        label: "text-primary",
    },
    design: {
        icon: Palette,
        tile: "bg-orange-500/10 text-orange-500",
        label: "text-orange-500",
    },
    marketing: {
        icon: Megaphone,
        tile: "bg-sky-500/10 text-sky-500",
        label: "text-sky-500",
    },
    sales: {
        icon: LineChart,
        tile: "bg-violet-500/10 text-violet-500",
        label: "text-violet-500",
    },
    finance: {
        icon: BadgeDollarSign,
        tile: "bg-emerald-500/10 text-emerald-500",
        label: "text-emerald-500",
    },
    "customer-support": {
        icon: Users,
        tile: "bg-amber-500/10 text-amber-500",
        label: "text-amber-500",
    },
    operations: {
        icon: Server,
        tile: "bg-teal-500/10 text-teal-500",
        label: "text-teal-500",
    },
}

function CategoryIcon({ category }: { category: JobFormData["category"] }) {
    const meta = category ? categoryMeta[category] : null
    const Icon = meta?.icon ?? Briefcase

    return (
        <span
            className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                meta?.tile ?? "bg-muted text-muted-foreground"
            )}
        >
            <Icon className="size-4" aria-hidden />
        </span>
    )
}

function StatusBadge({ status }: { status: JobStatus }) {
    const isActive = status === "Active"

    return (
        <Badge
            className={cn(
                "gap-1.5 font-medium",
                isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-1.5 rounded-full",
                    isActive ? "bg-emerald-500" : "bg-muted-foreground/60"
                )}
            />
            {status}
        </Badge>
    )
}

function LocationLine({
    job,
    className,
}: {
    job: JobListing
    className?: string
}) {
    const Icon = job.isRemote ? Globe : MapPin

    return (
        <span
            className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground",
                className
            )}
        >
            <Icon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
                {job.location}
                {job.workMode === "hybrid" && " (hybrid)"}
            </span>
        </span>
    )
}

function ApplicantCount({ job }: { job: JobListing }) {
    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
            <Users className="size-4 text-muted-foreground" aria-hidden />
            {job.applicants} Candidates
        </span>
    )
}

function DeadlineBlock({ job }: { job: JobListing }) {
    return (
        <span className="flex flex-col">
            <span className="whitespace-nowrap text-sm font-medium">
                {formatDeadline(job.deadline)}
            </span>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
                {job.status === "Expired" ? "Closed" : job.postedLabel}
            </span>
        </span>
    )
}

const tableHeaders = [
    "Job Title & Dept",
    "Company & Location",
    "Type",
    "Compensation",
    "Applicants",
    "Status",
    "Deadline",
    "Actions",
] as const

export default function RecruiterManageJobsPage() {
    const [jobs, setJobs] = useState<JobListing[]>([])
    const [apiCount, setApiCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadJobs() {
            try {
                const data = await getJobs()
                if (cancelled) return

                const remote = data
                    .map(mapApiJob)
                    .filter((job): job is JobListing => job !== null)

                setJobs(remote)
                setApiCount(remote.length)
                setError(null)
            } catch {
                if (!cancelled) {
                    setError("Could not load job posts from the server.")
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadJobs()

        return () => {
            cancelled = true
        }
    }, [])

    /** Drops a deleted job from the table (and the server count) without a refetch. */
    function handleJobDeleted(id: string) {
        setJobs((prev) => prev.filter((job) => job._id !== id))
        setApiCount((count) => Math.max(count - 1, 0))
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
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
                        <ChevronRight className="size-3.5" aria-hidden />
                        <span>Job Listings &amp; Postings</span>
                    </nav>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Manage Job Posts
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Review live listings, monitor applicants, and update job
                        details across your organization.
                    </p>
                </div>

                <Link
                    href="/dashboard/recruiter/jobs/new"
                    className={buttonVariants({ size: "lg" })}
                >
                    <Plus aria-hidden />
                    New Job Post
                </Link>
            </div>

            {/* Sync status */}
            <p
                role="status"
                className="flex items-center gap-2 text-xs text-muted-foreground"
            >
                {loading && (
                    <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
                )}
                <span>
                    {loading
                        ? "Syncing job posts from the server…"
                        : `${jobs.length} job posts · ${apiCount} loaded from the server`}
                </span>
            </p>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            {jobs.length === 0 ? (
                loading ? null : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Briefcase className="size-5" aria-hidden />
                    </span>
                    <p className="font-medium">No job posts yet</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Create your first listing to start receiving
                        applications from candidates.
                    </p>
                    <Link
                        href="/dashboard/recruiter/jobs/new"
                        className={buttonVariants()}
                    >
                        <Plus aria-hidden />
                        New Job Post
                    </Link>
                </div>
                )
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
                        <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
                            <caption className="sr-only">
                                Manage job posts: listings, compensation,
                                applicants, status, and deadlines.
                            </caption>
                            <thead>
                                <tr className="border-b border-border text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    {tableHeaders.map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className={cn(
                                                "px-4 py-3",
                                                header === "Actions" &&
                                                "text-right"
                                            )}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => {
                                    const meta = job.category
                                        ? categoryMeta[job.category]
                                        : null

                                    return (
                                        <tr
                                            key={job._id}
                                            className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/40"
                                        >
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <CategoryIcon
                                                        category={job.category}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-medium">
                                                            {job.title}
                                                        </p>
                                                        <p
                                                            className={cn(
                                                                "text-xs",
                                                                meta?.label ??
                                                                "text-muted-foreground"
                                                            )}
                                                        >
                                                            {categoryLabel(
                                                                job.category
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="max-w-[220px] px-4 py-3 align-middle">
                                                <p className="truncate font-medium">
                                                    {job.companyName}
                                                </p>
                                                <LocationLine job={job} />
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <Badge
                                                    variant="secondary"
                                                    className="whitespace-nowrap"
                                                >
                                                    {job.jobType}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-3 align-middle whitespace-nowrap tabular-nums">
                                                {formatCompensation(job)}
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <ApplicantCount job={job} />
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <StatusBadge
                                                    status={job.status}
                                                />
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <DeadlineBlock job={job} />
                                            </td>

                                            <td className="px-4 py-3 text-right align-middle">
                                                <DeletedJobDialog
                                                    job={job}
                                                    onDeleted={handleJobDeleted}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile / tablet cards */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        {jobs.map((job) => {
                            const meta = job.category
                                ? categoryMeta[job.category]
                                : null

                            return (
                                <article
                                    key={job._id}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <CategoryIcon
                                                category={job.category}
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {job.title}
                                                </p>
                                                <p
                                                    className={cn(
                                                        "text-xs",
                                                        meta?.label ??
                                                        "text-muted-foreground"
                                                    )}
                                                >
                                                    {categoryLabel(job.category)}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={job.status} />
                                    </div>

                                    <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                                Company &amp; Location
                                            </dt>
                                            <dd className="min-w-0 text-right">
                                                <p className="truncate font-medium">
                                                    {job.companyName}
                                                </p>
                                                <LocationLine
                                                    job={job}
                                                    className="justify-end"
                                                />
                                            </dd>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                                Type
                                            </dt>
                                            <dd>
                                                <Badge
                                                    variant="secondary"
                                                    className="whitespace-nowrap"
                                                >
                                                    {job.jobType}
                                                </Badge>
                                            </dd>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                                Compensation
                                            </dt>
                                            <dd className="text-right font-medium tabular-nums">
                                                {formatCompensation(job)}
                                            </dd>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                                Applicants
                                            </dt>
                                            <dd>
                                                <ApplicantCount job={job} />
                                            </dd>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <dt className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                                Deadline
                                            </dt>
                                            <dd className="text-right">
                                                <DeadlineBlock job={job} />
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-4 border-t border-border pt-3">
                                        <DeletedJobDialog
                                            job={job}
                                            onDeleted={handleJobDeleted}
                                        />
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
