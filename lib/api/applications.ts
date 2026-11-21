import type { ApiApplication } from "@/lib/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Reads a seeker's own applications from `GET /applications?userId=...`.
 * The API filters by `userId`, so a signed-in seeker only ever sees their rows.
 */
export const getApplicationsByUser = async (userId: string): Promise<ApiApplication[]> => {
    if (!userId) return []

    const response = await fetch(
        `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" }
    )

    if (!response.ok) {
        throw new Error("Failed to load applications.")
    }

    return response.json()
}

/**
 * Counts one seeker's applications: `GET /applications/count?applicantId=<id>`.
 *
 * The id is passed as a parameter rather than a pre-built query string — the
 * API reads `req.query.applicantId`, so any stray whitespace around the `=`
 * silently changes the key and the server ends up counting *every* application
 * in the collection instead of this seeker's.
 */
export const getApplicationsByCount = async (
    applicantId: string
): Promise<{ count: number }> => {
    if (!applicantId) return { count: 0 }

    const response = await fetch(
        `${BASE_URL}/applications/count?applicantId=${encodeURIComponent(applicantId)}`,
        { cache: "no-store" }
    )

    if (!response.ok) {
        throw new Error("Failed to load applications.")
    }

    return response.json()
}

/**
 * True when this seeker already applied for this job
 * (`GET /applications?userId=...&jobId=...`).
 *
 * Returns `false` when the check itself fails — the API deduplicates on
 * insert, so a false negative costs nothing.
 */
export const hasAppliedForJob = async (
    userId: string,
    jobId: string
): Promise<boolean> => {
    if (!userId || !jobId) return false

    const response = await fetch(
        `${BASE_URL}/applications?userId=${encodeURIComponent(
            userId
        )}&jobId=${encodeURIComponent(jobId)}`,
        { cache: "no-store" }
    )

    if (!response.ok) return false

    const rows = (await response.json()) as unknown
    return Array.isArray(rows) && rows.length > 0
}


/** Reads a single application from `GET /applications/:id`. Returns `null` when it does not exist. */
export const getApplicationById = async (id: string): Promise<ApiApplication | null> => {
    const response = await fetch(`${BASE_URL}/applications/${id}`, { cache: "no-store" })

    // 400 = malformed id, 404 = unknown id — both mean "no such application".
    if (response.status === 400 || response.status === 404) return null
    if (!response.ok) throw new Error("Failed to load application.")

    return response.json()
}
