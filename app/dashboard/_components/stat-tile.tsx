import type { LucideIcon } from "lucide-react"

import { cn } from "cn"

type StatTileProps = {
    label: string
    value: number
    icon: LucideIcon
    /** Tailwind classes for the small icon tile's background/text colour. */
    tile: string
}

/** Compact metric card used in the applications summary rows. */
export function StatTile({ label, value, icon: Icon, tile }: StatTileProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <span
                aria-hidden
                className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    tile
                )}
            >
                <Icon className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                {value}
            </p>
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {label}
            </p>
        </div>
    )
}
