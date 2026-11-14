import { JobFormData } from "@/app/dashboard/recruiter/jobs/new/page";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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

export const getJobs = async (): Promise<ApiJob[]> => {
    const response = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })

    if (!response.ok) {
        throw new Error("Failed to load jobs.")
    }

    return response.json()
}

export const createJob = async (data: JobFormData) => {
const response = await fetch(`${BASE_URL}/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to publish job.")
            }

            return response.json()
};