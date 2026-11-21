import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type Crumb = {
    label: string
    /** Omitted on the last (current) crumb. */
    href?: string
}

type PaymentPageHeaderProps = {
    /** Crumbs from the site root down to the current page. */
    crumbs: Crumb[]
    title: string
    description?: string
    /** Extra content rendered under the description (e.g. a notice). */
    children?: React.ReactNode
}

/** Breadcrumb + page title + subtitle shared by the payment pages. */
export function PaymentPageHeader({
    crumbs,
    title,
    description,
    children,
}: PaymentPageHeaderProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                {crumbs.map((crumb, index) => (
                    <span key={crumb.label} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-foreground">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span aria-current="page">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>

            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

            {description && (
                <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}

            {children}
        </div>
    )
}
