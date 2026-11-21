"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { useSession } from "@/lib/auth-client"
import { createCheckoutSession } from "@/lib/api/payments"
import {
    paymentPlans,
    type PaymentPlanId,
} from "@/lib/payments"
import { OrderSummary } from "./order-summary"
import { PaymentInfo } from "./payment-info"
import { PaymentPageHeader } from "./page-header"
import { PlanFeatures } from "./plan-features"
import { PlanPicker } from "./plan-picker"
import { type NoticeState } from "./notice"

type PaymentCheckoutProps = {
    /** True when Stripe bounced the shopper back with `?canceled=1`. */
    canceled: boolean
}

/** Interactive body of `/payment`: plan selection, info, and checkout action. */
export function PaymentCheckout({ canceled }: PaymentCheckoutProps) {
    const router = useRouter()
    const { data: session, isPending } = useSession()
    const user = session?.user

    const [planId, setPlanId] = useState<PaymentPlanId>("applications-pack")
    const [paying, setPaying] = useState(false)
    const [notice, setNotice] = useState<NoticeState | null>(
        canceled
            ? {
                  tone: "info",
                  message:
                      "Payment canceled — no charge was made. Pick a plan whenever you are ready.",
              }
            : null
    )

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
            })

            window.location.assign(url)
        } catch (error) {
            // The API explains itself (e.g. a missing STRIPE_SECRET_KEY), so
            // surface its message instead of a generic failure.
            setNotice({
                tone: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "We could not start your checkout. Please try again.",
            })
        } finally {
            setPaying(false)
        }
    }

    return (
        <>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                <PaymentPageHeader
                    crumbs={[
                        { label: "Home", href: "/" },
                        { label: "Payment" },
                    ]}
                    title="Complete your payment"
                    description="Pick a plan, review your order, and pay securely through Stripe. You will be redirected to Stripe to enter your card details."
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left: plans + payment info */}
                    <div className="flex flex-col gap-6">
                        <PlanPicker
                            value={planId}
                            onChange={(id) => {
                                setPlanId(id)
                                setNotice(null)
                            }}
                        />
                        <PlanFeatures plan={plan} />
                        <PaymentInfo />
                    </div>

                    {/* Right: order summary */}
                    <OrderSummary
                        plan={plan}
                        email={user?.email ?? null}
                        accountPending={isPending}
                        paying={paying}
                        notice={notice}
                        onPay={handlePay}
                    />
                </div>
            </main>

            <SiteFooter />
        </>
    )
}
