import { notFound } from "next/navigation"

import { DashboardPageHeader } from "@/app/dashboard/_components/page-header"
import { getJobById } from "@/lib/api/jobs"
import { mapApiJob } from "@/lib/jobs"
import { JobForm } from "../../_components/job-form"

type EditJobPageProps = {
    params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: EditJobPageProps) {
    const { id } = await params

    const apiJob = await getJobById(id)
    const job = apiJob ? mapApiJob(apiJob) : null

    if (!job) notFound()

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8">
            <DashboardPageHeader
                crumbs={[
                    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
                    {
                        label: job.title,
                        href: `/dashboard/recruiter/jobs/${job._id}`,
                    },
                    { label: "Edit" },
                ]}
                title="Edit Job Post"
                description={`Update the listing details for ${job.title} at ${job.companyName}.`}
            />
            <JobForm job={job} />
        </div>
    )
}
