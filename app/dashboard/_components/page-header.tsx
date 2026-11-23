import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

export type Crumb = {
    label: string
    /** Omitted on the last (current) crumb. */
    href?: string
}

type DashboardPageHeaderProps = {
    /** Crumbs from the dashboard root down to the current page. */
    crumbs: Crumb[]
    title: string
    description?: string
    /** Rendered on the far right of the header (e.g. a primary action). */
    action?: ReactNode
}

/** Breadcrumb + page title + subtitle + action shared by dashboard pages. */
export function DashboardPageHeader({
    crumbs,
    title,
    description,
    action,
}: DashboardPageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                    {crumbs.map((crumb, index) => (
                        <span
                            key={crumb.label}
                            className="flex items-center gap-1.5"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    className="size-3.5"
                                    aria-hidden
                                />
                            )}
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-foreground"
                                >
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
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    )
}
