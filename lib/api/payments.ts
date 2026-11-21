import type { PaymentPlanId } from "@/lib/payments"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Payload posted to `POST /payments/checkout`. Prices are set server-side. */
export type CheckoutPayload = {
    userId: string
    email: string
    planId: PaymentPlanId
}

export type CheckoutStart = {
    /** Stripe-hosted checkout URL the browser should be sent to. */
    url: string
    sessionId: string
}

/**
 * Creates a Stripe Checkout Session on the API (`POST /payments/checkout`)
 * and returns the URL to redirect to.
 *
 * Throws an `Error` whose message is the API's own message — e.g. a missing
 * `STRIPE_SECRET_KEY` comes back as a 501 the UI can show verbatim.
 */
export const createCheckoutSession = async (
    payload: CheckoutPayload
): Promise<CheckoutStart> => {
    const response = await fetch(`${BASE_URL}/payments/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
    })

    const data = (await response.json().catch(() => null)) as
        | { url?: string; sessionId?: string; error?: string }
        | null

    if (!response.ok) {
        throw new Error(data?.error || "We could not start your checkout.")
    }

    if (!data?.url) {
        throw new Error("Stripe did not return a checkout URL.")
    }

    return { url: data.url, sessionId: data.sessionId ?? "" }
}
