export const jobCategories = {
    "engineering-tech": "Engineering & Tech",
    design: "Design",
    marketing: "Marketing",
    sales: "Sales",
    finance: "Finance",
    "customer-support": "Customer Support",
    operations: "Operations",
} as const

export const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
] as const

export const salaryFrequencies = {
    hour: "per hour",
    day: "per day",
    week: "per week",
    month: "per month",
    year: "per year",
} as const

/** Lifecycle badge shown for a listing in the manage-jobs table. */
export type JobStatus = "Active" | "Expired"

/** How a role is worked on-site, hybrid, or remote. */
export type WorkMode = "onsite" | "hybrid" | "remote"

/** Payload posted to `POST /jobs` by the new-job form. */
export type JobFormData = {
    title: string
    companyName: string
    category: keyof typeof jobCategories | ""
    jobType: (typeof jobTypes)[number]
    isRemote: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    salaryFrequency: keyof typeof salaryFrequencies
    responsibilities: string
    requirements: string
    applicants: number
    status: JobStatus
}

/**
 * A job document returned by the API. Older documents use `company` /
 * `frequency` / `qualifications`, newer ones use `companyName` /
 * `salaryFrequency` / `requirements`, so both are accepted.
 */
export type ApiJob = {
    _id?: string
    id?: string
    title?: string
    companyName?: string
    company?: string
    category?: string
    jobType?: string
    isRemote?: boolean
    workMode?: string
    location?: string
    deadline?: string
    minSalary?: string | number
    maxSalary?: string | number
    salaryFrequency?: string
    frequency?: string
    responsibilities?: string
    requirements?: string
    qualifications?: string
    applicants?: number | unknown[]
    createdAt?: string
}

/** A job post as shown in the table: the new-job form data + listing metadata. */
export type JobListing = JobFormData & {
    _id: string
    postedLabel: string
    workMode: WorkMode
    /** ISO timestamp of when the job was posted, when the API provides it. */
    createdAt?: string
}

const salarySuffix: Record<JobFormData["salaryFrequency"], string> = {
    hour: "/ hr",
    day: "/ day",
    week: "/ wk",
    month: "/ mo",
    year: "/ yr",
}

export function categoryLabel(category: JobFormData["category"]) {
    return category ? jobCategories[category] : "Uncategorized"
}

export function formatSalaryValue(value: string) {
    const amount = Number(value)
    if (!value.trim() || !Number.isFinite(amount)) return "—"
    if (amount < 1000) return `€${amount}`

    const thousands = amount / 1000
    const rounded = Number.isInteger(thousands)
        ? thousands
        : Number(thousands.toFixed(1))
    return `€${rounded}k`
}

export function formatCompensation(
    job: Pick<JobFormData, "minSalary" | "maxSalary" | "salaryFrequency">
) {
    if (!job.minSalary && !job.maxSalary) return "Not disclosed"
    const min = job.minSalary ? formatSalaryValue(job.minSalary) : ""
    const max = job.maxSalary ? formatSalaryValue(job.maxSalary) : ""
    const range = min && max ? `${min} – ${max}` : min || max
    return `${range} ${salarySuffix[job.salaryFrequency]}`
}

export function formatDeadline(deadline: string) {
    if (!deadline) return "No deadline"
    const [year, month, day] = deadline.split("-").map(Number)
    if (!year || !month || !day) return deadline
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })
}

export function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    if (!Number.isFinite(diff)) return ""

    const minutes = Math.floor(diff / 60_000)
    if (minutes < 60) return `${Math.max(minutes, 1)}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    const weeks = Math.floor(days / 7)
    if (days < 30) return `${weeks}w`
    return `${Math.floor(days / 30)}mo`
}

/** Normalises a document from `GET /jobs` into a row the UI can render. */
export function mapApiJob(api: ApiJob): JobListing | null {
    const id = api._id ?? api.id
    if (!id || !api.title) return null

    const category =
        api.category && api.category in jobCategories
            ? (api.category as JobFormData["category"])
            : ""

    const jobType = jobTypes.includes(api.jobType as (typeof jobTypes)[number])
        ? (api.jobType as JobFormData["jobType"])
        : "Full-time"

    const frequency = api.salaryFrequency ?? api.frequency ?? "month"
    const salaryFrequency = (frequency in salarySuffix
        ? frequency
        : "month") as JobFormData["salaryFrequency"]

    const isRemote = Boolean(api.isRemote)
    const deadline = api.deadline ?? ""
    const postedLabel = api.createdAt
        ? `Posted ${relativeTime(api.createdAt)} ago`
        : "New posting"

    return {
        _id: id,
        title: api.title,
        companyName: api.companyName ?? api.company ?? "Unknown company",
        category,
        jobType,
        isRemote,
        workMode:
            api.workMode === "hybrid" ||
                api.workMode === "remote" ||
                api.workMode === "onsite"
                ? api.workMode
                : isRemote
                    ? "remote"
                    : "onsite",
        location: api.location || (isRemote ? "Remote" : "Location not set"),
        deadline,
        minSalary: api.minSalary != null ? String(api.minSalary) : "",
        maxSalary: api.maxSalary != null ? String(api.maxSalary) : "",
        salaryFrequency,
        responsibilities: api.responsibilities ?? "",
        requirements: api.requirements ?? api.qualifications ?? "",
        applicants:
            typeof api.applicants === "number"
                ? api.applicants
                : Array.isArray(api.applicants)
                    ? api.applicants.length
                    : 0,
        status:
            deadline && new Date(deadline).getTime() < Date.now()
                ? "Expired"
                : "Active",
        postedLabel,
        createdAt: api.createdAt,
    }
}

/**
 * Numeric recency key used for "Most Recent" sorting: the posted timestamp
 * when available, otherwise the timestamp encoded in a Mongo ObjectId `_id`.
 */
export function jobSortKey(job: JobListing): number {
    if (job.createdAt) {
        const time = Date.parse(job.createdAt)
        if (Number.isFinite(time)) return time
    }
    if (/^[0-9a-f]{24}$/i.test(job._id)) {
        return parseInt(job._id.slice(0, 8), 16) * 1000
    }
    return 0
}
