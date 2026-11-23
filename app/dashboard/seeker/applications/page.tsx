"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Briefcase,
    CalendarDays,
    ChevronRight,
    FileText,
    Inbox,
    LoaderCircle,
    MapPin,
    Search,
    Send,
    TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApplicationStatusBadge } from "@/app/dashboard/_components/application-status-badge"
import { StatTile } from "@/app/dashboard/_components/stat-tile"
import { useSession } from "@/lib/auth-client"
import { getApplicationsByUser } from "@/lib/api/applications"
import {
    applicationStatuses,
    countByStatus,
    formatAppliedDate,
    mapApiApplication,
    type ApplicationRow,
    type ApplicationStatus,
} from "@/lib/applications"
import { cn } from "cn"

/** Summary tiles: label, value accessor, icon, and accent colour. */
const statTiles = [
    { key: "total", label: "Total", icon: FileText, tile: "bg-primary/10 text-primary" },
    { key: "review", label: "In Review", icon: TrendingUp, tile: "bg-amber-500/10 text-amber-500" },
    { key: "interview", label: "Interviews", icon: CalendarDays, tile: "bg-violet-500/10 text-violet-500" },
    { key: "offer", label: "Offers", icon: Send, tile: "bg-emerald-500/10 text-emerald-500" },
] as const

function LocationLine({ row }: { row: ApplicationRow }) {
    return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{row.location}</span>
        </span>
    )
}

const tableHeaders = [
    "Job & Company",
    "Location",
    "Type",
    "Compensation",
    "Applied",
    "Status",
    "Actions",
] as const

type Filter = "All" | ApplicationStatus

export default function SeekerApplicationsPage() {
    const { data: session, isPending } = useSession()
    const user = session?.user

    const [applications, setApplications] = useState<ApplicationRow[]>([])
    const [error, setError] = useState<string | null>(null)
    /** The user whose applications are currently in state (null = none loaded yet). */
    const [loadedFor, setLoadedFor] = useState<string | null>(null)
    const [filter, setFilter] = useState<Filter>("All")
    const [search, setSearch] = useState("")

    const userId = user?.id
    // Pending session, or a signed-in user whose rows have not arrived yet.
    const loading = isPending || Boolean(userId && loadedFor !== userId)

    useEffect(() => {
        if (!userId) return

        let cancelled = false

        async function loadApplications() {
            try {
                const data = await getApplicationsByUser(userId!)
                if (cancelled) return

                setApplications(
                    data
                        .map(mapApiApplication)
                        .filter((row): row is ApplicationRow => row !== null)
                )
                setError(null)
            } catch {
                if (!cancelled) {
                    setError("Could not load your applications from the server.")
                }
            } finally {
                // Async callback, so this does not cascade a render inside the effect.
                if (!cancelled) setLoadedFor(userId!)
            }
        }

        loadApplications()

        return () => {
            cancelled = true
        }
    }, [userId])

    /** Ignore rows belonging to a previously signed-in account while loading. */
    const rowsReady = !userId || loadedFor === userId
    const currentRows = useMemo(
        () => (rowsReady ? applications : []),
        [rowsReady, applications]
    )

    const counts = useMemo(() => countByStatus(currentRows), [currentRows])

    /** Applied + In Review — everything the recruiter is still working through. */
    const inReview = counts["Applied"] + counts["In Review"]

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase()

        return currentRows.filter((row) => {
            const matchesFilter =
                filter === "All" ||
                row.status === filter ||
                // "In Review" bucket also counts applications still marked Applied.
                (filter === "In Review" && row.status === "Applied")
            if (!matchesFilter) return false
            if (!term) return true
            return (
                row.jobTitle.toLowerCase().includes(term) ||
                row.companyName.toLowerCase().includes(term)
            )
        })
    }, [currentRows, filter, search])

    /** Signed out: nothing personal can be shown. */
    if (!isPending && !user) {
        return (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-1.5">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                        <Link href="/dashboard/seeker" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <ChevronRight className="size-3.5" aria-hidden />
                        <span>Job Applications</span>
                    </nav>
                    <h1 className="text-2xl font-semibold tracking-tight">My Applications</h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Track every role you have applied to and where you stand in the
                        hiring process.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <FileText className="size-5" aria-hidden />
                    </span>
                    <p className="font-medium">Sign in to see your applications</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Applications are stored per account, so sign in to view the roles
                        you have applied for.
                    </p>
                    <Link href="/sign-in" className={buttonVariants()}>
                        Sign in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
            {/* Page header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                        <Link href="/dashboard/seeker" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <ChevronRight className="size-3.5" aria-hidden />
                        <span>Job Applications</span>
                    </nav>
                    <h1 className="text-2xl font-semibold tracking-tight">My Applications</h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Track every role you have applied to and where you stand in the
                        hiring process.
                    </p>
                </div>

                <Link href="/browse-jobs" className={buttonVariants({ variant: "outline" })}>
                    <Briefcase aria-hidden />
                    Browse more jobs
                </Link>
            </div>

            {/* Summary tiles */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statTiles.map((tile) => (
                    <StatTile
                        key={tile.key}
                        label={tile.label}
                        icon={tile.icon}
                        tile={tile.tile}
                        value={
                            tile.key === "total"
                                ? currentRows.length
                                : tile.key === "review"
                                    ? inReview
                                    : tile.key === "interview"
                                        ? counts["Interview"]
                                        : counts["Offer"]
                        }
                    />
                ))}
            </div>

            {/* Sync status */}
            <p
                role="status"
                className="flex items-center gap-2 text-xs text-muted-foreground"
            >
                {loading && (
                    <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
                )}
                <span>
                    {loading
                        ? "Syncing your applications from the server…"
                        : `${currentRows.length} application${currentRows.length === 1 ? "" : "s"} on file`}
                </span>
            </p>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {(["All", ...applicationStatuses] as Filter[]).map((value) => {
                        const active = filter === value
                        const count =
                            value === "All"
                                ? currentRows.length
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
                                        active ? "opacity-70" : "text-muted-foreground"
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
                        placeholder="Search title or company"
                        aria-label="Search applications"
                        className="h-9 pl-8"
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                loading ? null : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Inbox className="size-5" aria-hidden />
                        </span>
                        <p className="font-medium">
                            {currentRows.length === 0
                                ? "No applications yet"
                                : "No applications match these filters"}
                        </p>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            {currentRows.length === 0
                                ? "Apply to a role and it will show up here with its status."
                                : "Try a different status filter or clear your search."}
                        </p>
                        {currentRows.length === 0 && (
                            <Link href="/browse-jobs" className={buttonVariants()}>
                                <Briefcase aria-hidden />
                                Browse jobs
                            </Link>
                        )}
                    </div>
                )
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
                        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                            <caption className="sr-only">
                                Your job applications: role, location, type, compensation,
                                application date, and status.
                            </caption>
                            <thead>
                                <tr className="border-b border-border text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                                    {tableHeaders.map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className={cn(
                                                "px-4 py-3",
                                                header === "Actions" && "text-right"
                                            )}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((row) => (
                                    <tr
                                        key={row._id}
                                        className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="max-w-[260px] px-4 py-3 align-middle">
                                            <p className="truncate font-medium">
                                                {row.jobTitle}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {row.companyName}
                                            </p>
                                        </td>

                                        <td className="max-w-[180px] px-4 py-3 align-middle">
                                            <LocationLine row={row} />
                                        </td>

                                        <td className="px-4 py-3 align-middle">
                                            <Badge
                                                variant="secondary"
                                                className="whitespace-nowrap"
                                            >
                                                {row.jobType}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3 align-middle whitespace-nowrap tabular-nums text-muted-foreground">
                                            {row.compensation}
                                        </td>

                                        <td
                                            className="px-4 py-3 align-middle whitespace-nowrap"
                                            title={formatAppliedDate(row.appliedAt)}
                                        >
                                            <span className="text-sm font-medium">
                                                {row.appliedLabel}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                {formatAppliedDate(row.appliedAt)}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3 align-middle">
                                            <ApplicationStatusBadge status={row.status} />
                                        </td>

                                        <td className="px-4 py-3 text-right align-middle">
                                            {row.jobId ? (
                                                <Link
                                                    href={`/browse-jobs/${row.jobId}`}
                                                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                                                >
                                                    View job
                                                    <ChevronRight
                                                        className="size-3.5"
                                                        aria-hidden
                                                    />
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile / tablet cards */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        {visible.map((row) => (
                            <article
                                key={row._id}
                                className="rounded-xl border border-border bg-card p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {row.jobTitle}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {row.companyName}
                                        </p>
                                    </div>
                                    <ApplicationStatusBadge status={row.status} />
                                </div>

                                <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                            Location
                                        </dt>
                                        <dd className="min-w-0 text-right">
                                            <LocationLine row={row} />
                                        </dd>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                            Type
                                        </dt>
                                        <dd>
                                            <Badge
                                                variant="secondary"
                                                className="whitespace-nowrap"
                                            >
                                                {row.jobType}
                                            </Badge>
                                        </dd>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                            Compensation
                                        </dt>
                                        <dd className="text-right font-medium tabular-nums">
                                            {row.compensation}
                                        </dd>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                            Applied
                                        </dt>
                                        <dd
                                            className="text-right font-medium"
                                            title={formatAppliedDate(row.appliedAt)}
                                        >
                                            {row.appliedLabel}
                                        </dd>
                                    </div>
                                </dl>

                                {row.jobId && (
                                    <div className="mt-4 border-t border-border pt-3">
                                        <Link
                                            href={`/browse-jobs/${row.jobId}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                                        >
                                            View job
                                            <ChevronRight className="size-3.5" aria-hidden />
                                        </Link>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
