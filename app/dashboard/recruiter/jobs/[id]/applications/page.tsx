import { notFound } from "next/navigation"

import { DashboardPageHeader } from "@/app/dashboard/_components/page-header"
import { getApplicationsByJob } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import {
    mapApiApplication,
    type ApplicationRow,
} from "@/lib/applications"
import { mapApiJob } from "@/lib/jobs"
import { ApplicantsList } from "./_components/applicants-list"

type JobApplicationsPageProps = {
    params: Promise<{ id: string }>
}

/** Recruiter's review queue for the candidates who applied to one job. */
export default async function JobApplicationsPage({
    params,
}: JobApplicationsPageProps) {
    const { id } = await params

    const [apiJob, apiApplicants] = await Promise.all([
        getJobById(id),
        getApplicationsByJob(id),
    ])
    const job = apiJob ? mapApiJob(apiJob) : null

    if (!job) notFound()

    const applicants = apiApplicants
        .map(mapApiApplication)
        .filter((row): row is ApplicationRow => row !== null)

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
            <DashboardPageHeader
                crumbs={[
                    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
                    {
                        label: job.title,
                        href: `/dashboard/recruiter/jobs/${job._id}`,
                    },
                    { label: "Applicants" },
                ]}
                title="Applicants"
                description={`Review candidates who applied for ${job.title} and move them through your hiring pipeline.`}
            />

            <ApplicantsList applicants={applicants} jobTitle={job.title} />
        </div>
    )
}
