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

/** Applications a seeker may submit before any payment is required. */
export const FREE_APPLICATIONS = 5

/** Extra applications unlocked by one paid Application Pack. */
export const PACK_APPLICATIONS = 10

/** The part of an API `payments` row the quota check cares about. */
export type PaidPlan = {
    planId?: string
    status?: string
}

/**
 * How many applications a seeker may submit, given what they have bought:
 * 5 free, +10 per Application Pack, and HireLoop Pro is unlimited.
 *
 * Returns `null` for unlimited. Only rows the API has marked `paid` count —
 * a checkout that was started but never completed grants nothing.
 */
export function applicationAllowance(payments: PaidPlan[]): number | null {
    const paid = payments.filter((payment) => payment.status === "paid")

    if (paid.some((payment) => payment.planId === "hireloop-pro")) return null

    const packs = paid.filter(
        (payment) => payment.planId === "applications-pack"
    ).length

    return FREE_APPLICATIONS + packs * PACK_APPLICATIONS
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
