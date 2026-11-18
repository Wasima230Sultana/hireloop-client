"use client"

import { useMemo, useState } from "react"

import { JobCard } from "@/components/jobs/job-card"
import {
    JobFilters,
    type JobFilterValue,
} from "@/components/jobs/job-filters"
import { JobSearchBar } from "@/components/jobs/job-search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { buttonVariants } from "@/components/ui/button"
import {
    categoryLabel,
    jobSortKey,
    type JobListing,
} from "@/lib/jobs"

const PAGE_SIZE = 6

const SORT_OPTIONS = {
    recent: "Most Recent",
    oldest: "Oldest",
    deadline: "Deadline Soonest",
} as const

type SortKey = keyof typeof SORT_OPTIONS

/** The sidebar filter state plus the list sort order. */
type Filters = JobFilterValue & { sort: SortKey }

const INITIAL_FILTERS: Filters = {
    search: "",
    jobTypes: [],
    categories: [],
    remoteOnly: false,
    sort: "recent",
}

function countBy(jobs: JobListing[], getKey: (job: JobListing) => string) {
    const counts: Record<string, number> = {}
    for (const job of jobs) {
        const key = getKey(job)
        counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
}

function matchesSearch(job: JobListing, query: string) {
    return [
        job.title,
        job.companyName,
        job.location,
        job.responsibilities,
        job.requirements,
        categoryLabel(job.category),
        job.jobType,
    ].some((field) => field.toLowerCase().includes(query))
}

function deadlineKey(job: JobListing) {
    if (!job.deadline) return Number.POSITIVE_INFINITY
    const time = Date.parse(job.deadline)
    return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY
}

function sortJobs(jobs: JobListing[], sort: SortKey): JobListing[] {
    const sorted = [...jobs]
    switch (sort) {
        case "oldest":
            return sorted.sort((a, b) => jobSortKey(a) - jobSortKey(b))
        case "deadline":
            return sorted.sort((a, b) => deadlineKey(a) - deadlineKey(b))
        default:
            return sorted.sort((a, b) => jobSortKey(b) - jobSortKey(a))
    }
}

function JobsExplorer({ jobs }: { jobs: JobListing[] }) {
    const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
    const [page, setPage] = useState(1)

    /** Applies a filter change and always takes the user back to page 1. */
    function applyFilters(patch: Partial<Filters>) {
        setFilters((previous) => ({ ...previous, ...patch }))
        setPage(1)
    }

    const jobTypeCounts = useMemo(
        () => countBy(jobs, (job) => job.jobType),
        [jobs]
    )
    const categoryCounts = useMemo(
        () => countBy(jobs, (job) => job.category),
        [jobs]
    )

    const results = useMemo(() => {
        const query = filters.search.trim().toLowerCase()

        const filtered = jobs.filter((job) => {
            if (query && !matchesSearch(job, query)) return false
            if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType))
                return false
            if (
                filters.categories.length > 0 &&
                !filters.categories.includes(job.category)
            )
                return false
            if (filters.remoteOnly && !job.isRemote) return false
            return true
        })

        return sortJobs(filtered, filters.sort)
    }, [jobs, filters])

    const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
    const currentPage = Math.min(page, pageCount)
    const pageJobs = results.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    function clearFilters() {
        applyFilters({
            search: "",
            jobTypes: [],
            categories: [],
            remoteOnly: false,
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <JobSearchBar
                value={filters.search}
                onValueChange={(search) => applyFilters({ search })}
            />

            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <JobFilters
                    value={filters}
                    onChange={applyFilters}
                    jobTypeCounts={jobTypeCounts}
                    categoryCounts={categoryCounts}
                />

                <section aria-label="Job results" className="flex min-w-0 flex-col gap-4">
                    {/* Results header */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p
                            role="status"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Found {results.length} Professional{" "}
                            {results.length === 1 ? "Job" : "Jobs"}
                        </p>

                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            Sort by:
                            <Select
                                value={filters.sort}
                                onValueChange={(value) => {
                                    if (value && value in SORT_OPTIONS) {
                                        applyFilters({ sort: value as SortKey })
                                    }
                                }}
                                items={SORT_OPTIONS}
                            >
                                <SelectTrigger aria-label="Sort jobs" size="sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    {/* Results */}
                    {results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                            <p className="font-medium">
                                {jobs.length === 0
                                    ? "No jobs posted yet"
                                    : "No jobs match your filters"}
                            </p>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                {jobs.length === 0
                                    ? "Check back soon — new opportunities are added every day."
                                    : "Try adjusting your search or clearing some filters."}
                            </p>
                            {jobs.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className={buttonVariants({ variant: "outline" })}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {pageJobs.map((job) => (
                                <li key={job._id}>
                                    <JobCard job={job} />
                                </li>
                            ))}
                        </ul>
                    )}

                    <Pagination
                        page={currentPage}
                        pageCount={pageCount}
                        onPageChange={setPage}
                    />
                </section>
            </div>
        </div>
    )
}

export { JobsExplorer }
