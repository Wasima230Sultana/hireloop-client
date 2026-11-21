import { Check, Sparkles } from "lucide-react"

import { billingLabel, formatAmount, type PaymentPlan } from "@/lib/payments"
import { cn } from "cn"

type PlanCardProps = {
    plan: PaymentPlan
    selected: boolean
    onSelect: () => void
}

/** Selectable plan card shown in the plan picker. */
export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className={cn(
                "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected
                    ? "border-foreground bg-muted/40"
                    : "border-border bg-card hover:border-foreground/40"
            )}
        >
            {plan.highlight && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Sparkles aria-hidden className="size-3" />
                    Most popular
                </span>
            )}

            <span
                aria-hidden
                className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border"
                )}
            >
                {selected && <Check className="size-3.5" />}
            </span>

            <span className="font-medium">{plan.name}</span>
            <span className="text-sm text-muted-foreground">{plan.blurb}</span>

            <span className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                    {formatAmount(plan.amountCents)}
                </span>
                <span className="text-xs text-muted-foreground">
                    {plan.billing === "monthly" ? "/ month" : "one-time"}
                </span>
            </span>
            <span className="text-xs text-muted-foreground">{billingLabel(plan)}</span>
        </button>
    )
}
