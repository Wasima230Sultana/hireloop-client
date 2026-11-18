import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeftIcon,
    BanknoteIcon,
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    GlobeIcon,
    MapPinIcon,
    TagIcon,
    UsersIcon,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
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

function MetaItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-3">
            <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
            >
                {icon}
            </span>
            <div className="min-w-0">
                <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    {label}
                </dt>
                <dd className="truncate text-sm font-medium">{value}</dd>
            </div>
        </div>
    )
}

const workModeLabel = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
} as const

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { id } = await params
    const apiJob = await getJobById(id)
    const job = apiJob ? mapApiJob(apiJob) : null

    if (!job) notFound()

    const isExpired = job.status === "Expired"

    return (
        <>
            <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
                <Link
                    href="/browse-jobs"
                    className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    <ArrowLeftIcon aria-hidden className="size-4" />
                    Back to all jobs
                </Link>

                {/* Header */}
                <header className="flex gap-4 rounded-xl border border-border bg-card p-6">
                    <span
                        aria-hidden
                        className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xl font-semibold text-muted-foreground"
                    >
                        {job.companyName.charAt(0).toUpperCase()}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant={isExpired ? "secondary" : "default"}
                                className={cn(
                                    isExpired
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                )}
                            >
                                {job.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {job.postedLabel}
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                {job.title}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {job.companyName} • {job.location}
                                {job.isRemote ? " (Remote)" : ""}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {job.minSalary || job.maxSalary ? (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                    <BanknoteIcon aria-hidden className="size-3.5" />
                                    {formatCompensation(job)}
                                </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <BriefcaseIcon aria-hidden className="size-3.5" />
                                {job.jobType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                {job.workMode === "remote" ? (
                                    <GlobeIcon aria-hidden className="size-3.5" />
                                ) : (
                                    <MapPinIcon aria-hidden className="size-3.5" />
                                )}
                                {workModeLabel[job.workMode]}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <TagIcon aria-hidden className="size-3.5" />
                                {categoryLabel(job.category)}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Key facts */}
                <dl className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
                    <MetaItem
                        icon={<CalendarIcon aria-hidden className="size-4" />}
                        label="Application Deadline"
                        value={formatDeadline(job.deadline)}
                    />
                    <MetaItem
                        icon={<UsersIcon aria-hidden className="size-4" />}
                        label="Applicants"
                        value={`${job.applicants} candidates`}
                    />
                    <MetaItem
                        icon={<ClockIcon aria-hidden className="size-4" />}
                        label="Posted"
                        value={job.postedLabel.replace(/^Posted\s*/, "")}
                    />
                    <MetaItem
                        icon={<TagIcon aria-hidden className="size-4" />}
                        label="Job Type"
                        value={job.jobType}
                    />
                </dl>

                {/* Description */}
                {job.responsibilities && (
                    <section className="rounded-xl border border-border bg-card p-6">
                        <h2 className="text-sm font-semibold">Key Responsibilities</h2>
                        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {job.responsibilities}
                        </p>
                    </section>
                )}

                {job.requirements && (
                    <section className="rounded-xl border border-border bg-card p-6">
                        <h2 className="text-sm font-semibold">
                            Qualifications &amp; Requirements
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {job.requirements}
                        </p>
                    </section>
                )}
            </main>

            <SiteFooter />
        </>
    )
}
