import { Info, Lock, ShieldCheck } from "lucide-react"

import { SectionCard } from "./section-card"

/** Card brands / wallets accepted on the Stripe checkout. */
export const paymentMethods = [
    "Visa",
    "Mastercard",
    "Amex",
    "Apple Pay",
    "Google Pay",
]

const securityNotes = [
    {
        icon: Lock,
        text: "Card details are entered on Stripe's secure checkout and never touch HireLoop's servers.",
    },
    {
        icon: ShieldCheck,
        text: "Payments are processed by Stripe (PCI-DSS Level 1). All major cards and digital wallets are supported.",
    },
    {
        icon: Info,
        text: "VAT is calculated by Stripe at checkout based on your billing country. You can cancel before confirming payment.",
    },
] as const

/** Static "Payment information" card: accepted methods + security notes. */
export function PaymentInfo() {
    return (
        <SectionCard id="info-heading" title="Payment information">
            <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                    <span
                        key={method}
                        className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                        {method}
                    </span>
                ))}
            </div>

            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                {securityNotes.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-2.5">
                        <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                        {text}
                    </li>
                ))}
            </ul>
        </SectionCard>
    )
}
