import {
    BadgeDollarSign,
    Briefcase,
    Code2,
    LineChart,
    Megaphone,
    Palette,
    Server,
    Users,
    type LucideIcon,
} from "lucide-react"

import {
    categoryLabel,
    jobCategories,
    type JobFormData,
} from "@/lib/jobs"
import { cn } from "cn"

export const categoryMeta: Record<
    keyof typeof jobCategories,
    { icon: LucideIcon; tile: string; label: string }
> = {
    "engineering-tech": {
        icon: Code2,
        tile: "bg-primary/10 text-primary",
        label: "text-primary",
    },
    design: {
        icon: Palette,
        tile: "bg-orange-500/10 text-orange-500",
        label: "text-orange-500",
    },
    marketing: {
        icon: Megaphone,
        tile: "bg-sky-500/10 text-sky-500",
        label: "text-sky-500",
    },
    sales: {
        icon: LineChart,
        tile: "bg-violet-500/10 text-violet-500",
        label: "text-violet-500",
    },
    finance: {
        icon: BadgeDollarSign,
        tile: "bg-emerald-500/10 text-emerald-500",
        label: "text-emerald-500",
    },
    "customer-support": {
        icon: Users,
        tile: "bg-amber-500/10 text-amber-500",
        label: "text-amber-500",
    },
    operations: {
        icon: Server,
        tile: "bg-teal-500/10 text-teal-500",
        label: "text-teal-500",
    },
}

/** Rounded tile with the icon matching a job's category. */
export function CategoryIcon({
    category,
}: {
    category: JobFormData["category"]
}) {
    const meta = category ? categoryMeta[category] : null
    const Icon = meta?.icon ?? Briefcase

    return (
        <span
            className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                meta?.tile ?? "bg-muted text-muted-foreground"
            )}
        >
            <Icon className="size-4" aria-hidden />
        </span>
    )
}

/** Category name rendered in the category's accent color. */
export function CategoryLabel({
    category,
}: {
    category: JobFormData["category"]
}) {
    const meta = category ? categoryMeta[category] : null

    return (
        <p className={cn("text-xs", meta?.label ?? "text-muted-foreground")}>
            {categoryLabel(category)}
        </p>
    )
}
