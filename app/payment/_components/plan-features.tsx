import { Check, CreditCard, Zap } from "lucide-react"

import { billingLabel, formatAmount, type PaymentPlan } from "@/lib/payments"
import { SectionCard } from "./section-card"

/** Single green-check bullet used in feature lists. */
export function FeatureItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2.5 text-sm">
            <span
                aria-hidden
                className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
                <Check className="size-3" />
            </span>
            <span className="text-muted-foreground">{text}</span>
        </li>
    )
}

/** "What's included" card for the currently selected plan. */
export function PlanFeatures({ plan }: { plan: PaymentPlan }) {
    return (
        <SectionCard
            id="included-heading"
            title={`${plan.name} includes`}
            description={
                <>
                    {billingLabel(plan)} · {formatAmount(plan.amountCents)}
                    {plan.billing === "monthly" ? " per month" : ""}
                </>
            }
            icon={plan.id === "hireloop-pro" ? Zap : CreditCard}
        >
            <ul className="flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                    <FeatureItem key={feature} text={feature} />
                ))}
            </ul>
        </SectionCard>
    )
}
