import { Badge } from "@/components/ui/badge"
import { applicationStatusMetaFor } from "@/lib/applications"
import { cn } from "cn"

/**
 * Pill with a leading dot for an application's hiring-pipeline stage.
 * Shared by the seeker's tracker and the recruiter's applicant review list.
 */
export function ApplicationStatusBadge({ status }: { status: string }) {
    const meta = applicationStatusMetaFor(status)

    return (
        <Badge className={cn("gap-1.5 font-medium", meta.badge)}>
            <span
                aria-hidden
                className={cn("size-1.5 rounded-full", meta.dot)}
            />
            {meta.label}
        </Badge>
    )
}
