import type { ApplicationFormData } from "@/lib/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Response shape of `POST /applications` (Mongo insert result). */
export type CreateApplicationResult = {
    insertedId?: string
    acknowledged?: boolean
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

    if (!res.ok) {
        throw new Error("Failed to submit your application.")
    }

    return res.json()
}
