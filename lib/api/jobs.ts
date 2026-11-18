import type { ApiJob } from "@/lib/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"


export const getJobs = async (): Promise<ApiJob[]> => {
    const response = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })

    if (!response.ok) {
        throw new Error("Failed to load jobs.")
    }

    return response.json()
}
