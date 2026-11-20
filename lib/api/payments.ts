import type { PaymentPlanId } from "@/lib/payments"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Static Stripe payment link used until `POST /payments/checkout` exists on the
 * API. Set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` in `.env.local` to point straight
 * at a Stripe-hosted checkout page.
 */
const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || ""

/** Payload posted to `POST /payments/checkout` to create a Stripe session. */
export type CheckoutPayload = {
    userId: string
    email: string
    planId: PaymentPlanId
    /** Price in minor units (cents). */
    amountCents: number
    currency: string
    /** Where Stripe sends the browser after a successful payment. */
    successUrl: string
    /** Where Stripe sends the browser if the shopper cancels. */
    cancelUrl: string
}

export type CheckoutStart = {
    /** Absolute URL to send the shopper to. Empty when nothing is configured. */
    url: string
    /** Which source produced the URL — useful for logs and UI hints. */
    source: "api" | "payment-link" | "none"
}

/**
 * Starts a Stripe Checkout session.
 *
 * Order of preference:
 * 1. `POST /payments/checkout` on the API (server creates the session) — not
 *    implemented yet, so a 404/501 falls through to the next option.
 * 2. `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` — a Stripe-hosted payment link.
 * 3. Neither configured → `url: ""`, and the caller shows a setup notice.
 */
export const createCheckoutSession = async (
    payload: CheckoutPayload
): Promise<CheckoutStart> => {
    try {
        const response = await fetch(`${BASE_URL}/payments/checkout`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
        })

        // Endpoint not built yet (or not routed) — try the static payment link.
        if (response.status !== 404 && response.status !== 501) {
            if (!response.ok) {
                throw new Error("Could not start checkout.")
            }

            const data = (await response.json()) as { url?: string }
            if (data.url) {
                return { url: data.url, source: "api" }
            }
        }
    } catch (error) {
        // Network failure: fall back to the payment link below instead of
        // blocking the shopper.
        if (error instanceof Error && error.message === "Could not start checkout.") {
            throw error
        }
    }

    if (STRIPE_PAYMENT_LINK) {
        return { url: STRIPE_PAYMENT_LINK, source: "payment-link" }
    }

    return { url: "", source: "none" }
}
