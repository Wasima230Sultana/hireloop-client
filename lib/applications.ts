/** Lifecycle of an application in the hiring pipeline. */
export type ApplicationStatus =
    | "Applied"
    | "In Review"
    | "Interview"
    | "Offer"
    | "Rejected"
    | "Withdrawn"

export const applicationStatuses = [
    "Applied",
    "In Review",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
] as const

/** Payload posted to `POST /applications` when a seeker applies for a job. */
export type ApplicationFormData = {
    jobId: string
    userId: string
    email: string
    applicantName: string
    jobTitle: string
    companyName: string
    location: string
    jobType: string
    workMode: string
    category: string
    compensation: string
    coverLetter?: string
    status?: ApplicationStatus
}

/** An application document returned by the API. Fields added over time are optional. */
export type ApiApplication = {
    _id?: string
    id?: string
    jobId?: string
    userId?: string
    email?: string
    applicantName?: string
    jobTitle?: string
    companyName?: string
    location?: string
    jobType?: string
    workMode?: string
    category?: string
    compensation?: string
    coverLetter?: string
    status?: string
    appliedAt?: string
    createdAt?: string
}

/** An application as shown in the seeker's list: normalised metadata + row fields. */
export type ApplicationRow = {
    _id: string
    jobId: string
    jobTitle: string
    companyName: string
    location: string
    jobType: string
    workMode: string
    category: string
    compensation: string
    status: ApplicationStatus
    appliedAt: string
    /** Human friendly "Applied 3d ago" label derived from `appliedAt`. */
    appliedLabel: string
}

type StatusMeta = {
    label: string
    /** Badge text/background classes. */
    badge: string
    /** Dot colour classes used inside the badge. */
    dot: string
}

export const applicationStatusMeta: Record<ApplicationStatus, StatusMeta> = {
    Applied: {
        label: "Applied",
        badge: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
        dot: "bg-sky-500",
    },
    "In Review": {
        label: "In Review",
        badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    Interview: {
        label: "Interview",
        badge: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
        dot: "bg-violet-500",
    },
    Offer: {
        label: "Offer",
        badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
    Rejected: {
        label: "Rejected",
        badge: "bg-destructive/10 text-destructive",
        dot: "bg-destructive",
    },
    Withdrawn: {
        label: "Withdrawn",
        badge: "bg-muted text-muted-foreground",
        dot: "bg-muted-foreground/60",
    },
}

/** Meta for statuses not in the canonical list (e.g. future API values). */
const unknownStatusMeta: StatusMeta = {
    label: "Unknown",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
    return applicationStatuses.includes(value as ApplicationStatus)
}

export function applicationStatusMetaFor(status: string): StatusMeta {
    if (isApplicationStatus(status)) return applicationStatusMeta[status]
    return { ...unknownStatusMeta, label: status || "Unknown" }
}

/** "Applied 3d ago" style label; falls back to a locale date when no timestamp exists. */
export function appliedLabel(iso?: string) {
    if (!iso) return "Date not recorded"

    const time = Date.parse(iso)
    if (!Number.isFinite(time)) return iso

    const diff = Date.now() - time
    if (diff < 0) return `in ${Math.ceil(Math.abs(diff) / 86_400_000)}d`

    const minutes = Math.floor(diff / 60_000)
    if (minutes < 60) return `${Math.max(minutes, 1)}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`

    const weeks = Math.floor(days / 7)
    if (days < 30) return `${weeks}w ago`

    const months = Math.floor(days / 30)
    if (days < 365) return `${months}mo ago`

    return `${Math.floor(days / 365)}y ago`
}

/** Full date shown in tooltips / detail rows. */
export function formatAppliedDate(iso?: string) {
    if (!iso) return "—"
    const time = Date.parse(iso)
    if (!Number.isFinite(time)) return iso
    return new Date(time).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })
}

/** Normalises a document from `GET /applications` into a row the UI can render. */
export function mapApiApplication(api: ApiApplication): ApplicationRow | null {
    const id = api._id ?? api.id
    if (!id) return null

    const status = api.status && isApplicationStatus(api.status) ? api.status : "Applied"
    const appliedAt = api.appliedAt ?? api.createdAt ?? ""

    return {
        _id: id,
        jobId: api.jobId ?? "",
        jobTitle: api.jobTitle ?? "Untitled role",
        companyName: api.companyName ?? "Unknown company",
        location: api.location || "Location not set",
        jobType: api.jobType || "Full-time",
        workMode: api.workMode || "onsite",
        category: api.category ?? "",
        compensation: api.compensation || "Not disclosed",
        status,
        appliedAt,
        appliedLabel: appliedLabel(appliedAt),
    }
}

/** Status counts used by the summary tiles on the applications page. */
export function countByStatus(rows: ApplicationRow[]) {
    const counts: Record<ApplicationStatus, number> = {
        Applied: 0,
        "In Review": 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
        Withdrawn: 0,
    }
    for (const row of rows) counts[row.status] += 1
    return counts
}
