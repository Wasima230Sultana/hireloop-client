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
}
