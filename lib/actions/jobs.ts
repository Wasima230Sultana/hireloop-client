import { JobFormData } from "@/app/dashboard/recruiter/jobs/new/page";


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
};