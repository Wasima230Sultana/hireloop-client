"use client"

import { useMemo, useState } from "react"
import {
    CalendarDays,
    Inbox,
    Search,
    Send,
    TrendingUp,
    Users,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { ApplicationStatusBadge } from "@/app/dashboard/_components/application-status-badge"
import { EmptyState } from "@/app/dashboard/_components/empty-state"
import { StatTile } from "@/app/dashboard/_components/stat-tile"
import {
    applicationStatuses,
    countByStatus,
    formatAppliedDate,
    type ApplicationRow,
    type ApplicationStatus,
} from "@/lib/applications"
import { cn } from "cn"
import { StatusSelect } from "./status-select"

type Filter = "All" | ApplicationStatus

const filters: Filter[] = ["All", ...applicationStatuses]

const statTiles = [
    {
        key: "total",
        label: "Applicants",
        icon: Users,
        tile: "bg-primary/10 text-primary",
    },
    {
        key: "review",
        label: "In Review",
        icon: TrendingUp,
        tile: "bg-amber-500/10 text-amber-500",
    },
    {
        key: "interview",
        label: "Interviews",
        icon: CalendarDays,
        tile: "bg-violet-500/10 text-violet-500",
    },
    {
        key: "offer",
        label: "Offers",
        icon: Send,
        tile: "bg-emerald-500/10 text-emerald-500",
    },
] as const

/** One applicant: identity, cover letter, and the status control. */
function ApplicantCard({
    applicant,
    onStatusChange,
}: {
    applicant: ApplicationRow
    onStatusChange: (id: string, status: ApplicationStatus) => void
}) {
    return (
        <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <span
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary"
                    >
                        {applicant.applicantName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="font-medium">{applicant.applicantName}</p>
                        {applicant.email ? (
                            <a
                                href={`mailto:${applicant.email}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                            >
                                {applicant.email}
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No email on file
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                    <ApplicationStatusBadge status={applicant.status} />
                    <span
                        className="text-xs text-muted-foreground"
                        title={formatAppliedDate(applicant.appliedAt)}
                    >
                        Applied {applicant.appliedLabel}
                    </span>
                </div>
            </div>

            {applicant.coverLetter && (
                <div className="mt-4 rounded-lg bg-muted/40 p-4">
                    <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Cover letter
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                        {applicant.coverLetter}
                    </p>
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                    Move this candidate to the next stage
                </p>
                <StatusSelect
                    applicationId={applicant._id}
                    status={applicant.status}
                    onStatusChange={(status) =>
                        onStatusChange(applicant._id, status)
                    }
                />
            </div>
        </article>
    )
}

/**
 * Recruiter's applicant review list: summary counts, status filters, search,
 * and one card per candidate with an inline status update.
 */
export function ApplicantsList({
    applicants,
    jobTitle,
}: {
    applicants: ApplicationRow[]
    jobTitle: string
}) {
    const [rows, setRows] = useState(applicants)
    const [filter, setFilter] = useState<Filter>("All")
    const [search, setSearch] = useState("")

    const counts = useMemo(() => countByStatus(rows), [rows])
    /** Applied + In Review are the candidates still being screened. */
    const inReview = counts.Applied + counts["In Review"]

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase()

        return rows.filter((row) => {
            const matchesFilter =
                filter === "All" ||
                row.status === filter ||
                (filter === "In Review" && row.status === "Applied")
            if (!matchesFilter) return false
            if (!term) return true
            return (
                row.applicantName.toLowerCase().includes(term) ||
                row.email.toLowerCase().includes(term)
            )
        })
    }, [rows, filter, search])

    function handleStatusChange(id: string, status: ApplicationStatus) {
        setRows((previous) =>
            previous.map((row) =>
                row._id === id ? { ...row, status } : row
            )
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statTiles.map((tile) => (
                    <StatTile
                        key={tile.key}
                        label={tile.label}
                        icon={tile.icon}
                        tile={tile.tile}
                        value={
                            tile.key === "total"
                                ? rows.length
                                : tile.key === "review"
                                    ? inReview
                                    : tile.key === "interview"
                                        ? counts.Interview
                                        : counts.Offer
                        }
                    />
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {filters.map((value) => {
                        const active = filter === value
                        const count =
                            value === "All"
                                ? rows.length
                                : value === "In Review"
                                    ? inReview
                                    : counts[value]

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFilter(value)}
                                aria-pressed={active}
                                className={cn(
                                    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                                    active
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {value}
                                <span
                                    className={cn(
                                        "text-xs tabular-nums",
                                        active
                                            ? "opacity-70"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="relative w-full sm:max-w-xs">
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name or email"
                        aria-label="Search applicants"
                        className="h-9 pl-8"
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    title={
                        rows.length === 0
                            ? "No applicants yet"
                            : "No applicants match these filters"
                    }
                    description={
                        rows.length === 0
                            ? `Candidates who apply to ${jobTitle} will appear here for review.`
                            : "Try a different status filter or clear your search."
                    }
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {visible.map((applicant) => (
                        <ApplicantCard
                            key={applicant._id}
                            applicant={applicant}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
