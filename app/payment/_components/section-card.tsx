import type { LucideIcon } from "lucide-react"

import { cn } from "cn"

type SectionCardProps = {
    /** Heading id used by `aria-labelledby`. */
    id: string
    title: string
    /** Optional small line rendered under the title. */
    description?: React.ReactNode
    /** Optional icon tile rendered to the left of the title. */
    icon?: LucideIcon
    children: React.ReactNode
    className?: string
}

/**
 * The rounded `bg-card` shell used by every section on the payment pages:
 * an optional icon tile, a heading, then free-form content.
 */
export function SectionCard({
    id,
    title,
    description,
    icon: Icon,
    children,
    className,
}: SectionCardProps) {
    return (
        <section
            aria-labelledby={id}
            className={cn(
                "rounded-xl border border-border bg-card p-6",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {Icon && (
                    <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                        <Icon className="size-4" />
                    </span>
                )}
                <div className="min-w-0">
                    <h2 id={id} className="text-base font-semibold">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>

            <div className="mt-4">{children}</div>
        </section>
    )
}
