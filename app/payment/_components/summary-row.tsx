import { cn } from "cn"

type SummaryRowProps = {
    label: string
    value: string
    /** Renders the row in the emphasised "total" style. */
    strong?: boolean
}

/** Small "label · value" row used in the order summary. */
export function SummaryRow({ label, value, strong = false }: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className={strong ? "font-medium" : "text-muted-foreground"}>
                {label}
            </span>
            <span
                className={cn(
                    "tabular-nums",
                    strong ? "font-semibold" : "font-medium"
                )}
            >
                {value}
            </span>
        </div>
    )
}
