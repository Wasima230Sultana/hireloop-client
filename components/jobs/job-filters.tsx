"use client"

import type { ReactNode } from "react"
import { CheckIcon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { jobCategories, jobTypes } from "@/lib/jobs"
import { cn } from "cn"

/** The filter state shared between the sidebar and the job list. */
type JobFilterValue = {
    search: string
    jobTypes: string[]
    categories: string[]
    remoteOnly: boolean
}

type JobFiltersProps = {
    value: JobFilterValue
    /** Receives a partial patch; the owner merges it and resets pagination. */
    onChange: (patch: Partial<JobFilterValue>) => void
    /** How many jobs match each option, across the whole result set. */
    jobTypeCounts: Record<string, number>
    categoryCounts: Record<string, number>
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="flex flex-col gap-2">{children}</div>
        </section>
    )
}

function FilterCheckbox({
    label,
    count,
    checked,
    onCheckedChange,
}: {
    label: string
    count?: number
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(event) => onCheckedChange(event.target.checked)}
            />
            <span
                aria-hidden
                className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border border-border bg-background transition-colors",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50",
                    checked && "border-primary bg-primary"
                )}
            >
                {checked && <CheckIcon className="size-3 text-primary-foreground" />}
            </span>
            <span className={cn("flex-1 truncate", checked && "text-foreground")}>
                {label}
            </span>
            {count !== undefined && (
                <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
            )}
        </label>
    )
}

function toggleValue(values: string[], value: string, checked: boolean) {
    return checked
        ? [...values, value]
        : values.filter((item) => item !== value)
}

function JobFilters({
    value,
    onChange,
    jobTypeCounts,
    categoryCounts,
}: JobFiltersProps) {
    const hasActiveFilters =
        value.jobTypes.length > 0 || value.categories.length > 0 || value.remoteOnly

    return (
        <aside
            aria-label="Job filters"
            className="h-fit rounded-xl border border-border bg-card p-4"
        >
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Filters</h2>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() =>
                            onChange({ jobTypes: [], categories: [], remoteOnly: false })
                        }
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="mt-4 flex flex-col gap-5">
                <FilterGroup title="Job Type">
                    {jobTypes.map((type) => (
                        <FilterCheckbox
                            key={type}
                            label={type}
                            count={jobTypeCounts[type] ?? 0}
                            checked={value.jobTypes.includes(type)}
                            onCheckedChange={(checked) =>
                                onChange({
                                    jobTypes: toggleValue(value.jobTypes, type, checked),
                                })
                            }
                        />
                    ))}
                </FilterGroup>

                <FilterGroup title="Category">
                    {Object.entries(jobCategories).map(([key, label]) => (
                        <FilterCheckbox
                            key={key}
                            label={label}
                            count={categoryCounts[key] ?? 0}
                            checked={value.categories.includes(key)}
                            onCheckedChange={(checked) =>
                                onChange({
                                    categories: toggleValue(value.categories, key, checked),
                                })
                            }
                        />
                    ))}
                </FilterGroup>

                <FilterGroup title="Workplace">
                    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <span>Remote only</span>
                        <Switch
                            checked={value.remoteOnly}
                            onCheckedChange={(checked) => onChange({ remoteOnly: checked })}
                            aria-label="Remote only"
                        />
                    </label>
                </FilterGroup>
            </div>
        </aside>
    )
}

export { JobFilters, FilterGroup, FilterCheckbox }
export type { JobFiltersProps, JobFilterValue }
