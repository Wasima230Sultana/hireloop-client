import Link from "next/link"
import type { ReactNode } from "react"
import {
    BanknoteIcon,
    BriefcaseIcon,
    GlobeIcon,
    MapPinIcon,
    TagIcon,
} from "lucide-react"

import { categoryLabel, formatCompensation, type JobListing } from "@/lib/jobs"
import { cn } from "cn"

function Chip({
    icon,
    children,
    className,
}: {
    icon?: ReactNode
    children: ReactNode
    className?: string
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted-foreground",
                className
            )}
        >
            {icon}
            {children}
        </span>
    )
}

const workModeLabel = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
} as const

function JobCard({ job }: { job: JobListing }) {
    const isExpired = job.status === "Expired"

    return (
        <Link
            href={`/browse-jobs/${job._id}`}
            className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-semibold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            >
                {job.companyName.charAt(0).toUpperCase()}
            </span>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate font-medium transition-colors group-hover:text-primary">
                            {job.title}
                        </h3>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {job.companyName} • {job.location}
                            {job.isRemote ? " (Remote)" : ""}
                        </p>
                    </div>
                    <span className="hidden shrink-0 text-xs whitespace-nowrap text-muted-foreground sm:block">
                        {job.postedLabel}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {job.minSalary || job.maxSalary ? (
                        <Chip icon={<BanknoteIcon aria-hidden className="size-3.5" />}>
                            {formatCompensation(job)}
                        </Chip>
                    ) : null}

                    <Chip icon={<BriefcaseIcon aria-hidden className="size-3.5" />}>
                        {job.jobType}
                    </Chip>

                    <Chip
                        icon={
                            job.workMode === "remote" ? (
                                <GlobeIcon aria-hidden className="size-3.5" />
                            ) : (
                                <MapPinIcon aria-hidden className="size-3.5" />
                            )
                        }
                    >
                        {workModeLabel[job.workMode]}
                    </Chip>

                    <Chip icon={<TagIcon aria-hidden className="size-3.5" />}>
                        {categoryLabel(job.category)}
                    </Chip>

                    {isExpired && (
                        <Chip
                            icon={null}
                            className="border-border bg-muted text-muted-foreground"
                        >
                            Closed
                        </Chip>
                    )}
                </div>
            </div>
        </Link>
    )
}

export { JobCard }
