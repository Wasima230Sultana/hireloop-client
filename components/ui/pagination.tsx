import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

type PaginationProps = {
    /** 1-based current page. */
    page: number
    /** Total number of pages (always ≥ 1). */
    pageCount: number
    onPageChange: (page: number) => void
}

type PageItem = number | "ellipsis"

/**
 * Collapses a page range into `1 … 4 5 6 … 42` style items:
 * always the first/last page plus one page either side of the current.
 */
function getPageItems(page: number, pageCount: number): PageItem[] {
    const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
        .filter((p) => p >= 1 && p <= pageCount)
        .sort((a, b) => a - b)

    const items: PageItem[] = []
    let previous = 0
    for (const p of pages) {
        if (p - previous > 1) items.push("ellipsis")
        items.push(p)
        previous = p
    }
    return items
}

function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
    if (pageCount <= 1) return null

    const items = getPageItems(page, pageCount)

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
            <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "disabled:opacity-40")}
            >
                <ChevronLeftIcon aria-hidden />
            </button>

            {items.map((item, index) =>
                item === "ellipsis" ? (
                    <span
                        key={`ellipsis-${index}`}
                        aria-hidden
                        className="px-1.5 text-sm text-muted-foreground"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        onClick={() => onPageChange(item)}
                        className={cn(
                            buttonVariants({ variant: "outline", size: "icon-sm" }),
                            item === page &&
                                "border-primary/50 bg-primary/10 font-medium text-primary hover:bg-primary/15 hover:text-primary"
                        )}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={() => onPageChange(page + 1)}
                className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "disabled:opacity-40")}
            >
                <ChevronRightIcon aria-hidden />
            </button>
        </nav>
    )
}

export { Pagination }
export type { PaginationProps }
