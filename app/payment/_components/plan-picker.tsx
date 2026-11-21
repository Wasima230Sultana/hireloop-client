import { paymentPlans, type PaymentPlanId } from "@/lib/payments"
import { PlanCard } from "./plan-card"

type PlanPickerProps = {
    value: PaymentPlanId
    onChange: (id: PaymentPlanId) => void
}

/** "Choose your plan" section: a radio group of every purchasable plan. */
export function PlanPicker({ value, onChange }: PlanPickerProps) {
    return (
        <section aria-labelledby="plans-heading">
            <h2 id="plans-heading" className="text-base font-semibold">
                Choose your plan
            </h2>

            <div
                role="radiogroup"
                aria-label="Payment plans"
                className="mt-3 grid gap-3 sm:grid-cols-2"
            >
                {paymentPlans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        selected={plan.id === value}
                        onSelect={() => onChange(plan.id)}
                    />
                ))}
            </div>
        </section>
    )
}
