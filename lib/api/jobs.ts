import type { ApiJob } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Reads every job from `GET /jobs`. `query` accepts URL params
 * (e.g. `search=dev&jobType=Full-time`) forwarded to the API.
 */
export const getJobs = async (query = ""): Promise<ApiJob[]> => {
    const response = await fetch(`${BASE_URL}/jobs${query ? `?${query}` : ""}`, {
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to load jobs.")
    }

    return response.json()
}

/** Reads a single job from `GET /jobs/:id`. Returns `null` when it does not exist. */
export const getJobById = async (id: string): Promise<ApiJob | null> => {
    const response = await fetch(`${BASE_URL}/jobs/${id}`, { cache: "no-store" })

    // 400 = malformed id, 404 = unknown id — both mean "no such job".
    if (response.status === 400 || response.status === 404) return null
    if (!response.ok) throw new Error("Failed to load job.")

    return response.json()
}
