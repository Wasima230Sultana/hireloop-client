"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    BadgeDollarSign,
    Briefcase,
    ChevronRight,
    Code2,
    EllipsisVertical,
    Globe,
    LineChart,
    LoaderCircle,
    MapPin,
    Megaphone,
    Palette,
    Plus,
    Server,
    SquarePen,
    Trash2,
    Users,
    type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type JobFormData } from "@/app/dashboard/recruiter/jobs/new/page"
import { getJobs, type ApiJob } from "@/lib/actions/jobs"
import { jobCategories, jobTypes } from "@/lib/jobs"
import { cn } from "cn"

type JobStatus = "Active" | "Expired"
type WorkMode = "onsite" | "hybrid" | "remote"

/** A job post as shown in the table: the new-job form data + listing metadata. */
type JobListing = JobFormData & {
    id: string
    applicants: number
    status: JobStatus
    postedLabel: string
    workMode: WorkMode
}

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

const salarySuffix: Record<JobFormData["salaryFrequency"], string> = {
    hour: "/ hr",
    day: "/ day",
    week: "/ wk",
    month: "/ mo",
    year: "/ yr",
}

/** Sample listings (shaped exactly like the new-job form data) shown alongside API data. */
const dummyJobs: JobListing[] = [
    {
        id: "job_frontend_developer",
        title: "Frontend Developer",
        companyName: "HirePulse Network",
        category: "engineering-tech",
        jobType: "Full-time",
        isRemote: false,
        workMode: "onsite",
        location: "Buffalo, New York, USA",
        deadline: "2025-05-30",
        minSalary: "25",
        maxSalary: "40",
        salaryFrequency: "hour",
        responsibilities:
            "Build and maintain responsive React interfaces across our hiring products.",
        requirements: "3+ years with React, TypeScript, and modern CSS.",
        applicants: 34,
        status: "Active",
        postedLabel: "Posted 1d ago",
    },
    {
        id: "job_senior_product_designer",
        title: "Senior Product Designer",
        companyName: "HirePulse Labs",
        category: "design",
        jobType: "Full-time",
        isRemote: false,
        workMode: "hybrid",
        location: "London, UK",
        deadline: "2025-06-14",
        minSalary: "90000",
        maxSalary: "115000",
        salaryFrequency: "year",
        responsibilities:
            "Own end-to-end product design from discovery through polished UI handoff.",
        requirements: "5+ years shipping SaaS products with a strong portfolio.",
        applicants: 19,
        status: "Active",
        postedLabel: "Posted 1w ago",
    },
    {
        id: "job_devops_specialist",
        title: "DevOps Specialist",
        companyName: "HirePulse Platform",
        category: "operations",
        jobType: "Full-time",
        isRemote: false,
        workMode: "onsite",
        location: "Berlin, Germany",
        deadline: "2025-06-30",
        minSalary: "95000",
        maxSalary: "120000",
        salaryFrequency: "year",
        responsibilities:
            "Run our CI/CD pipelines, Kubernetes clusters, and observability stack.",
        requirements: "Solid AWS/Kubernetes experience and infrastructure-as-code skills.",
        applicants: 12,
        status: "Active",
        postedLabel: "Posted 2w ago",
    },
    {
        id: "job_product_marketing_lead",
        title: "Product Marketing Lead",
        companyName: "HirePulse Network",
        category: "marketing",
        jobType: "Full-time",
        isRemote: true,
        workMode: "remote",
        location: "Remote (EU/US)",
        deadline: "2025-07-15",
        minSalary: "80000",
        maxSalary: "105000",
        salaryFrequency: "year",
        responsibilities:
            "Lead launches, positioning, and go-to-market campaigns for new features.",
        requirements: "4+ years in B2B SaaS product marketing.",
        applicants: 27,
        status: "Active",
        postedLabel: "Posted 5d ago",
    },
    {
        id: "job_qa_automation_engineer",
        title: "QA Automation Engineer",
        companyName: "HirePulse Platform",
        category: "engineering-tech",
        jobType: "Part-time",
        isRemote: false,
        workMode: "hybrid",
        location: "Dublin, Ireland",
        deadline: "2025-05-01",
        minSalary: "35",
        maxSalary: "50",
        salaryFrequency: "hour",
        responsibilities:
            "Design and maintain automated test suites for our web and API layers.",
        requirements: "Hands-on experience with Playwright or Cypress.",
        applicants: 8,
        status: "Expired",
        postedLabel: "Closed",
    },
    {
        id: "job_enterprise_account_executive",
        title: "Enterprise Account Executive",
        companyName: "HirePulse Network",
        category: "sales",
        jobType: "Full-time",
        isRemote: false,
        workMode: "onsite",
        location: "Austin, Texas, USA",
        deadline: "2026-12-15",
        minSalary: "70000",
        maxSalary: "95000",
        salaryFrequency: "year",
        responsibilities:
            "Own the full enterprise sales cycle from prospecting to signed contract.",
        requirements: "4+ years closing B2B deals with six-figure ACVs.",
        applicants: 21,
        status: "Active",
        postedLabel: "Posted 3d ago",
    },
    {
        id: "job_financial_analyst",
        title: "Financial Analyst",
        companyName: "HirePulse Labs",
        category: "finance",
        jobType: "Contract",
        isRemote: false,
        workMode: "hybrid",
        location: "Toronto, Canada",
        deadline: "2026-11-30",
        minSalary: "55",
        maxSalary: "70",
        salaryFrequency: "hour",
        responsibilities:
            "Prepare forecasts, variance analysis, and monthly board reporting.",
        requirements: "CPA track record with strong spreadsheet modelling skills.",
        applicants: 6,
        status: "Active",
        postedLabel: "Posted 6d ago",
    },
    {
        id: "job_customer_support_specialist",
        title: "Customer Support Specialist",
        companyName: "HirePulse Platform",
        category: "customer-support",
        jobType: "Part-time",
        isRemote: true,
        workMode: "remote",
        location: "Remote (Global)",
        deadline: "2026-12-01",
        minSalary: "22",
        maxSalary: "28",
        salaryFrequency: "hour",
        responsibilities:
            "Answer inbound tickets and chats, escalating product issues to engineering.",
        requirements: "Excellent written English and prior support experience.",
        applicants: 44,
        status: "Active",
        postedLabel: "Posted 4d ago",
    },
    {
        id: "job_motion_designer_intern",
        title: "Motion Designer Intern",
        companyName: "HirePulse Labs",
        category: "design",
        jobType: "Internship",
        isRemote: false,
        workMode: "onsite",
        location: "Berlin, Germany",
        deadline: "2026-11-20",
        minSalary: "1800",
        maxSalary: "2400",
        salaryFrequency: "month",
        responsibilities:
            "Create short motion pieces for product launches and social channels.",
        requirements: "Portfolio showing After Effects work; students welcome.",
        applicants: 15,
        status: "Active",
        postedLabel: "Posted 12h ago",
    },
    {
        id: "job_it_support_coordinator",
        title: "IT Support Coordinator",
        companyName: "HirePulse Platform",
        category: "operations",
        jobType: "Contract",
        isRemote: false,
        workMode: "hybrid",
        location: "Dublin, Ireland",
        deadline: "2026-10-31",
        minSalary: "30",
        maxSalary: "38",
        salaryFrequency: "hour",
        responsibilities:
            "Coordinate device provisioning, access requests, and internal IT tickets.",
        requirements: "Familiarity with MDM tooling and IT helpdesk workflows.",
        applicants: 9,
        status: "Expired",
        postedLabel: "Closed",
    },
]

function categoryLabel(category: JobFormData["category"]) {
    return category ? jobCategories[category] : "Uncategorized"
}

function formatSalaryValue(value: string) {
    const amount = Number(value)
    if (!value.trim() || !Number.isFinite(amount)) return "—"
    if (amount < 1000) return `€${amount}`

    const thousands = amount / 1000
    const rounded = Number.isInteger(thousands)
        ? thousands
        : Number(thousands.toFixed(1))
    return `€${rounded}k`
}

function formatCompensation(job: JobListing) {
    if (!job.minSalary && !job.maxSalary) return "Not disclosed"
    const min = job.minSalary ? formatSalaryValue(job.minSalary) : ""
    const max = job.maxSalary ? formatSalaryValue(job.maxSalary) : ""
    const range = min && max ? `${min} – ${max}` : min || max
    return `${range} ${salarySuffix[job.salaryFrequency]}`
}

function formatDeadline(deadline: string) {
    if (!deadline) return "No deadline"
    const [year, month, day] = deadline.split("-").map(Number)
    if (!year || !month || !day) return deadline
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })
}

function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    if (!Number.isFinite(diff)) return ""

    const minutes = Math.floor(diff / 60_000)
    if (minutes < 60) return `${Math.max(minutes, 1)}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    const weeks = Math.floor(days / 7)
    if (days < 30) return `${weeks}w`
    return `${Math.floor(days / 30)}mo`
}

/** Normalises a document from `GET /jobs` into a row the table can render. */
function mapApiJob(api: ApiJob): JobListing | null {
    const id = api._id ?? api.id
    if (!id || !api.title) return null

    const category =
        api.category && api.category in categoryMeta
            ? (api.category as JobFormData["category"])
            : ""

    const jobType = jobTypes.includes(api.jobType as (typeof jobTypes)[number])
        ? (api.jobType as JobFormData["jobType"])
        : "Full-time"

    const frequency = api.salaryFrequency ?? api.frequency ?? "month"
    const salaryFrequency = (frequency in salarySuffix
        ? frequency
        : "month") as JobFormData["salaryFrequency"]

    const isRemote = Boolean(api.isRemote)
    const deadline = api.deadline ?? ""
    const postedLabel = api.createdAt
        ? `Posted ${relativeTime(api.createdAt)} ago`
        : "New posting"

    return {
        id,
        title: api.title,
        companyName: api.companyName ?? api.company ?? "Unknown company",
        category,
        jobType,
        isRemote,
        workMode:
            api.workMode === "hybrid" ||
            api.workMode === "remote" ||
            api.workMode === "onsite"
                ? api.workMode
                : isRemote
                  ? "remote"
                  : "onsite",
        location: api.location || (isRemote ? "Remote" : "Location not set"),
        deadline,
        minSalary: api.minSalary != null ? String(api.minSalary) : "",
        maxSalary: api.maxSalary != null ? String(api.maxSalary) : "",
        salaryFrequency,
        responsibilities: api.responsibilities ?? "",
        requirements: api.requirements ?? api.qualifications ?? "",
        applicants:
            typeof api.applicants === "number"
                ? api.applicants
                : Array.isArray(api.applicants)
                  ? api.applicants.length
                  : 0,
        status:
            deadline && new Date(deadline).getTime() < Date.now()
                ? "Expired"
                : "Active",
        postedLabel,
    }
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

function JobActions({
    job,
    onDelete,
}: {
    job: JobListing
    onDelete: (id: string) => void
}) {
    const router = useRouter()
    const editHref = `/dashboard/recruiter/jobs/new?edit=${job.id}`

    return (
        <div className="flex items-center justify-end gap-1">
            <Link
                href={editHref}
                aria-label={`Update ${job.title}`}
                className={buttonVariants({ size: "sm" })}
            >
                <SquarePen aria-hidden />
                Update
            </Link>

            <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${job.title}`}
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(job.id)}
            >
                <Trash2 aria-hidden />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label={`More actions for ${job.title}`}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <EllipsisVertical className="size-4" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(editHref)}>
                        Edit job
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push("/dashboard/recruiter/applications")
                        }
                    >
                        View applications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(job.id)}
                    >
                        Delete job
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
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
    const [jobs, setJobs] = useState<JobListing[]>(dummyJobs)
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

                setJobs((prev) => {
                    const remoteIds = new Set(remote.map((job) => job.id))
                    return [
                        ...remote,
                        ...prev.filter((job) => !remoteIds.has(job.id)),
                    ]
                })
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

    function handleDelete(id: string) {
        setJobs((prev) => prev.filter((job) => job.id !== id))
        setApiCount((count) =>
            dummyJobs.some((job) => job.id === id) ? count : Math.max(count - 1, 0)
        )
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
                    {error} Showing sample listings below.
                </p>
            )}

            {jobs.length === 0 ? (
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
                                            key={job.id}
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
                                                <JobActions
                                                    job={job}
                                                    onDelete={handleDelete}
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
                                    key={job.id}
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
                                        <JobActions
                                            job={job}
                                            onDelete={handleDelete}
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
