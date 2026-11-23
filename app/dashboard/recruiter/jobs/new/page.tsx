import { DashboardPageHeader } from "@/app/dashboard/_components/page-header"
import { JobForm } from "../_components/job-form"

export default function NewJobPage() {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8">
            <DashboardPageHeader
                crumbs={[
                    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
                    { label: "Create New Listing" },
                ]}
                title="Post a New Job"
                description="Fill in the position specifications to attract qualified talent across our network."
            />
            <JobForm />
        </div>
    )
}
