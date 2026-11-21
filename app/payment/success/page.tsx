import Link from "next/link"
import { redirect } from "next/navigation"
import { Check, Clock } from "lucide-react"
import type Stripe from "stripe"

import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import {
    billingLabel,
    formatAmount,
    paymentPlans,
    type PaymentPlan,
} from "@/lib/payments"
import { stripe } from "@/lib/stripe"
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
 * to `paid`. Returns `null` when the API is unreachable — the page then falls
 * back to what Stripe itself already told us.
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

/**
 * Fetches the Stripe session behind the success URL. Returns `null` when there
 * is no id, or when Stripe rejects it (unknown id, key from another account,
 * revoked key) — the shopper then gets the friendly "payment not found" state
 * instead of a bare 404. The underlying reason still lands in the server log.
 */
async function retrieveSession(
    sessionId: string | undefined
): Promise<Stripe.Checkout.Session | null> {
    if (!sessionId) return null
    try {
        return await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "payment_intent"],
        })
    } catch (error) {
        console.error(
            "[payment/success] could not retrieve Stripe session",
            sessionId,
            error
        )
        return null
    }
}

/**
 * Works out which plan was bought: `?plan=` on the success URL → the session's
 * own metadata → the Stripe line item description. The success URL is written
 * by the API, so the first two are best-effort and the line item is the floor.
 */
function resolvePlan(
    planParam: string | undefined,
    session: Stripe.Checkout.Session,
    lineItems: Stripe.LineItem[]
): PaymentPlan | null {
    const byParam = paymentPlans.find((item) => item.id === planParam)
    if (byParam) return byParam

    const metaPlanId = session.metadata?.planId ?? session.metadata?.plan
    const byMeta = paymentPlans.find((item) => item.id === metaPlanId)
    if (byMeta) return byMeta

    const description = (lineItems[0]?.description ?? "").toLowerCase()
    return (
        paymentPlans.find((item) =>
            description.includes(item.name.toLowerCase())
        ) ?? null
    )
}

/** `999` / `"EUR"` → `"€9.99"`, in whatever currency Stripe charged. */
function formatMoney(cents: number, currency: string) {
    try {
        return new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency,
        }).format(cents / 100)
    } catch {
        // Unknown currency code — the app's EUR formatter still shows a value.
        return formatAmount(cents)
    }
}

/** Long Stripe ids — truncated visually, selectable in full. */
function IdChip({ id }: { id: string }) {
    return (
        <code
            title={id}
            className="max-w-[190px] truncate rounded bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground select-all"
        >
            {id}
        </code>
    )
}

/**
 * Rendered when the link doesn't match a checkout session we can read. Keeps
 * the shopper inside the app (no 404) with a way back to a working page.
 */
function PaymentNotFound() {
    return (
        <>
            <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
                <PaymentPageHeader
                    crumbs={[
                        { label: "Home", href: "/" },
                        { label: "Payment", href: "/payment" },
                        { label: "Success" },
                    ]}
                    title="We couldn't find that payment"
                    description="This link doesn't match a checkout session we can read. If your card was charged, the receipt is on its way to your email — reply to it and we'll resend the details."
                >
                    <span className="mt-1 flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <Clock aria-hidden className="size-6" />
                    </span>
                </PaymentPageHeader>

                <SectionCard
                    id="missing-heading"
                    title="What you can do"
                    description="Most likely the session expired or the link was opened twice."
                >
                    <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-muted-foreground">
                        <li>
                            Open the link from your Stripe receipt email — it carries
                            the session id we could not match.
                        </li>
                        <li>
                            Head back to the payment page to pick a plan again if the
                            checkout expired.
                        </li>
                        <li>
                            Still stuck? Contact support with the email address you
                            used at checkout.
                        </li>
                    </ul>
                </SectionCard>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/payment"
                        className={buttonVariants({ size: "lg" })}
                    >
                        Back to payment
                    </Link>
                    <Link
                        href="/dashboard/seeker/billing"
                        className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                        Go to billing
                    </Link>
                </div>
            </main>

            <SiteFooter />
        </>
    )
}

type PaymentSuccessPageProps = {
    searchParams: Promise<{ plan?: string; session_id?: string }>
}

/** Stripe return URL: `/payment/success?plan=<id>&session_id=<cs_...>`. */
export default async function PaymentSuccessPage({
    searchParams,
}: PaymentSuccessPageProps) {
    const { plan: planParam, session_id } = await searchParams

    const session = await retrieveSession(session_id)

    // No id, unknown id, or Stripe rejected it — show the friendly state
    // rather than Next's 404.
    if (!session) return <PaymentNotFound />

    // `open` (abandoned) and `expired` sessions have nothing to receipt — send
    // the shopper back to `/payment`, which owns the "canceled" notice.
    if (session.status !== "complete") {
        return redirect("/payment?canceled=1")
    }

    // Card payments settle immediately; other methods can stay `unpaid` for a
    // moment, in which case the page renders the "Processing" state below.
    const settled =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required"

    // Hand the verified session to the backend (plan activation etc.).
    const payment = await verifyPayment(session.id)

    // Stripe has already told us the session is complete — only trust the API
    // when it explicitly says otherwise, so a verify hiccup doesn't flip a
    // settled payment back to "Processing".
    const paid = payment?.paid ?? settled

    // Plan + receipt details.
    const lineItems = session.line_items?.data ?? []
    const planName = lineItems[0]?.description || "Hireloop Pro Plan"
    const plan = resolvePlan(planParam, session, lineItems)

    const paymentIntent =
        typeof session.payment_intent === "object" ? session.payment_intent : null
    const paymentIntentId =
        paymentIntent?.id ??
        (typeof session.payment_intent === "string"
            ? session.payment_intent
            : null)
    const chargeId =
        typeof paymentIntent?.latest_charge === "string"
            ? paymentIntent.latest_charge
            : paymentIntent?.latest_charge?.id ?? null
    // Subscription-mode checkouts (HireLoop Pro) leave `payment_intent` null
    // and carry the subscription id instead.
    const subscriptionId =
        typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null
    const transactionRef = chargeId ?? paymentIntentId ?? subscriptionId

    const customerEmail =
        session.customer_details?.email ?? session.customer_email ?? null
    const paidAt = new Date(session.created * 1000).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    })

    const currency = (session.currency ?? "eur").toUpperCase()
    const totalCents =
        session.amount_total ?? payment?.amountCents ?? plan?.amountCents ?? null

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
                    <div className="flex flex-col gap-2.5">
                        <SummaryRow
                            label="Plan"
                            value={payment?.planName ?? plan?.name ?? planName}
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
                            value={totalCents != null ? formatMoney(totalCents, currency) : "—"}
                            strong
                        />
                        <SummaryRow
                            label="Status"
                            value={paid ? "Paid" : "Processing"}
                        />
                        <SummaryRow label="Date" value={paidAt} />
                        {customerEmail && (
                            <SummaryRow label="Receipt email" value={customerEmail} />
                        )}
                    </div>
                </SectionCard>

                {/* Stripe references — quote these when contacting support. */}
                <SectionCard
                    id="payment-details-heading"
                    title="Payment details"
                    description="Keep these for your records or a support request"
                >
                    <div className="flex flex-col gap-2.5">
                        <SummaryRow
                            label="Transaction ID"
                            value={
                                transactionRef ? (
                                    <IdChip id={transactionRef} />
                                ) : (
                                    "—"
                                )
                            }
                        />
                        {paymentIntentId && (
                            <SummaryRow
                                label="Payment intent"
                                value={<IdChip id={paymentIntentId} />}
                            />
                        )}
                        {subscriptionId && (
                            <SummaryRow
                                label="Subscription"
                                value={<IdChip id={subscriptionId} />}
                            />
                        )}
                        <SummaryRow
                            label="Checkout session"
                            value={<IdChip id={session.id} />}
                        />
                    </div>
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
