import Link from "next/link"
import { ArrowRight, LoaderCircle, Lock, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    billingLabel,
    formatAmount,
    type PaymentPlan,
} from "@/lib/payments"
import { Notice, type NoticeState } from "./notice"
import { SummaryRow } from "./summary-row"

type OrderSummaryProps = {
    plan: PaymentPlan
    /** Email of the signed-in buyer, or `null` when signed out. */
    email: string | null
    /** True while the auth session is still resolving. */
    accountPending: boolean
    /** True while the checkout session is being created. */
    paying: boolean
    notice: NoticeState | null
    onPay: () => void
}

/** Sticky order summary with the pay button. */
export function OrderSummary({
    plan,
    email,
    accountPending,
    paying,
    notice,
    onPay,
}: OrderSummaryProps) {
    return (
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
                {accountPending
                    ? "Checking your account…"
                    : email
                        ? `Paying as ${email}`
                        : "You will be asked to sign in before paying."}
            </p>

            <Button
                onClick={onPay}
                disabled={paying || accountPending}
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
                <Notice tone={notice.tone} className="mt-4">
                    {notice.message}
                </Notice>
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
    )
}
