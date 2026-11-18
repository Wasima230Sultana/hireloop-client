"use client"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type JobSearchBarProps = {
    value: string
    /** Fired on every keystroke so results update instantly. */
    onValueChange: (value: string) => void
    /** Placeholder shown in the input. */
    placeholder?: string
}

function JobSearchBar({
    value,
    onValueChange,
    placeholder = "Search by job title, keywords…",
}: JobSearchBarProps) {
    return (
        <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted/40 p-2 pl-4"
        >
            <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />

            <Input
                type="search"
                name="q"
                aria-label="Search jobs"
                placeholder={placeholder}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent [&::-webkit-search-cancel-button]:cursor-pointer"
            />

            <Button type="submit" className="h-10 shrink-0 px-5">
                Search Jobs
            </Button>
        </form>
    )
}

export { JobSearchBar }
export type { JobSearchBarProps }
