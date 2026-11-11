"use client"

import * as React from "react"
import { MapPinIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "cn"

const chipOptions = ["Full Time", "Remote", "Part-Time", "Contract"]

function HeroSearch() {
  const [activeChips, setActiveChips] = React.useState<string[]>([])

  function toggleChip(chip: string) {
    setActiveChips((current) =>
      current.includes(chip)
        ? current.filter((option) => option !== chip)
        : [...current, chip]
    )
  }

  return (
    <div className="mx-auto w-full">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex w-full items-center gap-1.5 rounded-2xl border border-border bg-muted/40 p-2.5 pl-4 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur sm:gap-3 sm:pl-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input
            type="text"
            name="query"
            aria-label="Job title or keyword"
            placeholder="Job Title or Keyword"
            className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0 md:h-12 dark:bg-transparent"
          />
        </div>

        <span
          aria-hidden
          className="hidden h-6 w-px shrink-0 bg-border sm:block md:h-7"
        />

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MapPinIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input
            type="text"
            name="location"
            aria-label="Location"
            placeholder="Location"
            className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0 md:h-12 dark:bg-transparent"
          />
        </div>

        <Button
          type="submit"
          aria-label="Search jobs"
          className="size-11 shrink-0 rounded-xl md:size-12"
        >
          <SearchIcon />
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {chipOptions.map((chip) => {
          const isActive = activeChips.includes(chip)

          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleChip(chip)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none md:text-sm",
                isActive
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {chip}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { HeroSearch }
