import { PaymentCheckout } from "./_components/payment-checkout"

type PaymentPageProps = {
    searchParams: Promise<{ canceled?: string }>
}

/**
 * Checkout entry point. Server-side shell only: it reads `?canceled=1`
 * (Stripe's cancel redirect) and hands the flag to the client checkout body,
 * which owns all of the interactive state.
 */
export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { canceled } = await searchParams

    return <PaymentCheckout canceled={Boolean(canceled)} />
}
