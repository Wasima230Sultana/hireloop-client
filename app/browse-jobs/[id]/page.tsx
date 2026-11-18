import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeftIcon,
    BanknoteIcon,
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    MapPinIcon,
    type LucideIcon,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getJobById } from "@/lib/api/jobs"
import {
    categoryLabel,
    formatCompensation,
    formatDeadline,
    mapApiJob,
} from "@/lib/jobs"
import { cn } from "cn"

type JobDetailPageProps = {
    params: Promise<{ id: string }>
}

const workModeLabel = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
} as const

/** Icon + uppercase label + value tile shown in the stats row. */
function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon
    label: string
    value: string
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <Icon aria-hidden className="size-4 text-muted-foreground" />
            <dt className="mt-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 truncate text-sm font-medium">{value}</dd>
        </div>
    )
}

/** Renders a free-text field as a bulleted list, one bullet per line. */
function BulletList({ text }: { text: string }) {
    const items = text
        .split("\n")
        .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean)

    return (
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { id } = await params
    const apiJob = await getJobById(id)
    const job = apiJob ? mapApiJob(apiJob) : null

    if (!job) notFound()

    const isExpired = job.status === "Expired"

    // "New York · Remote" — but never "Remote · Remote".
    const mode = workModeLabel[job.workMode]
    const location =
        job.location.toLowerCase() === mode.toLowerCase()
            ? job.location
            : `${job.location} · ${mode}`

    return (
        <>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                <Link
                    href="/browse-jobs"
                    className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    <ArrowLeftIcon aria-hidden className="size-4" />
                    Back to all jobs
                </Link>

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

                    <Link
                        href="/sign-in"
                        className="inline-flex h-10 shrink-0 items-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                        Apply Now
                    </Link>
                </header>

                {/* Stats */}
                <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={BanknoteIcon}
                        label="Salary Range"
                        value={formatCompensation(job)}
                    />
                    <StatCard icon={MapPinIcon} label="Location" value={location} />
                    <StatCard icon={BriefcaseIcon} label="Job Type" value={job.jobType} />
                    <StatCard
                        icon={CalendarIcon}
                        label="Deadline"
                        value={formatDeadline(job.deadline)}
                    />
                </dl>

                {/* Body: description + company overview */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {(job.responsibilities || job.requirements) && (
                        <section className="divide-y divide-border rounded-xl border border-border bg-card">
                            {job.responsibilities && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold">
                                        Responsibilities
                                    </h2>
                                    <div className="mt-4">
                                        <BulletList text={job.responsibilities} />
                                    </div>
                                </div>
                            )}
                            {job.requirements && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold">
                                        Requirements
                                    </h2>
                                    <div className="mt-4">
                                        <BulletList text={job.requirements} />
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:col-start-2">
                        <h2 className="text-base font-semibold">Company Overview</h2>

                        <div
                            aria-hidden
                            className="mt-4 flex h-32 items-center justify-center rounded-lg bg-muted text-3xl font-semibold text-muted-foreground"
                        >
                            {job.companyName.charAt(0).toUpperCase()}
                        </div>

                        <dl className="mt-4 divide-y divide-border text-sm">
                            <div className="flex items-center justify-between gap-3 py-3">
                                <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                    Industry
                                </dt>
                                <dd className="text-right font-medium">
                                    {categoryLabel(job.category)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3 py-3">
                                <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                    Applicants
                                </dt>
                                <dd className="text-right font-medium">
                                    {job.applicants} candidates
                                </dd>
                            </div>
                        </dl>

                        <Link
                            href="/sign-in"
                            className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}
                        >
                            Apply Now
                        </Link>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </>
    )
}
