import type { ApplicationFormData } from "@/lib/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Response shape of `POST /applications` (Mongo insert result). */
export type CreateApplicationResult = {
    insertedId?: string
    acknowledged?: boolean
    /** `true` when the API returned an existing row instead of inserting. */
    duplicate?: boolean
}

/**
 * The API refused the application. Carries the HTTP status so callers can
 * react to `402` (quota reached) differently from a plain server error, and
 * the server's own message so the seeker sees the real reason.
 */
export class ApplicationRejectedError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApplicationRejectedError"
        this.status = status
    }
}

/** Saves a new application document to the `applications` collection. */
export const createApplication = async (
    data: ApplicationFormData
): Promise<CreateApplicationResult> => {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })

    const body = (await res.json().catch(() => null)) as
        | (CreateApplicationResult & { error?: string })
        | null

    if (!res.ok) {
        throw new ApplicationRejectedError(
            body?.error || "Failed to submit your application.",
            res.status
        )
    }

    return body ?? {}
}
