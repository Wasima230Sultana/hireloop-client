import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

type StatusBadgeProps = {
    status: string
    /** Renders the badge (and its dot) in the highlighted "live" style. */
    active?: boolean
}

/** Pill with a leading dot for entity statuses (active/draft/expired…). */
export function StatusBadge({ status, active = false }: StatusBadgeProps) {
    return (
        <Badge
            className={cn(
                "gap-1.5 font-medium",
                active
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-1.5 rounded-full",
                    active ? "bg-emerald-500" : "bg-muted-foreground/60"
                )}
            />
            {status}
        </Badge>
    )
}
