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

/** Reads a single application from `GET /applications/:id`. Returns `null` when it does not exist. */
export const getApplicationById = async (id: string): Promise<ApiApplication | null> => {
    const response = await fetch(`${BASE_URL}/applications/${id}`, { cache: "no-store" })

    // 400 = malformed id, 404 = unknown id — both mean "no such application".
    if (response.status === 400 || response.status === 404) return null
    if (!response.ok) throw new Error("Failed to load application.")

    return response.json()
}
