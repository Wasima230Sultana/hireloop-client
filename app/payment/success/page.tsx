import Link from "next/link"
import { Check, Clock } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { billingLabel, formatAmount, paymentPlans } from "@/lib/payments"
import { FeatureItem } from "../_components/plan-features"
import { PaymentPageHeader } from "../_components/page-header"
import { SectionCard } from "../_components/section-card"
import { SummaryRow } from "../_components/summary-row"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

type VerifyResult = {
    paid?: boolean
    status?: string
    planName?: string
    amountCents?: number
}

/**
 * Asks the API to confirm the Stripe session and flip our `payments` record
 * to `paid`. Returns `null` when there is no session id to verify (or the API
 * is unreachable) — the page then falls back to the plan details.
 */
async function verifyPayment(sessionId: string): Promise<VerifyResult | null> {
    try {
        const response = await fetch(
            `${BASE_URL}/payments/verify?sessionId=${encodeURIComponent(sessionId)}`,
            { cache: "no-store" }
        )
        if (!response.ok) return null
        return (await response.json()) as VerifyResult
    } catch {
        return null
    }
}

type PaymentSuccessPageProps = {
    searchParams: Promise<{ plan?: string; session_id?: string }>
}

/** Stripe return URL: `/payment/success?plan=<id>&session_id=<cs_...>`. */
export default async function PaymentSuccessPage({
    searchParams,
}: PaymentSuccessPageProps) {
    const { plan: planParam, session_id: sessionId } = await searchParams
    const plan = paymentPlans.find((item) => item.id === planParam) ?? null
    const payment = sessionId ? await verifyPayment(sessionId) : null
    const paid = Boolean(payment?.paid)

    const totalCents = payment?.amountCents ?? plan?.amountCents ?? null

    return (
        <>
            <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
                <PaymentPageHeader
                    crumbs={[
                        { label: "Home", href: "/" },
                        { label: "Payment", href: "/payment" },
                        { label: "Success" },
                    ]}
                    title={paid ? "Payment successful" : "Payment received"}
                    description={
                        paid
                            ? "Thanks for your purchase — your account has been upgraded and you can keep applying right away."
                            : "We are confirming your payment with Stripe. You will get an email as soon as it clears."
                    }
                >
                    <span
                        className={
                            paid
                                ? "mt-1 flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "mt-1 flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }
                    >
                        {paid ? (
                            <Check aria-hidden className="size-6" />
                        ) : (
                            <Clock aria-hidden className="size-6" />
                        )}
                    </span>
                </PaymentPageHeader>

                {/* Receipt */}
                <SectionCard id="receipt-heading" title="Receipt">
                    {plan || payment ? (
                        <div className="flex flex-col gap-2.5">
                            <SummaryRow
                                label="Plan"
                                value={payment?.planName ?? plan?.name ?? "—"}
                                strong
                            />
                            {plan && (
                                <SummaryRow
                                    label="Billing"
                                    value={billingLabel(plan)}
                                />
                            )}
                            <SummaryRow
                                label="Total paid"
                                value={
                                    totalCents != null
                                        ? formatAmount(totalCents)
                                        : "—"
                                }
                                strong
                            />
                            <SummaryRow
                                label="Status"
                                value={paid ? "Paid" : "Processing"}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Your payment was received. A receipt has been emailed to
                            you — reach out to support if you need a copy.
                        </p>
                    )}
                </SectionCard>

                {/* Unlocked perks */}
                {paid && plan && (
                    <SectionCard
                        id="unlocked-heading"
                        title={`Your ${plan.name} benefits`}
                        description={billingLabel(plan)}
                    >
                        <ul className="flex flex-col gap-2.5">
                            {plan.features.map((feature) => (
                                <FeatureItem key={feature} text={feature} />
                            ))}
                        </ul>
                    </SectionCard>
                )}

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/seeker/billing"
                        className={buttonVariants({ size: "lg" })}
                    >
                        Go to billing
                    </Link>
                    <Link
                        href="/browse-jobs"
                        className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                        Browse jobs
                    </Link>
                </div>
            </main>

            <SiteFooter />
        </>
    )
}
