import type { JobFormData } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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
}

/** Saves edited fields of an existing job (`PATCH /jobs/:id`). */
export const updateJob = async (jobId: string, data: JobFormData) => {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error("Failed to update job.")
    }

    return response.json()
}

export const deleteJob = async (jobId: string) => {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        throw new Error("Failed to delete job.")
    }

    return response.json()
}
