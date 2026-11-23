import { Globe, MapPin, Users } from "lucide-react"

import { formatDeadline, type JobListing } from "@/lib/jobs"
import { cn } from "cn"

/** One-line location (with remote/hybrid hint) for a job. */
export function LocationLine({
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

/** Applicant count with a leading people icon. */
export function ApplicantCount({ count }: { count: number }) {
    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
            <Users className="size-4 text-muted-foreground" aria-hidden />
            {count} {count === 1 ? "Candidate" : "Candidates"}
        </span>
    )
}

/** Deadline with a secondary "posted / closed" line underneath. */
export function DeadlineBlock({ job }: { job: JobListing }) {
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
