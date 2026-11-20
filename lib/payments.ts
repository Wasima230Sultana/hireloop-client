/** Plans offered on the checkout page. */
export type PaymentPlanId = "applications-pack" | "hireloop-pro"

export type PaymentPlan = {
    id: PaymentPlanId
    name: string
    /** One-line pitch shown under the plan name. */
    blurb: string
    /** Price in minor units (cents) — the format Stripe expects. */
    amountCents: number
    currency: "eur"
    billing: "one-time" | "monthly"
    /** Selling points listed on the plan card and the summary. */
    features: string[]
    /** Draws the "Most popular" ribbon. */
    highlight?: boolean
}

export const paymentPlans: PaymentPlan[] = [
    {
        id: "applications-pack",
        name: "Application Pack",
        blurb: "Keep applying after your first 10 applications.",
        amountCents: 999,
        currency: "eur",
        billing: "one-time",
        features: [
            "10 additional job applications",
            "Applications never expire",
            "Full application history in your dashboard",
            "One-time payment, no subscription",
        ],
    },
    {
        id: "hireloop-pro",
        name: "HireLoop Pro",
        blurb: "Unlimited applications for serious job seekers.",
        amountCents: 1999,
        currency: "eur",
        billing: "monthly",
        features: [
            "Unlimited job applications",
            "Profile highlighted to recruiters",
            "Priority support",
            "Cancel anytime",
        ],
        highlight: true,
    },
]

export function getPaymentPlan(id: PaymentPlanId): PaymentPlan {
    return paymentPlans.find((plan) => plan.id === id) ?? paymentPlans[0]
}

const priceFormatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
})

/** `999` → `"€9.99"`. */
export function formatAmount(cents: number) {
    return priceFormatter.format(cents / 100)
}

/** "one-time" → "Billed once", "monthly" → "Billed monthly". */
export function billingLabel(plan: PaymentPlan) {
    return plan.billing === "monthly" ? "Billed monthly" : "Billed once"
}
