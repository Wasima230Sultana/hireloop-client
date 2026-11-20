"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    Check,
    ChevronRight,
    CreditCard,
    Info,
    LoaderCircle,
    Lock,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { createCheckoutSession } from "@/lib/api/payments"
import {
    billingLabel,
    formatAmount,
    paymentPlans,
    type PaymentPlan,
    type PaymentPlanId,
} from "@/lib/payments"
import { cn } from "cn"

/** Card brands / wallets accepted on the Stripe checkout. */
const paymentMethods = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"]

type Notice = { tone: "info" | "error"; message: string }

/** Selectable plan card in the left column. */
function PlanCard({
    plan,
    selected,
    onSelect,
}: {
    plan: PaymentPlan
    selected: boolean
    onSelect: () => void
}) {
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

/** Icon + label + value row used inside the "what's included" list. */
function FeatureItem({ text }: { text: string }) {
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

/** Small "label · value" row in the order summary. */
function SummaryRow({
    label,
    value,
    strong = false,
}: {
    label: string
    value: string
    strong?: boolean
}) {
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

export default function PaymentPage() {
    const router = useRouter()
    const { data: session, isPending } = useSession()
    const user = session?.user

    const [planId, setPlanId] = useState<PaymentPlanId>("applications-pack")
    const [paying, setPaying] = useState(false)
    const [notice, setNotice] = useState<Notice | null>(null)

    const plan = paymentPlans.find((item) => item.id === planId) ?? paymentPlans[0]

    async function handlePay() {
        // Payments are tied to an account so the purchase shows up in billing.
        if (!user) {
            router.push("/sign-in?redirectTo=/payment")
            return
        }

        setPaying(true)
        setNotice(null)

        try {
            const { url } = await createCheckoutSession({
                userId: user.id,
                email: user.email,
                planId: plan.id,
                amountCents: plan.amountCents,
                currency: plan.currency,
                successUrl: `${window.location.origin}/payment/success?plan=${plan.id}`,
                cancelUrl: `${window.location.origin}/payment`,
            })

            if (!url) {
                setNotice({
                    tone: "info",
                    message:
                        "Stripe checkout is not connected yet. Set NEXT_PUBLIC_STRIPE_PAYMENT_LINK in .env.local, or build POST /payments/checkout on the API, and this button will open Stripe.",
                })
                return
            }

            window.location.assign(url)
        } catch {
            setNotice({
                tone: "error",
                message: "We could not start your checkout. Please try again.",
            })
        } finally {
            setPaying(false)
        }
    }

    return (
        <>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                {/* Page header */}
                <div className="flex flex-col gap-1.5">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                        <Link href="/" className="hover:text-foreground">
                            Home
                        </Link>
                        <ChevronRight className="size-3.5" aria-hidden />
                        <span>Payment</span>
                    </nav>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Complete your payment
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Pick a plan, review your order, and pay securely through Stripe.
                        You will be redirected to Stripe to enter your card details.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left: plans + payment info */}
                    <div className="flex flex-col gap-6">
                        {/* Plan picker */}
                        <section aria-labelledby="plans-heading">
                            <h2
                                id="plans-heading"
                                className="text-base font-semibold"
                            >
                                Choose your plan
                            </h2>
                            <div
                                role="radiogroup"
                                aria-label="Payment plans"
                                className="mt-3 grid gap-3 sm:grid-cols-2"
                            >
                                {paymentPlans.map((item) => (
                                    <PlanCard
                                        key={item.id}
                                        plan={item}
                                        selected={item.id === planId}
                                        onSelect={() => {
                                            setPlanId(item.id)
                                            setNotice(null)
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* What's included */}
                        <section
                            aria-labelledby="included-heading"
                            className="rounded-xl border border-border bg-card p-6"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    aria-hidden
                                    className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                >
                                    {plan.id === "hireloop-pro" ? (
                                        <Zap className="size-4" />
                                    ) : (
                                        <CreditCard className="size-4" />
                                    )}
                                </span>
                                <div>
                                    <h2 id="included-heading" className="text-base font-semibold">
                                        {plan.name} includes
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {billingLabel(plan)} · {formatAmount(plan.amountCents)}
                                        {plan.billing === "monthly" ? " per month" : ""}
                                    </p>
                                </div>
                            </div>

                            <ul className="mt-4 flex flex-col gap-2.5">
                                {plan.features.map((feature) => (
                                    <FeatureItem key={feature} text={feature} />
                                ))}
                            </ul>
                        </section>

                        {/* Payment information */}
                        <section
                            aria-labelledby="info-heading"
                            className="rounded-xl border border-border bg-card p-6"
                        >
                            <h2 id="info-heading" className="text-base font-semibold">
                                Payment information
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
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
                                <li className="flex items-start gap-2.5">
                                    <Lock
                                        aria-hidden
                                        className="mt-0.5 size-4 shrink-0"
                                    />
                                    Card details are entered on Stripe&apos;s secure
                                    checkout and never touch HireLoop&apos;s servers.
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck
                                        aria-hidden
                                        className="mt-0.5 size-4 shrink-0"
                                    />
                                    Payments are processed by Stripe (PCI-DSS Level 1).
                                    All major cards and digital wallets are supported.
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                                    VAT is calculated by Stripe at checkout based on your
                                    billing country. You can cancel before confirming payment.
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Right: order summary */}
                    <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
                        <h2 className="text-base font-semibold">Order summary</h2>

                        <div className="mt-4 flex items-start justify-between gap-3 border-b border-border pb-4">
                            <div className="min-w-0">
                                <p className="font-medium">{plan.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {billingLabel(plan)}
                                </p>
                            </div>
                            <p className="shrink-0 font-medium tabular-nums">
                                {formatAmount(plan.amountCents)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5 py-4">
                            <SummaryRow
                                label="Subtotal"
                                value={formatAmount(plan.amountCents)}
                            />
                            <SummaryRow label="VAT" value="Calculated at checkout" />
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                            <span className="text-sm font-medium">Total due</span>
                            <span className="text-xl font-semibold tabular-nums">
                                {formatAmount(plan.amountCents)}
                                {plan.billing === "monthly" && (
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {" "}
                                        / month
                                    </span>
                                )}
                            </span>
                        </div>

                        <p className="mt-4 text-xs text-muted-foreground">
                            {isPending
                                ? "Checking your account…"
                                : user
                                    ? `Paying as ${user.email}`
                                    : "You will be asked to sign in before paying."}
                        </p>

                        <Button
                            onClick={handlePay}
                            disabled={paying || isPending}
                            className="mt-3 h-11 w-full gap-2 rounded-lg text-sm"
                        >
                            {paying ? (
                                <>
                                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                                    Redirecting to Stripe…
                                </>
                            ) : (
                                <>
                                    <Lock aria-hidden className="size-4" />
                                    Pay {formatAmount(plan.amountCents)}
                                    <ArrowRight aria-hidden className="size-4" />
                                </>
                            )}
                        </Button>

                        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                            <ShieldCheck aria-hidden className="size-3.5" />
                            Secured by Stripe · You will review the final amount there
                        </p>

                        {notice && (
                            <p
                                role={notice.tone === "error" ? "alert" : "status"}
                                className={cn(
                                    "mt-4 rounded-lg border px-3 py-2.5 text-xs",
                                    notice.tone === "error"
                                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                                        : "border-border bg-muted/40 text-muted-foreground"
                                )}
                            >
                                {notice.message}
                            </p>
                        )}

                        <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                            By continuing you agree to our{" "}
                            <Link
                                href="/#terms"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/#refunds"
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                Refund Policy
                            </Link>
                            .
                        </p>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </>
    )
}
